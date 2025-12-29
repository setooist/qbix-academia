'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CaseStudy } from '@/lib/api/case-studies';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';

interface CaseStudyListProps {
    caseStudies: CaseStudy[];
}

export function CaseStudyList({ caseStudies }: CaseStudyListProps) {
    const { user } = useAuth();

    const hasAccess = (caseStudy: CaseStudy) => {
        if (!caseStudy) return false;
        if (!caseStudy.allowedRoles) return false;
        if (caseStudy.allowedRoles.length === 0) return true;
        const isPubliclyAllowed = caseStudy.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;
        if (!user) return false;
        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();
        return caseStudy.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };
    if (!caseStudies || caseStudies.length === 0) {
        return (
            <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-500">No case studies found.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.filter(cs => cs).map((caseStudy) => {
                const accessible = hasAccess(caseStudy);
                const LinkWrapper = accessible ? Link : 'div';
                const linkProps = accessible ? { href: `/case-studies/${caseStudy.slug}` } : {};

                return (
                    // @ts-ignore
                    <LinkWrapper key={caseStudy.documentId} {...linkProps} className="block h-full">
                        <Card className={accessible
                            ? "h-full border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                            : "h-full border-2 border-gray-200 bg-gray-50 opacity-80"
                        }>

                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                {/* Image */}
                                {caseStudy.coverImage && caseStudy.coverImage.length > 0 && (() => {
                                    const imageUrl = getStrapiMedia(caseStudy.coverImage[0].url) || 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
                                    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                                    return (
                                        <Image
                                            src={imageUrl}
                                            unoptimized={isLocal}
                                            alt={caseStudy.coverImage[0].alternativeText || caseStudy.title}
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
                                    {caseStudy.category && <Badge variant="secondary">{caseStudy.category.name}</Badge>}
                                    {caseStudy.tag && <Badge variant="outline">{caseStudy.tag.name}</Badge>}
                                    {!accessible && <Badge variant="destructive" className="ml-auto">Member Only</Badge>}
                                </div>
                                <CardTitle className={`line-clamp-2 ${accessible ? 'group-hover:text-primary transition-colors duration-300' : 'text-gray-600'}`}>
                                    {caseStudy.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {caseStudy.excerpt}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-auto">
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
    );
}
