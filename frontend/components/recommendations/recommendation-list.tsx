'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Link as LinkIcon, Lock, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Recommendation } from '@/lib/api/recommendations';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';

interface RecommendationListProps {
    recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
    const { user } = useAuth();

    const hasAccess = (item: Recommendation) => {
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
            {recommendations.filter(item => item).map((item) => {
                const accessible = hasAccess(item);
                const LinkWrapper = accessible ? Link : 'div';
                const linkProps = accessible ? { href: `/recommendations/${item.slug}` } : {};

                return (
                    // @ts-ignore
                    <LinkWrapper key={item.documentId} {...linkProps} className="block h-full group">
                        <Card className="h-full flex flex-col border-2 border-transparent hover:border-primary/10 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                            <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                {item.coverImage ? (
                                    (() => {
                                        const imageUrl = getStrapiMedia(item.coverImage.url) || '';
                                        const isLocal = imageUrl?.includes('localhost');
                                        return (
                                            <Image
                                                src={imageUrl}
                                                unoptimized={isLocal}
                                                alt={item.coverImage.alternativeText || item.title}
                                                fill
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
    );
}
