'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ContentCard } from '@/components/ui/content-card';
import { getStrapiMedia } from '@/lib/strapi/client';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Lock, ArrowRight, Crown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CaseStudy } from '@/lib/api/case-studies';
import { useAuth } from '@/lib/contexts/auth-context';
import { checkAccess } from '@/components/auth/access-gate';

interface CaseStudyListProps {
    readonly caseStudies: readonly CaseStudy[];
}

export function CaseStudyList({ caseStudies }: CaseStudyListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    if (!caseStudies || caseStudies.length === 0) {
        return (
            <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-500">No case studies found.</p>
            </div>
        );
    }

    const handleCardClick = (e: React.MouseEvent, caseStudy: CaseStudy) => {
        if (!checkAccess(user, caseStudy.allowedTiers, caseStudy.allowedRoles)) {
            e.preventDefault();
            if (user) {
                setShowSubscriptionModal(true);
            } else {
                setShowLoginModal(true);
            }
        }
    };

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.filter(Boolean).map((caseStudy) => {
                    const accessible = checkAccess(user, caseStudy.allowedTiers, caseStudy.allowedRoles);
                    const imageUrl = (caseStudy.coverImage && caseStudy.coverImage.length > 0)
                        ? getStrapiMedia(caseStudy.coverImage[0].url)
                        : 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                    const safeImageUrl = imageUrl || '';
                    const isLocal = safeImageUrl.includes('localhost') || safeImageUrl.includes('127.0.0.1');

                    const badges = [];
                    if (caseStudy.category) {
                        badges.push(<Badge key="category" variant="secondary">{caseStudy.category.name}</Badge>);
                    }
                    if (caseStudy.tag) {
                        badges.push(<Badge key="tag" variant="outline">{caseStudy.tag.name}</Badge>);
                    }
                    if (!accessible) {
                        badges.push(<Badge key="access" variant="destructive" className="ml-auto">Member Only</Badge>);
                    }

                    const meta = (
                        <>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                            {caseStudy.readTime && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {caseStudy.readTime} min read
                                </div>
                            )}
                        </>
                    );

                    const action = accessible ? (
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400 font-medium">
                            <Lock className="w-4 h-4" />
                            <span>Locked Content</span>
                        </div>
                    );

                    return (
                        <ContentCard
                            key={caseStudy.documentId}
                            title={caseStudy.title}
                            description={caseStudy.excerpt || ''}
                            imageSrc={safeImageUrl}
                            imageAlt={caseStudy.coverImage?.[0]?.alternativeText || caseStudy.title}
                            imageUnoptimized={isLocal}
                            badges={badges}
                            meta={meta}
                            action={action}
                            isLocked={!accessible}
                            href={`/case-studies/${caseStudy.slug}`}
                            onClick={(e) => handleCardClick(e, caseStudy)}
                        />
                    );
                })}
            </div>

            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                        <DialogDescription>
                            Please log in to access this content.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push(`/auth/login?redirect=${pathname}`)}>
                            Login
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subscription Modal */}
            <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <DialogTitle>Premium Content</DialogTitle>
                        </div>
                        <DialogDescription>
                            This case study is exclusive to premium members. Upgrade your plan to unlock full access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowSubscriptionModal(false)}>
                            Maybe Later
                        </Button>
                        <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0" onClick={() => router.push('/account/subscription')}>
                            Upgrade Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
