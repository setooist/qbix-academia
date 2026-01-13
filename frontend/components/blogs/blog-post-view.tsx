'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, Bookmark, Share2, Lock } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';

interface BlogPostViewProps {
    blog: BlogPost;
}

export function BlogPostView({ blog }: BlogPostViewProps) {
    const { user } = useAuth();

    const hasAccess = () => {
        if (!blog) return false;

        // Check Tiers (Primary Check)
        const allowedTiers = blog.allowedTiers;
        if (allowedTiers && allowedTiers.length > 0) {
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
        }

        // Fallback to Roles check (Original Logic)
        if (!blog.allowedRoles) return false;
        if (blog.allowedRoles.length === 0) return true;
        const isPubliclyAllowed = blog.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;

        if (!user) return false;

        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();

        // Also allow Mentors via role check fallback
        if (userRoleName === 'mentor' || userRoleType === 'mentor') return true;

        return blog.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };

    const accessible = hasAccess();

    return (
        <article className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        {blog.category && (
                            <Badge variant="secondary" className="text-sm">
                                {blog.category.name}
                            </Badge>
                        )}
                        {!accessible && <Badge variant="destructive">Member Only</Badge>}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                        {blog.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span>{blog.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {new Date(blog.published || blog.publishedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </div>
                        {blog.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {blog.readTime} min read
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

                {blog.coverImage && blog.coverImage.length > 0 && (() => {
                    const imageUrl = getStrapiMedia(blog.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

                    return (
                        <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                unoptimized={isLocal}
                                alt={blog.coverImage[0].alternativeText || blog.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                                className={`object-cover ${!accessible ? 'grayscale blur-sm' : ''}`}
                            />
                            {!accessible && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                    <Lock className="w-16 h-16 text-white opacity-80" />
                                </div>
                            )}
                        </div>
                    );
                })()}

                <div className="prose prose-lg max-w-none relative">
                    {accessible ? (
                        // Full Content
                        typeof blog.content === 'string' ? (
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        ) : (
                            <div className="text-gray-800">
                                {Array.isArray(blog.content) && blog.content.map((block: any, i: number) => {
                                    if (block.type === 'paragraph') {
                                        return <p key={i} className="mb-4">{block.children?.map((c: any) => c.text).join('')}</p>
                                    }
                                    if (block.type === 'heading') {
                                        const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
                                        return <Tag key={i} className="font-bold my-4">{block.children?.map((c: any) => c.text).join('')}</Tag>
                                    }
                                    if (block.type === 'list') {
                                        const Tag = block.format === 'ordered' ? 'ol' : 'ul';
                                        return <Tag key={i} className="list-disc pl-5 mb-4">{block.children?.map((li: any, j: number) => <li key={j}>{li.children?.map((c: any) => c.text).join('')}</li>)}</Tag>
                                    }
                                    return null;
                                })}
                            </div>
                        )
                    ) : (
                        // Teaser Content + CTA
                        <div className="space-y-8">
                            <div className="blur-[2px] opacity-70 select-none">
                                {/* Render partial content/excerpt as teaser */}
                                <p className="text-xl leading-relaxed">{blog.excerpt || "This content is reserved for members."}</p>
                                <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...</p>
                                <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-center">
                                <Lock className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Subscription Required</h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    Join our community to access this full article and other exclusive resources.
                                </p>
                                <div className="flex gap-4">
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="/auth/login">Log In</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {blog.author && accessible && (
                    <div className="mt-12 p-6 bg-muted rounded-xl">
                        <h3 className="text-xl font-bold mb-2">About the Author</h3>
                        <p className="text-gray-700">{blog.author}</p>
                    </div>
                )}
            </div>
        </article>
    );
}
