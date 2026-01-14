'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getActivityBySlug, Activity } from '@/lib/api/activities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/lib/contexts/auth-context';
import { Lock } from 'lucide-react';
import Link from 'next/link';
// ... imports

export default function ActivityDetailsPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const router = useRouter();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<string>('en');
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const resolvedParams = await params;
                setLang(resolvedParams.lang || 'en');
                const data = await getActivityBySlug(resolvedParams.slug);
                if (!data) {
                    setError('Activity not found');
                } else {
                    setActivity(data);
                }
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity details');
            } finally {
                setLoading(false);
            }
        }
        if (!authLoading) {
            fetchData();
        }
    }, [params, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const hasAccess = !!user;

    if (!activity) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || (hasAccess ? 'Activity Not Found' : 'Login Required')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                        {error
                            ? 'We could not find the activity you requested.'
                            : !hasAccess
                                ? 'You do not have permission to view this activity details without logging in.'
                                : 'The requested activity does not exist or you do not have permission to view it.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        {!hasAccess && (
                            <Button asChild>
                                <Link href={`/${lang}/auth/login`}>Log In</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <article className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            {activity.category && (
                                <Badge variant="secondary" className="text-sm">
                                    {activity.category.name}
                                </Badge>
                            )}
                            <Badge variant="outline" className={`${getStatusColor(activity.activityStatus)} bg-opacity-10 border-none`}>
                                {formatStatus(activity.activityStatus)}
                            </Badge>
                            {!hasAccess && <Badge variant="destructive">Member Only</Badge>}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {activity.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                            {activity.assignee && (
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span>Assigned to: {activity.assignee.username}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>Due: {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Deadline'}</span>
                            </div>
                            {activity.mentor && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Mentor: {activity.mentor.username}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" onClick={() => router.back()}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Activities
                            </Button>
                        </div>
                    </div>

                    {/* Placeholder Cover Image Area (to match Blog aesthetic) */}
                    <div className="relative w-full h-64 md:h-96 mb-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-300">
                            {/* Placeholder Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        {!hasAccess && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <Lock className="w-16 h-16 text-white opacity-80" />
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="prose prose-lg max-w-none relative mb-12">
                        {hasAccess ? (
                            // Full Access Content
                            activity && activity.description && (
                                <div className="text-gray-800">
                                    {Array.isArray(activity.description) ? (
                                        activity.description.map((block: any, index: number) => {
                                            switch (block.type) {
                                                case 'paragraph':
                                                    return (
                                                        <p key={index} className="mb-4">
                                                            {block.children?.map((child: any, childIndex: number) => {
                                                                if (child.bold) return <strong key={childIndex}>{child.text}</strong>;
                                                                if (child.italic) return <em key={childIndex}>{child.text}</em>;
                                                                if (child.underline) return <u key={childIndex}>{child.text}</u>;
                                                                return <span key={childIndex}>{child.text}</span>;
                                                            })}
                                                        </p>
                                                    );
                                                case 'heading':
                                                    const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                                                    return (
                                                        <Tag key={index} className="font-bold text-gray-900 mt-6 mb-3">
                                                            {block.children?.map((child: any) => child.text).join('')}
                                                        </Tag>
                                                    );
                                                case 'list':
                                                    const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                                                    return (
                                                        <ListTag key={index} className="list-disc pl-5 mb-4">
                                                            {block.children?.map((item: any, itemIndex: number) => (
                                                                <li key={itemIndex}>
                                                                    {item.children?.map((child: any) => child.text).join('')}
                                                                </li>
                                                            ))}
                                                        </ListTag>
                                                    );
                                                default:
                                                    return <p key={index}>{JSON.stringify(block)}</p>;
                                            }
                                        })
                                    ) : (
                                        <p>{typeof activity.description === 'string' ? activity.description : JSON.stringify(activity.description)}</p>
                                    )}
                                </div>
                            )
                        ) : (
                            // Restricted / Teaser Content
                            <div className="space-y-8">
                                <div className="blur-[2px] opacity-70 select-none">
                                    <p className="text-xl leading-relaxed">This activity content is reserved for logged-in members only.</p>
                                    <p className="mt-4">Please log in to view the detailed instructions, download resources, and submit your work.</p>
                                    <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-8 text-center">
                                    <Lock className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Member Only Content</h3>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        Log in to access your assigned activity details.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button asChild size="lg">
                                            <Link href={`/${lang}/auth/login`}>Log In</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resources / Attachments Section */}
                    {hasAccess && (activity.goFromLink || (activity.downloadables && activity.downloadables.length > 0)) && (
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Resources</h3>
                            <div className="space-y-4">
                                {activity.goFromLink && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">External Link</span>
                                        <a href={activity.goFromLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                            {activity.goFromLink}
                                        </a>
                                    </div>
                                )}
                                {activity.downloadables && activity.downloadables.length > 0 && (
                                    <div>
                                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">Downloads</span>
                                        <div className="grid gap-2">
                                            {activity.downloadables.map((file, i) => (
                                                <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white border rounded hover:shadow-sm transition-all group">
                                                    <div className="bg-blue-100 p-2 rounded mr-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                    </div>
                                                    <span className="font-medium text-gray-700">{file.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}

function getStatusColor(status: string) {
    const map: Record<string, string> = {
        assigned: 'bg-blue-500 text-blue-700',
        in_progress: 'bg-indigo-500 text-indigo-700',
        submitted: 'bg-yellow-500 text-yellow-700',
        reviewed: 'bg-purple-500 text-purple-700',
        approved: 'bg-green-500 text-green-700',
        changes_requested: 'bg-red-500 text-red-700',
    };
    return map[status] || 'bg-gray-500 text-gray-700';
}

function formatStatus(status: string) {
    return status ? status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Unknown';
}
