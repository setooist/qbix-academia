'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Recommendation } from '@/lib/api/recommendations';
import { checkAccess } from '@/components/auth/access-gate';
import {
    ContentSection,
    MobileActionButtons,
    RecommendationActions,
    RecommendationImage,
    RecommendationMetadata,
    Sidebar
} from './recommendation-components';

interface RecommendationViewProps {
    readonly recommendation: Recommendation;
}

export function RecommendationView({ recommendation }: RecommendationViewProps) {
    const { user } = useAuth();

    const accessible = checkAccess(user, recommendation.allowedTiers, recommendation.allowedRoles);

    // Determine if it's a subscription-based restriction (for CTA text)
    const isSubscriptionRestricted = Boolean(
        recommendation.allowedTiers &&
        recommendation.allowedTiers.length > 0 &&
        !recommendation.allowedTiers.includes('FREE')
    );

    return (
        <article className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 flex flex-col md:flex-row gap-8">
                    {/* Cover Image */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <RecommendationImage recommendation={recommendation} accessible={accessible} />
                        <MobileActionButtons recommendation={recommendation} accessible={accessible} />
                    </div>

                    {/* Metadata */}
                    <div className="flex-grow">
                        <RecommendationMetadata
                            recommendation={recommendation}
                            accessible={accessible}
                            isSubscriptionRestricted={isSubscriptionRestricted}
                        />

                        {/* Action Buttons for Desktop */}
                        <RecommendationActions
                            recommendation={recommendation}
                            accessible={accessible}
                            user={user}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <ContentSection
                        recommendation={recommendation}
                        accessible={accessible}
                        isSubscriptionRestricted={isSubscriptionRestricted}
                    />

                    {/* Sidebar: Key Takeaways */}
                    <Sidebar
                        recommendation={recommendation}
                        accessible={accessible}
                        isSubscriptionRestricted={isSubscriptionRestricted}
                    />
                </div>
            </div>
        </article>
    );
}
