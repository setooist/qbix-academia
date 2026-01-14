// Interface for populated assignment with relations
interface PopulatedAssignment {
    id: number;
    assignee?: {
        id: number;
        email?: string;
        fullName?: string;
        username?: string;
    };
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

export default {
    async afterCreate(event) {
        const { result } = event;
        strapi.log.info('Lifecycle afterCreate triggered for Assignment ID:', result.id);


        try {
            // Fetch the full assignment with relations to get assignee and activity details
            const assignment = await strapi.entityService.findOne(
                'api::activity-assignment.activity-assignment',
                result.id,
                {
                    populate: {
                        assignee: true,
                        activity_template: true,
                        mentor: true,
                    },
                }
            ) as PopulatedAssignment | null;

            // Only send email if there's an assignee with an email
            if (assignment?.assignee?.email) {
                const studentName = assignment.assignee.fullName || assignment.assignee.username || 'Student';
                const activityTitle = assignment.activity_template?.title || 'New Activity';
                const mentorName = assignment.mentor?.fullName || assignment.mentor?.username || 'Your Mentor';
                const dueDate = assignment.due_date
                    ? new Date(assignment.due_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                    : 'Not specified';

                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

                await strapi.plugins['email'].services.email.send({
                    to: assignment.assignee.email,
                    subject: `New Activity Assigned: ${activityTitle}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                <div style="background: #3b82f6; background: linear-gradient(135deg, #3b82f6, #f97316); padding: 30px; border-radius: 12px 12px 0 0;">
                                    <h1 style="color: white; margin: 0; font-size: 24px;">New Activity Assigned</h1>
                                </div>
                                <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                                        Hello <strong>${studentName}</strong>,
                                    </p>
                                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                                        You have been assigned a new activity. Here are the details:
                                    </p>
                                    <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                                        <h2 style="margin: 0 0 10px 0; color: #1e40af; font-size: 20px;">${activityTitle}</h2>
                                        <p style="margin: 5px 0; color: #64748b;">
                                            <strong>Assigned by:</strong> ${mentorName}
                                        </p>
                                        <p style="margin: 5px 0; color: #64748b;">
                                            <strong>Due Date:</strong> ${dueDate}
                                        </p>
                                    </div>
                                    <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
                                        Please log in to your account to view the full activity details and start working on it.
                                    </p>
                                    
                                    <!-- Button with Outlook Support -->
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" bgcolor="#3b82f6" style="border-radius: 8px;">
                                                <a href="${frontendUrl}/account/activities" 
                                                   target="_blank"
                                                   style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; text-decoration: none;border-radius: 8px; padding: 14px 28px; border: 1px solid #3b82f6; display: inline-block; font-weight: bold; background-image: linear-gradient(135deg, #3b82f6, #f97316);">
                                                    View Activity
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- End Button -->

                                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                                    <p style="font-size: 14px; color: #94a3b8; margin: 0;">
                                        Best regards,<br>
                                        <strong>QBIX Academia Team</strong>
                                    </p>
                                </div>
                                <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">
                                    This is an automated message from QBIX Academia. Please do not reply to this email.
                                </p>
                            </div>
                        </body>
                        </html>
                    `,
                });

                strapi.log.info(`Email notification sent to ${assignment.assignee.email} for activity: ${activityTitle}`);
            }
        } catch (error) {
            strapi.log.error('Failed to send activity assignment email notification:', error);
            // Don't throw - we don't want email failure to break the assignment creation
        }
    },
};
