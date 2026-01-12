'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Clock, Calendar, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BlogPost } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';

interface BlogListProps {
    blogs: BlogPost[];
}

export function BlogList({ blogs }: BlogListProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const hasAccess = (blog: BlogPost) => {
        if (!blog) return false;
        if (!blog.allowedRoles) return false;
        if (blog.allowedRoles.length === 0) return true;
        const isPubliclyAllowed = blog.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;
        if (!user) return false;
        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();
        return blog.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };

    const handleCardClick = (e: React.MouseEvent, blog: BlogPost) => {
        if (!hasAccess(blog)) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.filter(blog => blog).map((blog) => {
                    const accessible = hasAccess(blog);
                    const LinkWrapper = accessible ? Link : 'div';
                    const linkProps = accessible ? { href: `/blogs/${blog.slug}` } : {};

                    return (
                        // @ts-ignore
                        <LinkWrapper
                            key={blog.documentId}
                            {...linkProps}
                            className="block h-full cursor-pointer"
                            onClick={(e: React.MouseEvent) => handleCardClick(e, blog)}
                        >
                            <Card className={accessible
                                ? "h-full border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                                : "h-full border-2 border-gray-200 bg-gray-50 opacity-80"
                            }>

                                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                    {blog.coverImage && blog.coverImage.length > 0 && (() => {
                                        const imageUrl = getStrapiMedia(blog.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                                        const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                                        return (
                                            <Image
                                                src={imageUrl}
                                                unoptimized={isLocal}
                                                alt={blog.coverImage[0].alternativeText || blog.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className={`object-cover ${accessible ? '' : 'grayscale blur-sm'}`}
                                            />
                                        );
                                    })()}

                                    {!accessible && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-10">
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                                <Lock className="w-6 h-6 text-gray-700" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-3">
                                        {blog.category && <Badge variant="secondary">{blog.category.name}</Badge>}
                                        {blog.tag && <Badge variant="outline">{blog.tag.name}</Badge>}
                                        {!accessible && <Badge variant="destructive" className="ml-auto">Member Only</Badge>}
                                    </div>
                                    <CardTitle className={`line-clamp-2 ${accessible ? 'group-hover:text-primary transition-colors duration-300' : 'text-gray-600'}`}>
                                        {blog.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3">
                                        {blog.excerpt}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="mt-auto">
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                                    </div>

                                    {accessible ? (
                                        <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            Read More
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-400 font-medium">
                                            <Lock className="w-4 h-4" />
                                            <span>Locked Content</span>
                                        </div>
                                    )}
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
                        <Button onClick={() => router.push('/auth/login')}>
                            Login
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
