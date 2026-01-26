import twilio from 'twilio';

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
}

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886'

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export default {
    async afterCreate(event) {
        await sendAssignmentNotification(event);
    },

    async afterUpdate(event) {
        // Only send notification if assignees are being updated
        if (event.params.data && event.params.data.assignees) {
            await sendAssignmentNotification(event);
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
                    assignees: true,
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

        // 2. Send WHATSAPP to each assignee (if phone exists and Twilio configured)
        let whatsappPromises: Promise<any>[] = [];

        if (twilioClient && fromNumber) {
            whatsappPromises = assignees
                .filter((assignee) => assignee.phone)
                .map((assignee) => {
                    const studentName = assignee.fullName || assignee.username || 'Student';
                    // Ensure phone has whatsapp: prefix if not present
                    // Twilio expects "whatsapp:+1234567890"
                    let toPhone = assignee.phone!;
                    if (!toPhone.startsWith('whatsapp:')) {
                        // Assuming phone is E.164 format +123..., prefix it
                        toPhone = `whatsapp:${toPhone}`;
                    }

                    const messageBody = `📚 *New Activity Assigned*\n\nHello ${studentName},\n\nYou have been assigned: *${activityTitle}*\n\n🗓 Due: ${dueDate}\n👨‍🏫 Mentor: ${mentorName}\n\nView Details: ${frontendUrl}/account/activities`;

                    return twilioClient.messages.create({
                        from: fromNumber,
                        to: toPhone,
                        body: messageBody
                    }).catch(err => {
                        strapi.log.error(`WhatsApp send failed for ${toPhone}:`, err.message);
                        return null; // Don't block other promises
                    });
                });
        } else if (assignees.some(a => a.phone) && !twilioClient) {
            strapi.log.warn('Twilio credentials missing. Skipping WhatsApp notifications.');
        }

        await Promise.all([...emailPromises, ...whatsappPromises]);

    } catch (error) {
        strapi.log.error('Notification logic failed:', error);
    }
}
