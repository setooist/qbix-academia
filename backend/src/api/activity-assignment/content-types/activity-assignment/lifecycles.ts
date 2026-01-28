interface Assignee {
    id: number;
    email?: string;
    fullName?: string;
    username?: string;
    phone?: string;
}

interface PopulatedAssignment {
    id: number;
    assignees?: Assignee[];
    activity_template?: {
        id: number;
        title?: string;
    };
    mentor?: {
        id: number;
        fullName?: string;
        username?: string;
    };
    due_date?: string;
    grade?: number;
}

// Meta WhatsApp Business API Configuration
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface WhatsAppApiResponse {
    messages?: Array<{
        id: string;
    }>;
    error?: {
        message: string;
        code: number;
    };
}

/**
 * Send generic WhatsApp template message
 */
async function sendWhatsAppTemplate(
    toPhone: string,
    templateName: string,
    parameters: any[]
): Promise<boolean> {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
        strapi.log.warn('Meta WhatsApp API credentials missing. Skipping WhatsApp notification.');
        return false;
    }

    // Format phone number (remove any non-numeric except +)
    let formattedPhone = toPhone.replace(/[^\d+]/g, '');
    // Remove leading + if present (Meta API expects just the number)
    if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const messageBody = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'template',
        template: {
            name: templateName,
            language: {
                code: 'en_US'
            },
            components: [
                {
                    type: 'body',
                    parameters: parameters
                }
            ]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageBody),
        });

        const data = await response.json() as WhatsAppApiResponse;

        if (response.ok && data.messages && data.messages[0]?.id) {
            strapi.log.info(`WhatsApp (${templateName}) sent to ${formattedPhone}`);
            return true;
        } else {
            strapi.log.error(`WhatsApp send failed: ${JSON.stringify(data)}`);
            return false;
        }
    } catch (error: any) {
        strapi.log.error(`WhatsApp error: ${error.message}`);
        return false;
    }
}

export default {
    async afterCreate(event) {
        await sendAssignmentNotification(event);
    },

    async afterUpdate(event) {
        // Send notification if assignees are being updated (new assignment)
        if (event.params.data && event.params.data.assignees) {
            await sendAssignmentNotification(event);
        }

        // Send notification if status changed to needs_changes
        if (event.params.data && event.params.data.assignment_status === 'needs_changes') {
            await sendChangesRequestedNotification(event);
        }

        // Send notification if status changed to approved
        if (event.params.data && event.params.data.assignment_status === 'approved') {
            await sendApprovedNotification(event);
        }
    }
};

