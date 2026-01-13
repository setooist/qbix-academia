'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, Bookmark, Share2, Lock, Crown } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { CaseStudy } from '@/lib/api/case-studies';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';

interface CaseStudyViewProps {
    readonly caseStudy: CaseStudy;
}

const checkTierAccess = (caseStudy: CaseStudy, user: any) => {
    const allowedTiers = caseStudy.allowedTiers;
    // Should depend on caller to check existence of allowedTiers, but safe to check here
    if (!allowedTiers) return false;

    // If 'FREE' is allowed, everyone has access
    if (allowedTiers.includes('FREE')) return true;

    if (!user) return false;

    // Check if user is Mentor (Always has access)
    const userRoleName = user.role?.name?.toLowerCase();
    const userRoleType = user.role?.type?.toLowerCase();
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    // Check user tier
    const userTier = user.tier || 'FREE';
    if (allowedTiers.includes(userTier)) return true;

    // Also check if user has an active subscription (in case tier wasn't updated)
    if (allowedTiers.includes('SUBSCRIPTION')) {
        // Check subscriptionActive flag
        if (user.subscriptionActive === true) return true;

        // Check subscriptions relation for any active subscription
        const activeSubscription = user.subscriptions?.some(
            (sub: any) => sub.subscription_status === 'active'
        );
        if (activeSubscription) return true;
    }

    return false;
};

const checkRoleAccess = (caseStudy: CaseStudy, user: any) => {
    if (!caseStudy.allowedRoles) return false;
    if (caseStudy.allowedRoles.length === 0) return true;

    const isPubliclyAllowed = caseStudy.allowedRoles.some(
        r => r.type === 'public' || r.name.toLowerCase() === 'public'
    );
    if (isPubliclyAllowed) return true;

    if (!user) return false;

    const userRoleType = user.role?.type?.toLowerCase();
    const userRoleName = user.role?.name?.toLowerCase();

    // Also allow Mentors via role check fallback
    if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

    return caseStudy.allowedRoles.some(r =>
        (r.type && r.type.toLowerCase() === userRoleType) ||
        (r.name && r.name.toLowerCase() === userRoleName)
    );
};

const getCaseStudyAccess = (caseStudy: CaseStudy, user: any) => {
    if (!caseStudy) return false;

    // Check Tiers (Primary Check)
    const allowedTiers = caseStudy.allowedTiers;
    if (allowedTiers && allowedTiers.length > 0) {
        return checkTierAccess(caseStudy, user);
    }

    // Fallback to Roles check (Original Logic)
    return checkRoleAccess(caseStudy, user);
};

function CaseStudyCoverImage({ caseStudy, accessible }: { readonly caseStudy: CaseStudy; readonly accessible: boolean }) {
    if (!caseStudy.coverImage || caseStudy.coverImage.length === 0) return null;

    const imageUrl = getStrapiMedia(caseStudy.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

    return (
        <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
            <Image
                src={imageUrl}
                unoptimized={isLocal}
                alt={caseStudy.coverImage[0].alternativeText || caseStudy.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                className={`object-cover ${accessible ? '' : 'grayscale blur-sm'}`}
            />
            {!accessible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <Lock className="w-16 h-16 text-white opacity-80" />
                </div>
            )}
        </div>
    );
}

export function CaseStudyView({ caseStudy }: CaseStudyViewProps) {
    const { user } = useAuth();
    const accessible = getCaseStudyAccess(caseStudy, user);

    // Determine if it's a subscription-based restriction (for CTA text)
    const isSubscriptionRestricted = caseStudy.allowedTiers && caseStudy.allowedTiers.length > 0 && !caseStudy.allowedTiers.includes('FREE');

    const contentElement = typeof caseStudy.content === 'string' ? (
        <ReactMarkdown>{caseStudy.content}</ReactMarkdown>
    ) : (
        <div className="text-gray-800">
            <StrapiBlocksRenderer content={caseStudy.content} />
        </div>
    );

    return (
        <article className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        {caseStudy.category && (
                            <Badge variant="secondary" className="text-sm">
                                {caseStudy.category.name}
                            </Badge>
                        )}
                        {!accessible && (
                            <Badge variant="destructive">
                                {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only'}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {caseStudy.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                        {caseStudy.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span>{caseStudy.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                        {caseStudy.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {caseStudy.readTime} min read
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                <CaseStudyCoverImage caseStudy={caseStudy} accessible={accessible} />

                <div className="prose prose-lg max-w-none relative">
                    {accessible ? (
                        // Full Content
                        contentElement
                    ) : (
                        // Teaser Content + CTA
                        <div className="space-y-8">
                            <div className="blur-[2px] opacity-70 select-none">
                                {/* Render partial content/excerpt as teaser */}
                                <p className="text-xl leading-relaxed">{caseStudy.excerpt || "This content is reserved for members."}</p>
                                <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                                <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-center">
                                {isSubscriptionRestricted ? (
                                    <Crown className="w-12 h-12 text-yellow-500 mb-4" />
                                ) : (
                                    <Lock className="w-12 h-12 text-primary mb-4" />
                                )}
                                <h3 className="text-2xl font-bold mb-2">
                                    {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only Content'}
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    {isSubscriptionRestricted
                                        ? 'Upgrade your subscription to access this case study and exclusive resources.'
                                        : 'Log in to access this full case study.'}
                                </p>
                                <div className="flex gap-4">
                                    {user ? (
                                        <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0">
                                            <Link href="/account/subscription">Upgrade Now</Link>
                                        </Button>
                                    ) : (
                                        <Button asChild variant="outline" size="lg">
                                            <Link href="/auth/login">Log In</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {caseStudy.author && accessible && (
                    <div className="mt-12 p-6 bg-muted rounded-xl">
                        <h3 className="text-xl font-bold mb-2">About the Author</h3>
                        <p className="text-gray-700">{caseStudy.author}</p>
                    </div>
                )}
            </div>
        </article>
    );
}

