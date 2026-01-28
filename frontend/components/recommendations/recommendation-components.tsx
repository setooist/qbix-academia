import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendation } from '@/lib/api/recommendations';
import { getStrapiMedia } from '@/lib/strapi/client';
import { StrapiBlocksRenderer } from '@/lib/utils/strapi-blocks-renderer';
import { BookOpen, Crown, ExternalLink, Lock, Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { SaveButton } from '@/components/shared/save-button';
import { ShareButton } from '@/components/shared/share-button';

interface BaseRecommendationProps {
    readonly recommendation: Recommendation;
    readonly accessible: boolean;
}

export function RecommendationImage({ recommendation, accessible }: BaseRecommendationProps) {
    return (
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 shadow-inner">
            {recommendation.coverImage ? (
                (() => {
                    const imageUrl = getStrapiMedia(recommendation.coverImage.url) || '';
                    const isLocal = imageUrl?.includes('localhost') || imageUrl?.includes('127.0.0.1');
                    return (
                        <Image
                            src={imageUrl}
                            unoptimized={isLocal}
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
    );
}

interface RecommendationMetadataProps extends BaseRecommendationProps {
    readonly isSubscriptionRestricted: boolean;
}

export function RecommendationMetadata({ recommendation, accessible, isSubscriptionRestricted }: RecommendationMetadataProps) {
    return (
        <>
            <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20">
                    {recommendation.type}
                </Badge>
                {recommendation.category && (
                    <Badge variant="outline">
                        {recommendation.category.name}
                    </Badge>
                )}
                {!accessible && (
                    <Badge variant="destructive">
                        {isSubscriptionRestricted ? 'Subscription Required' : 'Member Only'}
                    </Badge>
                )}
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
        </>
    );
}

interface RecommendationActionsProps extends BaseRecommendationProps {
    readonly user: any;
}

export function RecommendationActions({ recommendation, accessible, user }: RecommendationActionsProps) {
    return (
        <div className="hidden md:flex gap-3">
            {accessible && recommendation.sourceUrl ? (
                <Button asChild size="lg" className="px-8">
                    <a href={recommendation.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Access Resource <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </Button>
            ) : !accessible ? (
                !user ? (
                    <Button asChild size="lg">
                        <Link href="/auth/login">Log In to Access</Link>
                    </Button>
                ) : (
                    <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 border-0">
                        <Link href="/account/subscription">Upgrade Now</Link>
                    </Button>
                )
            ) : (
                <Button disabled variant="secondary">No Link Available</Button>
            )}
            <SaveButton
                contentType="recommendation"
                contentId={recommendation.documentId}
                title={recommendation.title}
                slug={recommendation.slug}
                excerpt={recommendation.subtitle || undefined}
                coverImageUrl={recommendation.coverImage?.url ? getStrapiMedia(recommendation.coverImage.url) || undefined : undefined}
                size="lg"
            />
            <ShareButton title={recommendation.title} size="icon" showText={false} />
        </div>
    );
}

export function MobileActionButtons({ recommendation, accessible }: BaseRecommendationProps) {
    if (accessible && recommendation.sourceUrl) {
        return (
            <Button asChild className="w-full mt-4 md:hidden" size="lg">
                <a href={recommendation.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Access Resource <ExternalLink className="w-4 h-4 ml-2" />
                </a>
            </Button>
        );
    }
    return null;
}

interface ContentSectionProps extends BaseRecommendationProps {
    readonly isSubscriptionRestricted: boolean;
}

export function ContentSection({ recommendation, accessible, isSubscriptionRestricted }: ContentSectionProps) {
    return (
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
                                <StrapiBlocksRenderer content={recommendation.summary} />
                            )}
                            {(!recommendation.summary || (Array.isArray(recommendation.summary) && recommendation.summary.length === 0)) && "No summary provided."}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="h-24 overflow-hidden blur-[2px] select-none text-slate-400">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                {isSubscriptionRestricted ? (
                                    <Crown className="w-8 h-8 text-yellow-500" />
                                ) : (
                                    <Lock className="w-8 h-8 text-slate-300" />
                                )}
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
                                <StrapiBlocksRenderer content={recommendation.recommendationNotes} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

interface SidebarProps extends BaseRecommendationProps {
    readonly isSubscriptionRestricted: boolean;
}

export function Sidebar({ recommendation, accessible, isSubscriptionRestricted }: SidebarProps) {
    return (
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
                            {isSubscriptionRestricted ? (
                                <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500 opacity-50" />
                            ) : (
                                <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            )}
                            <p className="text-sm">
                                {isSubscriptionRestricted ? 'Subscription Required' : 'Members Only'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
