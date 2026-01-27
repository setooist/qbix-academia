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
import { Calendar, FileText, Lock, ArrowRight, Crown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Downloadable } from '@/lib/api/downloadables';
import { useAuth } from '@/lib/contexts/auth-context';
import { checkAccess } from '@/components/auth/access-gate';

interface DownloadableListProps {
    readonly downloadables: readonly Downloadable[];
}

export function DownloadableList({ downloadables }: DownloadableListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    if (!downloadables || downloadables.length === 0) {
        return (
            <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-500">No downloadables found.</p>
            </div>
        );
    }

    const handleCardClick = (e: React.MouseEvent, item: Downloadable) => {
        if (!checkAccess(user, item.allowedTiers, item.allowedRoles)) {
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
                {downloadables.filter(Boolean).map((item) => {
                    const accessible = checkAccess(user, item.allowedTiers, item.allowedRoles);
                    const imageUrl = (item.coverImage && item.coverImage.length > 0)
                        ? getStrapiMedia(item.coverImage[0].url)
                        : 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg';
                    const safeImageUrl = imageUrl || '';
                    const isLocal = safeImageUrl.includes('localhost') || safeImageUrl.includes('127.0.0.1');

                    const badges = [];
                    if (item.category) {
                        badges.push(<Badge key="category" variant="secondary">{item.category.name}</Badge>);
                    }
                    if (item.version) {
                        badges.push(<Badge key="version" variant="outline">v{item.version}</Badge>);
                    }
                    if (!accessible) {
                        badges.push(<Badge key="access" variant="destructive" className="ml-auto">Member Only</Badge>);
                    }

                    const meta = (
                        <>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {item.published ? new Date(item.published).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) : 'N/A'}
                            </div>
                            {item.file && item.file.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {item.file[0].ext.replace('.', '').toUpperCase()}
                                </div>
                            )}
                        </>
                    );

                    const action = accessible ? (
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                            View Details
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
                            key={item.documentId}
                            title={item.title}
                            description={item.excerpt || ''}
                            imageSrc={safeImageUrl}
                            imageAlt={item.coverImage?.[0]?.alternativeText || item.title}
                            imageUnoptimized={isLocal}
                            badges={badges}
                            meta={meta}
                            action={action}
                            isLocked={!accessible}
                            href={`/downloadables/${item.slug}`}
                            onClick={(e) => handleCardClick(e, item)}
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
                            This downloadable is exclusive to premium members. Upgrade your plan to unlock full access.
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
