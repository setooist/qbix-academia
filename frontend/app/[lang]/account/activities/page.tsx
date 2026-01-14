'use client';

import { Suspense } from 'react';
import { StudentActivitiesDashboard } from '@/components/dashboard/StudentActivitiesDashboard';

export default function StudentActivities() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StudentActivitiesDashboard />
        </Suspense>
    );
}
