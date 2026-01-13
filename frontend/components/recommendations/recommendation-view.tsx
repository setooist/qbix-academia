'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Recommendation } from '@/lib/api/recommendations';
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

const isMentor = (user: any) => {
    const userRoleName = user?.role?.name?.toLowerCase();
    const userRoleType = user?.role?.type?.toLowerCase();
    return userRoleName === 'mentor' || userRoleType === 'mentor';
};

const hasActiveSubscription = (user: any) => {
    if (user.subscriptionActive === true) return true;
    return user.subscriptions?.some(
        (sub: any) => sub.subscription_status === 'active'
    );
};

const checkTierAccess = (user: any, allowedTiers: string[]) => {
    if (allowedTiers.includes('FREE')) return true;

    if (!user) return false;

    if (isMentor(user)) return true;

    const userTier = user.tier || 'FREE';
    if (allowedTiers.includes(userTier)) return true;

    if (allowedTiers.includes('SUBSCRIPTION') && hasActiveSubscription(user)) {
        return true;
    }

    return false;
};

const checkRoleAccess = (user: any, allowedRoles: any[] | undefined) => {
    if (!allowedRoles) return false;
    if (allowedRoles.length === 0) return true;

    const isPubliclyAllowed = allowedRoles.some(
        (r: any) => r.type === 'public' || (r.name && r.name.toLowerCase() === 'public')
    );
    if (isPubliclyAllowed) return true;

    if (!user) return false;

    if (isMentor(user)) return true;

    const userRoleType = user.role?.type?.toLowerCase();
    const userRoleName = user.role?.name?.toLowerCase();

    return allowedRoles.some((r: any) =>
        (r.type && r.type.toLowerCase() === userRoleType) ||
        (r.name && r.name.toLowerCase() === userRoleName)
    );
};

export function RecommendationView({ recommendation }: RecommendationViewProps) {
    const { user } = useAuth();

    const hasAccess = () => {
        if (!recommendation) return false;

        // Check Tiers (Primary Check)
        const allowedTiers = recommendation.allowedTiers;
        if (allowedTiers && allowedTiers.length > 0) {
            return checkTierAccess(user, allowedTiers);
        }

        // Fallback to Roles check (Original Logic)
        return checkRoleAccess(user, recommendation.allowedRoles);
    };

    const accessible = hasAccess();

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

