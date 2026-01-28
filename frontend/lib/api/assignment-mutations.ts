
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('strapi_jwt');
    }
    return null;
}

export async function updateAssignmentStatus(
    documentId: string,
    newStatus: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'needs_changes'
) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activity-assignments/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                assignment_status: newStatus,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Update assignment status error:', error);
        throw new Error(error.error?.message || 'Failed to update status');
    }

    return await response.json();
}

export async function uploadAssignmentSubmission(assignmentDocumentId: string, files: File[]) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // 1. Upload files
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!uploadResponse.ok) {
        throw new Error('Failed to upload files');
    }

    const uploadedFiles = await uploadResponse.json();
    const fileIds = uploadedFiles.map((f: any) => f.id);

    // 1.5 Delete existing submissions (Replace mode)
    // Fetch current assignment to get existing submissions
    try {
        const checkResponse = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}?populate=submissions`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            // Handle Strapi 5 vs 4 structure
            const assignment = checkData.data?.attributes || checkData.data;
            const submissions = assignment?.submissions?.data || assignment?.submissions || [];

            // Delete each existing submission
            for (const sub of submissions) {
                const subId = sub.documentId || sub.id; // Try documentId first for Strapi 5
                if (subId) {
                    await fetch(`${STRAPI_URL}/api/submissions/${subId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                }
            }
        }
    } catch (err) {
        console.error("Failed to clear old submissions:", err);
        // Continue anyway - don't block upload
    }

    // 2. Create Submission
    const submissionResponse = await fetch(`${STRAPI_URL}/api/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                activity_assignment: assignmentDocumentId,
                uploaded_files: fileIds,
                submitted_at: new Date(),
                // submitted_by should be handled by backend if user is auth
            }
        }),
    });

    if (!submissionResponse.ok) {
        throw new Error('Failed to create submission');
    }

    // 3. Update Assignment Status
    const updateResponse = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                assignment_status: 'submitted',
            },
        }),
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to update assignment status');
    }

    return await updateResponse.json();
}

export async function addAssignmentFeedback(
    assignmentDocumentId: string,
    feedback: {
        author: string;
        authorRole: 'mentor' | 'student' | 'admin' | 'activity_manager';
        message: string;
        timestamp: string;
    }
) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // Get current
    const getResponse = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!getResponse.ok) throw new Error('Failed to fetch assignment');
    const data = await getResponse.json();

    // Handle both Strapi 5 (flattened) and v4 (nested attributes) structures
    const assignmentData = data.data?.attributes || data.data;
    const currentFeedback = assignmentData?.feedback_thread || [];

    const updatedFeedback = [
        ...currentFeedback,
        {
            id: Date.now().toString(),
            ...feedback,
        },
    ];

    const updateResponse = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                feedback_thread: updatedFeedback,
            },
        }),
    });

    if (!updateResponse.ok) {
        const error = await updateResponse.json();
        console.error('Add feedback error:', error);
        throw new Error(error.error?.message || 'Failed to add feedback');
    }
    return await updateResponse.json();
}

export async function gradeAssignment(assignmentDocumentId: string, grade: number) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: { grade },
        }),
    });

    if (!response.ok) throw new Error('Failed to grade assignment');
    return await response.json();
}

export async function approveAssignment(assignmentDocumentId: string, grade?: number, feedback?: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const updateData: any = { assignment_status: 'approved' };
    if (grade !== undefined) updateData.grade = grade;

    const response = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: updateData }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Approve assignment error:', error);
        throw new Error(error.error?.message || 'Failed to approve assignment');
    }

    if (feedback) {
        await addAssignmentFeedback(assignmentDocumentId, {
            author: 'Mentor',
            authorRole: 'mentor',
            message: feedback,
            timestamp: new Date().toISOString(),
        });
    }

    return await response.json();
}

export async function requestAssignmentChanges(assignmentDocumentId: string, feedback: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activity-assignments/${assignmentDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: { assignment_status: 'needs_changes' },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Request changes error:', error);
        throw new Error(error.error?.message || 'Failed to request changes');
    }

    await addAssignmentFeedback(assignmentDocumentId, {
        author: 'Mentor',
        authorRole: 'mentor',
        message: feedback,
        timestamp: new Date().toISOString(),
    });

    return await response.json();
}

export async function startAssignment(assignmentDocumentId: string) {
    return updateAssignmentStatus(assignmentDocumentId, 'in_progress');
}

export async function createAssignment(data: {
    activity: string; // Activity Template Document ID
    user: string;     // User ID
    mentor?: string;  // Mentor ID
    dueDate?: string;
}) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activity-assignments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                activity_template: data.activity,
                assignee: data.user,
                mentor: data.mentor,
                due_date: data.dueDate,
                assignment_status: 'not_started',
            }
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to create assignment');
    }
    return await response.json();
}
