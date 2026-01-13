'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Bookmark, Share2, Lock, Download, FileText, Crown } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Downloadable } from '@/lib/api/downloadables';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';

interface DownloadableViewProps {
    readonly downloadable: Downloadable;
}

export function DownloadableView({ downloadable }: DownloadableViewProps) {
    const { user } = useAuth();

    const hasAccess = () => {
        if (!downloadable) return false;

        // Check Tiers (Primary Check)
        if (downloadable.allowedTiers && downloadable.allowedTiers.length > 0) {
            return checkTierAccess(user, downloadable.allowedTiers);
        }

        // Fallback to Roles check
        return checkRoleAccess(user, downloadable.allowedRoles);
    };

    const accessible = hasAccess();

    // Determine if it's a subscription-based restriction (for CTA text)
    const isSubscriptionRestricted = downloadable.allowedTiers && downloadable.allowedTiers.length > 0 && !downloadable.allowedTiers.includes('FREE');

    return (
        <article className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        {downloadable.category && (
                            <Badge variant="secondary" className="text-sm">
                                {downloadable.category.name}
                            </Badge>
                        )}
                        {downloadable.version && (
                            <Badge variant="outline" className="text-sm">
                                v{downloadable.version}
                            </Badge>
                        )}
                        {!accessible && (
                            <Badge variant="destructive">
                                {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only'}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {downloadable.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                        {downloadable.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span>{downloadable.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {downloadable.published ? new Date(downloadable.published).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            }) : 'N/A'}
                        </div>
                        {downloadable.file && downloadable.file.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                <span>{downloadable.file[0].ext.replace('.', '').toUpperCase()}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {accessible && downloadable.file && downloadable.file.length > 0 && (
                            (() => {
                                const fileUrl = getStrapiMedia(downloadable.file[0].url);
                                if (!fileUrl) return null;
                                return (
                                    <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                                        <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </a>
                                    </Button>
                                );
                            })()
                        )}
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

                {downloadable.coverImage && downloadable.coverImage.length > 0 && (() => {
                    const imageUrl = getStrapiMedia(downloadable.coverImage[0].url) || 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg';
                    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');

                    return (
                        <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                unoptimized={isLocal}
                                alt={downloadable.coverImage[0].alternativeText || downloadable.title}
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
                })()}

                <div className="prose prose-lg max-w-none relative">
                    {accessible ? (
                        // Full Description
                        <div className="text-gray-800">
                            {typeof downloadable.description === 'string' ? (
                                <ReactMarkdown>{downloadable.description}</ReactMarkdown>
                            ) : (
                                <StrapiBlocksRenderer content={downloadable.description} />
                            )}
                        </div>
                    ) : (
                        // Teaser Content + CTA
                        <div className="space-y-8">
                            <div className="blur-[2px] opacity-70 select-none">
                                {/* Render partial content/excerpt as teaser */}
                                <p className="text-xl leading-relaxed">{downloadable.excerpt || "This content is reserved for members."}</p>
                                <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
                                <p className="mt-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-center">
                                {isSubscriptionRestricted ? (
                                    <Crown className="w-12 h-12 text-yellow-500 mb-4" />
                                ) : (
                                    <Lock className="w-12 h-12 text-primary mb-4" />
                                )}
                                <h3 className="text-2xl font-bold mb-2">
                                    {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only Resource'}
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    {isSubscriptionRestricted
                                        ? 'Upgrade your subscription to download this resource and access exclusive materials.'
                                        : 'Log in to download this resource.'}
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

                {downloadable.author && accessible && (
                    <div className="mt-12 p-6 bg-muted rounded-xl">
                        <h3 className="text-xl font-bold mb-2">About the Creator</h3>
                        <p className="text-gray-700">{downloadable.author}</p>
                    </div>
                )}
            </div>
        </article>
    );
}

function isMentor(user: any): boolean {
    if (!user) return false;
    const userRoleName = user.role?.name?.toLowerCase();
    const userRoleType = user.role?.type?.toLowerCase();
    return userRoleName === 'mentor' || userRoleType === 'mentor';
}

function checkTierAccess(user: any, allowedTiers: string[]): boolean {
    if (allowedTiers.includes('FREE')) return true;

    if (!user) return false;
    if (isMentor(user)) return true;

    const userTier = user.tier || 'FREE';
    if (allowedTiers.includes(userTier)) return true;

    if (allowedTiers.includes('SUBSCRIPTION')) {
        if (user.subscriptionActive === true) return true;
        return user.subscriptions?.some((sub: any) => sub.subscription_status === 'active') ?? false;
    }

    return false;
}

function checkRoleAccess(user: any, allowedRoles: any[] | undefined): boolean {
    if (!allowedRoles) return false;
    if (allowedRoles.length === 0) return true;

    const isPubliclyAllowed = allowedRoles.some(
        (r: any) => r.type === 'public' || r.name.toLowerCase() === 'public'
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
}

