'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight, Lock, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Downloadable } from '@/lib/api/downloadables';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';

interface DownloadableListProps {
    downloadables: Downloadable[];
}

export function DownloadableList({ downloadables }: DownloadableListProps) {
    const { user } = useAuth();

    const hasAccess = (item: Downloadable) => {
        if (!item) return false;
        if (!item.allowedRoles) return false;
        if (item.allowedRoles.length === 0) return true;
        const isPubliclyAllowed = item.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;
        if (!user) return false;
        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();
        return item.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {downloadables.filter(item => item).map((item) => {
                const accessible = hasAccess(item);
                const LinkWrapper = accessible ? Link : 'div';
                const linkProps = accessible ? { href: `/downloadables/${item.slug}` } : {};

                return (
                    // @ts-ignore
                    <LinkWrapper key={item.documentId} {...linkProps} className="block h-full">
                        <Card className={accessible
                            ? "h-full border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                            : "h-full border-2 border-gray-200 bg-gray-50 opacity-80"
                        }>

                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                {/* Image */}
                                {item.coverImage && item.coverImage.length > 0 && (() => {
                                    const imageUrl = getStrapiMedia(item.coverImage[0].url) || 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg';
                                    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                                    return (
                                        <Image
                                            src={imageUrl}
                                            unoptimized={isLocal}
                                            alt={item.coverImage[0].alternativeText || item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className={`object-cover ${accessible ? '' : 'grayscale blur-sm'}`}
                                        />
                                    );
                                })()}

                                {/* Lock Overlay */}
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
                                    {item.category && <Badge variant="secondary">{item.category.name}</Badge>}
                                    {item.version && <Badge variant="outline">v{item.version}</Badge>}
                                    {!accessible && <Badge variant="destructive" className="ml-auto">Member Only</Badge>}
                                </div>
                                <CardTitle className={`line-clamp-2 ${accessible ? 'group-hover:text-primary transition-colors duration-300' : 'text-gray-600'}`}>
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {item.excerpt}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-auto">
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                                </div>

                                {accessible ? (
                                    <div className="flex items-center gap-2 text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                                        View Details
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
    );
}