async function sendAssignmentNotification(event) {
    const { result } = event;
    if (!result) return;

    try {
        const assignment = await strapi.entityService.findOne(
            'api::activity-assignment.activity-assignment',
            result.id,
            {
                populate: {
                    assignees: {
                        fields: ['id', 'email', 'fullName', 'username', 'phone']
                    },
                    activity_template: true,
                    mentor: true,
                },
            }
        ) as PopulatedAssignment;

        const assignees = assignment?.assignees;
        if (!assignees || assignees.length === 0) return;

        const activityTitle =
            assignment.activity_template?.title || 'New Activity';

        const mentorName =
            assignment.mentor?.fullName ||
            assignment.mentor?.username ||
            'Mentor';

        const dueDate = assignment.due_date
            ? new Date(assignment.due_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : 'Not specified';

        const frontendUrl =
            process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

        // 1. Send EMAIL to each assignee
        const emailPromises = assignees
            .filter((assignee) => assignee.email)
            .map((assignee) => {
                const studentName =
                    assignee.fullName || assignee.username || 'Student';

                return strapi
                    .plugin('email')
                    .service('email')
                    .send({
                        to: assignee.email,
                        subject: `New Activity Assigned: ${activityTitle}`,
                        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background:#f5f5f5; padding:20px">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#3b82f6,#f97316);padding:20px;color:#fff">
      <h2>New Activity Assigned</h2>
    </div>
    <div style="padding:20px">
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>You have been assigned a new activity.</p>

      <div style="background:#f8fafc;padding:15px;border-left:4px solid #3b82f6">
        <p><strong>Activity:</strong> ${activityTitle}</p>
        <p><strong>Mentor:</strong> ${mentorName}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>

      <a href="${frontendUrl}/account/activities"
         style="display:inline-block;margin-top:20px;padding:12px 20px;
                background:#3b82f6;color:#fff;text-decoration:none;
                border-radius:6px">
        View Activity
      </a>
      <p style="margin-top:30px;font-size:12px;color:#888">QBIX Academia Team</p>
    </div>
  </div>
</body>
</html>
                        `,
                    });
            });

        // 2. Send WHATSAPP to each assignee using Meta's API
        const whatsappPromises = assignees
            .filter((assignee) => assignee.phone)
            .map((assignee) => {
                const studentName = assignee.fullName || assignee.username || 'Student';

                if (!assignee.phone) {
                    strapi.log.warn(`Skipping WhatsApp for ${studentName}: Phone number missing`);
                    return Promise.resolve(false);
                }

                return sendWhatsAppTemplate(
                    assignee.phone,
                    'activity_notification',
                    [
                        { type: 'text', text: studentName },      // {{1}}
                        { type: 'text', text: activityTitle },    // {{2}}
                        { type: 'text', text: dueDate },          // {{3}}
                        { type: 'text', text: mentorName }        // {{4}}
                    ]
                );
            });

        await Promise.all([...emailPromises, ...whatsappPromises]);

    } catch (error) {
        strapi.log.error('Notification logic failed:', error);
    }
}

/**
 * Send email notification when changes are requested
 */
async function sendChangesRequestedNotification(event) {
    const { result } = event;
    if (!result) return;

    try {
        const assignment = await strapi.entityService.findOne(
            'api::activity-assignment.activity-assignment',
            result.id,
            {
                populate: {
                    assignees: {
                        fields: ['id', 'email', 'fullName', 'username', 'phone']
                    },
                    activity_template: true,
                    mentor: true,
                },
            }
        ) as PopulatedAssignment;

        const assignees = assignment?.assignees;
        if (!assignees || assignees.length === 0) return;

        const activityTitle = assignment.activity_template?.title || 'Activity';
        const mentorName = assignment.mentor?.fullName || assignment.mentor?.username || 'Activity Manager';
        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

        const emailPromises = assignees
            .filter((assignee) => assignee.email)
            .map((assignee) => {
                const studentName = assignee.fullName || assignee.username || 'Student';

                return strapi
                    .plugin('email')
                    .service('email')
                    .send({
                        to: assignee.email,
                        subject: `⚠️ Changes Requested: ${activityTitle}`,
                        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background:#f5f5f5; padding:20px">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:20px;color:#fff">
      <h2>⚠️ Changes Requested</h2>
    </div>
    <div style="padding:20px">
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Your submission for <strong>${activityTitle}</strong> needs some changes.</p>

      <div style="background:#fef2f2;padding:15px;border-left:4px solid #ef4444;margin:20px 0">
        <p style="margin:0"><strong>Activity:</strong> ${activityTitle}</p>
        <p style="margin:8px 0 0"><strong>Reviewed by:</strong> ${mentorName}</p>
      </div>

      <p>Please review the feedback and resubmit your work.</p>

      <a href="${frontendUrl}/account/activities"
         style="display:inline-block;margin-top:20px;padding:12px 20px;
                background:#ef4444;color:#fff;text-decoration:none;
                border-radius:6px">
        View Feedback
      </a>
      <p style="margin-top:30px;font-size:12px;color:#888">QBIX Academia Team</p>
    </div>
  </div>
</body>
</html>
                        `,
                    });
            });

        const whatsappPromises = assignees
            .filter((assignee) => assignee.phone)
            .map((assignee) => {
                const studentName = assignee.fullName || assignee.username || 'Student';

                return sendWhatsAppTemplate(
                    assignee.phone!,
                    'changes_requested',
                    [
                        { type: 'text', text: studentName },      // {{1}}
                        { type: 'text', text: activityTitle },    // {{2}}
                        { type: 'text', text: mentorName }        // {{3}}
                    ]
                );
            });

        await Promise.all([...emailPromises, ...whatsappPromises]);
        strapi.log.info(`Changes requested notification sent for assignment ${result.id}`);

    } catch (error) {
        strapi.log.error('Changes requested notification failed:', error);
    }
}

/**
 * Send email notification when assignment is approved
 */
async function sendApprovedNotification(event) {
    const { result } = event;
    if (!result) return;

    try {
        const assignment = await strapi.entityService.findOne(
            'api::activity-assignment.activity-assignment',
            result.id,
            {
                populate: {
                    assignees: {
                        fields: ['id', 'email', 'fullName', 'username', 'phone']
                    },
                    activity_template: true,
                    mentor: true,
                },
            }
        ) as PopulatedAssignment;

        const assignees = assignment?.assignees;
        if (!assignees || assignees.length === 0) return;

        const activityTitle = assignment.activity_template?.title || 'Activity';
        const mentorName = assignment.mentor?.fullName || assignment.mentor?.username || 'Activity Manager';
        const grade = assignment.grade ?? 'Not graded';
        const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

        const emailPromises = assignees
            .filter((assignee) => assignee.email)
            .map((assignee) => {
                const studentName = assignee.fullName || assignee.username || 'Student';

                return strapi
                    .plugin('email')
                    .service('email')
                    .send({
                        to: assignee.email,
                        subject: `✅ Approved: ${activityTitle}`,
                        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; background:#f5f5f5; padding:20px">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#22c55e,#10b981);padding:20px;color:#fff">
      <h2>🎉 Congratulations!</h2>
    </div>
    <div style="padding:20px">
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Your submission for <strong>${activityTitle}</strong> has been approved!</p>

      <div style="background:#f0fdf4;padding:15px;border-left:4px solid #22c55e;margin:20px 0">
        <p style="margin:0"><strong>Activity:</strong> ${activityTitle}</p>
        <p style="margin:8px 0 0"><strong>Approved by:</strong> ${mentorName}</p>
        <p style="margin:8px 0 0"><strong>Grade:</strong> ${grade}/100</p>
      </div>

      <p>Great work! Keep up the excellent effort.</p>

      <a href="${frontendUrl}/account/activities"
         style="display:inline-block;margin-top:20px;padding:12px 20px;
                background:#22c55e;color:#fff;text-decoration:none;
                border-radius:6px">
        View Details
      </a>
      <p style="margin-top:30px;font-size:12px;color:#888">QBIX Academia Team</p>
    </div>
  </div>
</body>
</html>
                        `,
                    });
            });

        const whatsappPromises = assignees
            .filter((assignee) => assignee.phone)
            .map((assignee) => {
                const studentName = assignee.fullName || assignee.username || 'Student';
                const gradeText = grade.toString();

                return sendWhatsAppTemplate(
                    assignee.phone!,
                    'activity_approved',
                    [
                        { type: 'text', text: studentName },      // {{1}}
                        { type: 'text', text: activityTitle },    // {{2}}
                        { type: 'text', text: gradeText },        // {{3}}
                        { type: 'text', text: mentorName }        // {{4}}
                    ]
                );
            });

        await Promise.all([...emailPromises, ...whatsappPromises]);
        strapi.log.info(`Approved notification sent for assignment ${result.id}`);

    } catch (error) {
        strapi.log.error('Approved notification failed:', error);
    }
}
