'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen, Lock, ExternalLink, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Recommendation } from '@/lib/api/recommendations';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import { checkAccess } from '@/components/auth/access-gate';

interface RecommendationListProps {
    readonly recommendations: readonly Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No recommendations found.</p>
            </div>
        );
    }

    const handleCardClick = (e: React.MouseEvent, accessible: boolean) => {
        if (!accessible) {
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
                {recommendations.filter(Boolean).map((item) => {
                    const accessible = checkAccess(user, item.allowedTiers, item.allowedRoles);
                    const LinkWrapper = accessible ? Link : 'div';
                    const linkProps = accessible ? { href: `/recommendations/${item.slug}` } : {};

                    return (
                        // @ts-ignore
                        <LinkWrapper
                            key={item.documentId}
                            {...linkProps}
                            className="block h-full group cursor-pointer"
                            onClick={(e: React.MouseEvent) => handleCardClick(e, accessible)}
                        >
                            <Card className="h-full flex flex-col border-2 border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                                <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {item.coverImage ? (
                                        (() => {
                                            const imageUrl = getStrapiMedia(item.coverImage.url) || '';
                                            const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                                            return (
                                                <Image
                                                    src={imageUrl}
                                                    unoptimized={isLocal}
                                                    alt={item.coverImage.alternativeText || item.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className={`object-cover ${accessible ? 'group-hover:scale-105 transition-transform duration-500' : 'grayscale blur-sm'}`}
                                                />
                                            )
                                        })()
                                    ) : (
                                        <BookOpen className="w-16 h-16 text-slate-300" />
                                    )}

                                    <div className="absolute top-2 right-2">
                                        <Badge variant={accessible ? "secondary" : "destructive"} className="shadow-sm">
                                            {accessible ? item.type : <Lock className="w-3 h-3 mr-1" />}
                                            {!accessible && "Member Only"}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {item.category && (
                                            <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-200">
                                                {item.category.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </CardTitle>
                                    {item.subtitle && (
                                        <div className="text-sm text-slate-500 font-medium line-clamp-1">
                                            {item.subtitle}
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="flex-grow flex flex-col">
                                    {item.authors && item.authors.length > 0 && (
                                        <p className="text-sm text-slate-600 mb-4">
                                            by <span className="font-semibold text-slate-800">{item.authors.map(a => a.name).join(', ')}</span>
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                        {accessible ? (
                                            <span className="text-sm font-semibold text-primary flex items-center group/btn">
                                                View Details
                                                <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 font-medium">
                                                <Lock className="w-4 h-4" />
                                                <span>Locked Content</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </LinkWrapper>
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
                            This recommendation is exclusive to premium members. Upgrade your plan to unlock full access.
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
