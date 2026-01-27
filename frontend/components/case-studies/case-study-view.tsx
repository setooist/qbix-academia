'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, Lock } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { CaseStudy } from '@/lib/api/case-studies';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';
import { checkAccess } from '@/components/auth/access-gate';
import { SaveButton } from '@/components/shared/save-button';
import { ShareButton } from '@/components/shared/share-button';

interface CaseStudyViewProps {
    readonly caseStudy: CaseStudy;
}

interface CoverImageProps {
    readonly caseStudy: CaseStudy;
    readonly accessible: boolean;
}

function CaseStudyCoverImage({ caseStudy, accessible }: CoverImageProps) {
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

function CaseStudyContent({ content }: { readonly content: CaseStudy['content'] }) {
    if (typeof content === 'string') {
        return <ReactMarkdown>{content}</ReactMarkdown>;
    }
    return (
        <div className="text-gray-800">
            <StrapiBlocksRenderer content={content} />
        </div>
    );
}

export function CaseStudyView({ caseStudy }: CaseStudyViewProps) {
    const { user } = useAuth();
    const pathname = usePathname();

    const hasAccess = () => {
        if (!caseStudy) return false;
        return checkAccess(user, caseStudy.allowedTiers, caseStudy.allowedRoles);
    };

    const accessible = hasAccess();

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
                        {!accessible && <Badge variant="destructive">Member Only</Badge>}
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
                        <SaveButton
                            contentType="case-study"
                            contentId={caseStudy.documentId}
                            title={caseStudy.title}
                            slug={caseStudy.slug}
                            excerpt={caseStudy.excerpt}
                            coverImageUrl={caseStudy.coverImage?.[0]?.url ? getStrapiMedia(caseStudy.coverImage[0].url) || undefined : undefined}
                        />
                        <ShareButton title={caseStudy.title} />
                    </div>
                </div>

                <CaseStudyCoverImage caseStudy={caseStudy} accessible={accessible} />

                <div className="prose prose-lg max-w-none relative">
                    {accessible ? (
                        <CaseStudyContent content={caseStudy.content} />
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
                                <Lock className="w-12 h-12 text-primary mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Subscription Required</h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    Join our community to access this full case study and other exclusive resources.
                                </p>
                                <div className="flex gap-4">
                                    <Button asChild variant="outline" size="lg">
                                        <Link href={`/auth/login?redirect=${pathname}`}>Log In</Link>
                                    </Button>
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
