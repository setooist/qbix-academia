'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, BookOpen, FolderOpen, Trash2, Filter } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getMySavedItems,
  getSavedItemUrl,
  getContentTypeLabel,
  SavedItem,
  SavedContentType,
  toggleSaveItem
} from '@/lib/api/saved-items';
import { useToast } from '@/hooks/use-toast';
import { localeConfig } from '@/config/locale-config';

const CONTENT_TYPES: { value: SavedContentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Items' },
  { value: 'blog', label: 'Blogs' },
  { value: 'case-study', label: 'Case Studies' },
  { value: 'downloadable', label: 'Downloadables' },
  { value: 'recommendation', label: 'Recommendations' }
];

function SavedItemCard({
  item,
  lang,
  onRemove
}: {
  readonly item: SavedItem;
  readonly lang: string;
  readonly onRemove: (item: SavedItem) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const getLocalizedHref = (href: string) => {
    if (localeConfig.multilanguage.enabled) {
      return `/${lang}${href}`;
    }
    return href;
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove(item);
    setIsRemoving(false);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={getLocalizedHref(getSavedItemUrl(item))}>
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
          {item.coverImageUrl ? (
            <Image
              src={item.coverImageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized={item.coverImageUrl.includes('localhost')}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-16 h-16 text-slate-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-slate-700 hover:bg-white">
              {getContentTypeLabel(item.contentType)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-sm text-slate-600 line-clamp-2">{item.excerpt}</p>
          )}
          <p className="text-xs text-slate-400 mt-3">
            Saved {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}

function EmptyLibrary() {
  return (
    <Card className="max-w-2xl mx-auto border-2 shadow-lg">
      <CardContent className="text-center py-16">
        <svg className="w-48 h-48 mx-auto mb-6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="libraryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          <rect x="50" y="60" width="100" height="120" rx="4" fill="url(#libraryGrad)" opacity="0.1" />
          <rect x="60" y="70" width="15" height="80" rx="2" fill="url(#libraryGrad)" opacity="0.6" />
          <rect x="80" y="65" width="15" height="85" rx="2" fill="url(#libraryGrad)" opacity="0.7" />
          <rect x="100" y="70" width="15" height="80" rx="2" fill="url(#libraryGrad)" opacity="0.6" />
          <rect x="120" y="60" width="15" height="90" rx="2" fill="url(#libraryGrad)" opacity="0.8" />
          <path d="M 100 30 L 110 45 L 125 45 L 113 55 L 118 70 L 100 60 L 82 70 L 87 55 L 75 45 L 90 45 Z" fill="url(#libraryGrad)" opacity="0.5" />
        </svg>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Your Library is Empty</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Save articles, resources, and content to access them later. Your saved items will appear here for quick access.
        </p>
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const lang = (params?.lang as string) || 'en';

  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    pageCount: 1,
    total: 0
  });

  const getLocalizedHref = useCallback((href: string) => {
    if (localeConfig.multilanguage.enabled) {
      return `/${lang}${href}`;
    }
    return href;
  }, [lang]);

  const fetchItems = useCallback(async (contentType?: SavedContentType) => {
    setLoading(true);
    try {
      const response = await getMySavedItems(contentType, 1, 50);
      setItems(response.data);
      setPagination(response.meta.pagination);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load your library',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(getLocalizedHref('/auth/login?redirect=/account/library'));
      return;
    }

    if (user) {
      const contentType = activeTab === 'all' ? undefined : activeTab as SavedContentType;
      fetchItems(contentType);
    }
  }, [user, authLoading, router, activeTab, fetchItems, getLocalizedHref]);

  const handleRemoveItem = async (item: SavedItem) => {
    try {
      await toggleSaveItem({
        contentType: item.contentType,
        contentId: item.contentId,
        title: item.title,
        slug: item.slug
      });

      setItems(prev => prev.filter(i => i.contentId !== item.contentId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));

      toast({
        title: 'Removed',
        description: 'Item removed from your library.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive'
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 flex-grow bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">My Library</h1>
              {pagination.total > 0 && (
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {pagination.total} item{pagination.total !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur border-slate-200">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <EmptyLibrary />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <SavedItemCard
                  key={`${item.contentType}-${item.contentId}`}
                  item={item}
                  lang={lang}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
