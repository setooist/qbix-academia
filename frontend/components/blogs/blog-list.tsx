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
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/api/blogs';
import { useAuth } from '@/lib/contexts/auth-context';
import { checkAccess } from '@/components/auth/access-gate';

interface BlogListProps {
    blogs: BlogPost[];
}

export function BlogList({ blogs }: Readonly<BlogListProps>) {
    const { user } = useAuth();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const handleCardClick = (e: React.MouseEvent, blog: BlogPost) => {
        if (!checkAccess(user, blog.allowedTiers, blog.allowedRoles)) {
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
                {blogs.filter(Boolean).map((blog) => {
                    const accessible = checkAccess(user, blog.allowedTiers, blog.allowedRoles);
                    const imageUrl = (blog.coverImage && blog.coverImage.length > 0)
                        ? getStrapiMedia(blog.coverImage[0].url)
                        : 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                    const safeImageUrl = imageUrl || '';
                    const isLocal = safeImageUrl.includes('localhost') || safeImageUrl.includes('127.0.0.1');

                    const badges = [];
                    if (blog.category) {
                        badges.push(<Badge key="category" variant="secondary">{blog.category.name}</Badge>);
                    }
                    if (blog.tag) {
                        badges.push(<Badge key="tag" variant="outline">{blog.tag.name}</Badge>);
                    }
                    if (!accessible) {
                        badges.push(<Badge key="access" variant="destructive" className="ml-auto">Member Only</Badge>);
                    }

                    const meta = (
                        <>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(blog.published || blog.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </div>
                            {blog.readTime && (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {blog.readTime} min read
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
                            key={blog.documentId}
                            title={blog.title}
                            description={blog.excerpt}
                            imageSrc={safeImageUrl}
                            imageAlt={blog.coverImage?.[0]?.alternativeText || blog.title}
                            imageUnoptimized={isLocal}
                            badges={badges}
                            meta={meta}
                            action={action}
                            isLocked={!accessible}
                            href={`/blogs/${blog.slug}`}
                            onClick={(e) => handleCardClick(e, blog)}
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
                        <Button onClick={() => router.push('/auth/login')}>
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
                            This content is exclusive to premium members. Upgrade your plan to unlock full access.
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
