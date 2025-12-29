'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Bookmark, Share2, Lock, ExternalLink, BookOpen, Clock, FileText, Star } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Recommendation } from '@/lib/api/recommendations';
import { getStrapiMedia } from '@/lib/strapi/client';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendationViewProps {
    recommendation: Recommendation;
}

export function RecommendationView({ recommendation }: RecommendationViewProps) {
    const { user } = useAuth();

    const hasAccess = () => {
        if (!recommendation.allowedRoles) return false;
        if (recommendation.allowedRoles.length === 0) return true;
        const isPubliclyAllowed = recommendation.allowedRoles.some(
            r => r.type === 'public' || r.name.toLowerCase() === 'public'
        );
        if (isPubliclyAllowed) return true;
        if (!user) return false;
        const userRoleType = user.role?.type?.toLowerCase();
        const userRoleName = user.role?.name?.toLowerCase();

        return recommendation.allowedRoles.some(r =>
            (r.type && r.type.toLowerCase() === userRoleType) ||
            (r.name && r.name.toLowerCase() === userRoleName)
        );
    };

    const accessible = hasAccess();

    return (
        <article className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 flex flex-col md:flex-row gap-8">
                    {/* Cover Image */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 shadow-inner">
                            {recommendation.coverImage ? (
                                (() => {
                                    const imageUrl = getStrapiMedia(recommendation.coverImage.url) || '';
                                    return (
                                        <Image
                                            src={imageUrl}
                                            alt={recommendation.coverImage.alternativeText || recommendation.title}
                                            fill
                                            className={`object-cover ${!accessible ? 'grayscale blur-sm' : ''}`}
                                        />
                                    );
                                })()
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <BookOpen className="w-20 h-20 text-slate-300" />
                                </div>
                            )}
                            {!accessible && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                    <Lock className="w-12 h-12 text-slate-600" />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons for Mobile */}
                        {accessible && recommendation.sourceUrl && (
                            <Button asChild className="w-full mt-4 md:hidden" size="lg">
                                <a href={recommendation.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    Access Resource <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">
                                {recommendation.type}
                            </Badge>
                            {recommendation.category && (
                                <Badge variant="outline">
                                    {recommendation.category.name}
                                </Badge>
                            )}
                            {!accessible && <Badge variant="destructive">Member Only</Badge>}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            {recommendation.title}
                        </h1>
                        {recommendation.subtitle && (
                            <p className="text-xl text-slate-500 mb-6 font-medium">
                                {recommendation.subtitle}
                            </p>
                        )}

                        <div className="space-y-4 mb-8">
                            {recommendation.authors && recommendation.authors.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-slate-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Author(s)</p>
                                        <p className="text-slate-600">{recommendation.authors.map(a => a.name).join(', ')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {recommendation.publisher && (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Publisher</p>
                                        <p className="text-slate-600">{recommendation.publisher}</p>
                                    </div>
                                )}
                                {recommendation.publicationDate && (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Published</p>
                                        <p className="text-slate-600">{new Date(recommendation.publicationDate).getFullYear()}</p>
                                    </div>
                                )}
                                {recommendation.editionIsbn && (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">ISBN / Edition</p>
                                        <p className="text-slate-600">{recommendation.editionIsbn}</p>
                                    </div>
                                )}
                                {recommendation.pages && (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Pages</p>
                                        <p className="text-slate-600">{recommendation.pages}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons for Desktop */}
                        <div className="hidden md:flex gap-3">
                            {accessible && recommendation.sourceUrl ? (
                                <Button asChild size="lg" className="px-8">
                                    <a href={recommendation.sourceUrl} target="_blank" rel="noopener noreferrer">
                                        Access Resource <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                            ) : !accessible ? (
                                <Button asChild size="lg">
                                    <Link href="/auth/login">Unlock Access</Link>
                                </Button>
                            ) : (
                                <Button disabled variant="secondary">No Link Available</Button>
                            )}
                            <Button variant="outline" size="lg">
                                <Bookmark className="w-4 h-4 mr-2" /> Save
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {accessible ? (
                                    <div className="prose prose-slate max-w-none">
                                        {typeof recommendation.summary === 'string' ? (
                                            <ReactMarkdown>{recommendation.summary}</ReactMarkdown>
                                        ) : (
                                            <div className="text-gray-800">
                                                {/* Fallback for block rendering if needed, similar to blog posts */}
                                                {(recommendation.summary || []).map((block: any, i: number) => (
                                                    <p key={i} className="mb-4">{block.children?.[0]?.text}</p>
                                                ))}
                                                {(!recommendation.summary || recommendation.summary.length === 0) && "No summary provided."}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="h-24 overflow-hidden blur-[2px] select-none text-slate-400">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-slate-300" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Why We Recommend (Notes) */}
                        {accessible && recommendation.recommendationNotes && (
                            <Card className="bg-amber-50 border-amber-100">
                                <CardHeader>
                                    <CardTitle className="text-amber-900 flex items-center gap-2">
                                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                                        Why We Recommend This
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-amber-900/80">
                                    <div className="prose prose-amber max-w-none">
                                        {typeof recommendation.recommendationNotes === 'string' ? (
                                            <ReactMarkdown>{recommendation.recommendationNotes}</ReactMarkdown>
                                        ) : (
                                            (recommendation.recommendationNotes || []).map((block: any, i: number) => (
                                                <p key={i} className="mb-4">{block.children?.[0]?.text}</p>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar: Key Takeaways */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Key Takeaways</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {accessible ? (
                                    <ul className="space-y-3">
                                        {recommendation.keyTakeaways && recommendation.keyTakeaways.length > 0 ? (
                                            recommendation.keyTakeaways.map((item, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm text-slate-700">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    {item.text}
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No key takeaways listed.</p>
                                        )}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Members Only</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </article>
    );
}
