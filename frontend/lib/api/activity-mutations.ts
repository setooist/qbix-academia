/**
 * Activity Mutations API
 * Handles all write operations for activities including:
 * - Status transitions
 * - File uploads
 * - Feedback management
 * - Assignment creation
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('strapi_jwt');
    }
    return null;
}

/**
 * Update activity status
 */
export async function updateActivityStatus(
    documentId: string,
    newStatus: 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'under_review' | 'approved' | 'changes_requested'
) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activities/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                activityStatus: newStatus,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update status');
    }

    return await response.json();
}

/**
 * Upload submission files to an activity
 */
export async function uploadSubmission(activityDocumentId: string, files: File[]) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // First, upload files to Strapi media library
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

    // Then, link files to the activity's submissionUploads field
    const updateResponse = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                submissionUploads: fileIds,
                activityStatus: 'submitted', // Auto-transition to submitted
            },
        }),
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to link files to activity');
    }

    return await updateResponse.json();
}

/**
 * Add feedback to an activity's feedback thread
 */
export async function addFeedback(
    activityDocumentId: string,
    feedback: {
        author: string;
        authorRole: 'mentor' | 'student' | 'admin';
        message: string;
        timestamp: string;
    }
) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // First get current feedback thread
    const getResponse = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!getResponse.ok) {
        throw new Error('Failed to fetch activity');
    }

    const activityData = await getResponse.json();
    const currentFeedback = activityData.data?.attributes?.feedbackThread || [];

    // Append new feedback
    const updatedFeedback = [
        ...currentFeedback,
        {
            id: Date.now().toString(),
            ...feedback,
        },
    ];

    // Update the activity
    const updateResponse = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                feedbackThread: updatedFeedback,
            },
        }),
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to add feedback');
    }

    return await updateResponse.json();
}

/**
 * Grade an activity (mentor only)
 */
export async function gradeActivity(activityDocumentId: string, grade: number) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                grade,
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to grade activity');
    }

    return await response.json();
}

/**
 * Approve activity (mentor only)
 */
export async function approveActivity(activityDocumentId: string, grade?: number, feedback?: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const updateData: any = {
        activityStatus: 'approved',
    };

    if (grade !== undefined) {
        updateData.grade = grade;
    }

    const response = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ data: updateData }),
    });

    if (!response.ok) {
        throw new Error('Failed to approve activity');
    }

    // Add feedback if provided
    if (feedback) {
        await addFeedback(activityDocumentId, {
            author: 'Mentor',
            authorRole: 'mentor',
            message: feedback,
            timestamp: new Date().toISOString(),
        });
    }

    return await response.json();
}

/**
 * Request changes on activity (mentor only)
 */
export async function requestChanges(activityDocumentId: string, feedback: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // Update status
    const response = await fetch(`${STRAPI_URL}/api/activities/${activityDocumentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                activityStatus: 'changes_requested',
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to request changes');
    }

    // Add feedback
    await addFeedback(activityDocumentId, {
        author: 'Mentor',
        authorRole: 'mentor',
        message: feedback,
        timestamp: new Date().toISOString(),
    });

    return await response.json();
}

/**
 * Start working on an activity (student)
 */
export async function startActivity(activityDocumentId: string) {
    return updateActivityStatus(activityDocumentId, 'in_progress');
}

/**
 * Create a new activity (admin only)
 */
export async function createActivity(activityData: {
    title: string;
    slug?: string;
    excerpt?: string;
    description?: any;
    category?: string;
    tags?: string[];
    assignee?: string;
    mentor?: string;
    startDate?: string;
    dueDate?: string;
    downloadables?: number[];
    allowedRoles?: string[];
}) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    // Generate slug if not provided
    const slug = activityData.slug || activityData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const response = await fetch(`${STRAPI_URL}/api/activities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                ...activityData,
                slug,
                activityStatus: 'assigned',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create activity');
    }

    return await response.json();
}

/**
 * Fetch all users (for assignment dropdowns)
 */
export async function getUsers() {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/users?populate=role`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return await response.json();
}

/**
 * Fetch categories for activity form
 */
export async function getCategories() {
    const response = await fetch(`${STRAPI_URL}/api/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.data || [];
}

/**
 * Fetch activities assigned to a specific mentor
 */
export async function getActivitiesForMentor(mentorId: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(
        `${STRAPI_URL}/api/activities?filters[mentor][id][$eq]=${mentorId}&populate=*`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch mentor activities');
    }

    const data = await response.json();
    return data.data || [];
}

/**
 * Fetch activities assigned to a specific student
 */
export async function getActivitiesForStudent(studentId: string) {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(
        `${STRAPI_URL}/api/activities?filters[assignee][id][$eq]=${studentId}&populate=*`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch student activities');
    }

    const data = await response.json();
    return data.data || [];
}

/**
 * Create a new assignment (Activity Manager)
 */
export async function createAssignment(data: {
    activity_template: string;
    assignees: string[];
    mentor: string;
    due_date?: string;
    assignment_status?: string;
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
                ...data,
                assignment_status: data.assignment_status || 'not_started',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to assign activity');
    }

    return await response.json();
}

/**
 * Fetch activity templates
 */
export async function getActivityTemplates() {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${STRAPI_URL}/api/activity-templates`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch activity templates');
    }

    const data = await response.json();
    return data.data || [];
}
