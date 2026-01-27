'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, Lock } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '@/lib/api/blogs';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';
import { checkAccess } from '@/components/auth/access-gate';
import { SaveButton } from '@/components/shared/save-button';
import { ShareButton } from '@/components/shared/share-button';

interface BlogPostViewProps {
    readonly blog: BlogPost;
}



function BlogCoverImage({ blog, accessible }: { readonly blog: BlogPost; readonly accessible: boolean }) {
    if (!blog.coverImage || blog.coverImage.length === 0) return null;

    const imageUrl = getStrapiMedia(blog.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

    return (
        <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
            <Image
                src={imageUrl}
                // Disable optimization for local images to prevent SSG build issues
                unoptimized={isLocal}
                alt={blog.coverImage[0].alternativeText || blog.title}
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

function BlogContent({ content }: { readonly content: BlogPost['content'] }) {
    if (typeof content === 'string') {
        return <ReactMarkdown>{content}</ReactMarkdown>;
    }
    return (
        <div className="text-gray-800">
            <StrapiBlocksRenderer content={content} />
        </div>
    );
}

export function BlogPostView({ blog }: BlogPostViewProps) {
    const { user } = useAuth();

    const hasAccess = () => {
        if (!blog) return false;
        return checkAccess(user, blog.allowedTiers, blog.allowedRoles);
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
                        <SaveButton
                            contentType="blog"
                            contentId={blog.documentId}
                            title={blog.title}
                            slug={blog.slug}
                            excerpt={blog.excerpt}
                            coverImageUrl={blog.coverImage?.[0]?.url ? getStrapiMedia(blog.coverImage[0].url) || undefined : undefined}
                        />
                        <ShareButton title={blog.title} />
                    </div>
                </div>

                <BlogCoverImage blog={blog} accessible={accessible} />

                <div className="prose prose-lg max-w-none relative">
                    {accessible ? (
                        <BlogContent content={blog.content} />
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
