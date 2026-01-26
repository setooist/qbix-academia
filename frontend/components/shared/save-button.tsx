'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
    toggleSaveItem,
    checkItemSaved,
    SavedContentType,
    SaveItemPayload
} from '@/lib/api/saved-items';
import { localeConfig } from '@/config/locale-config';

interface SaveButtonProps {
    readonly contentType: SavedContentType;
    readonly contentId: string;
    readonly title: string;
    readonly slug: string;
    readonly excerpt?: string;
    readonly coverImageUrl?: string;
    readonly variant?: 'default' | 'outline' | 'ghost';
    readonly size?: 'default' | 'sm' | 'lg' | 'icon';
    readonly showText?: boolean;
    readonly className?: string;
}

export function SaveButton({
    contentType,
    contentId,
    title,
    slug,
    excerpt,
    coverImageUrl,
    variant = 'outline',
    size = 'sm',
    showText = true,
    className = ''
}: SaveButtonProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang || 'en';

    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const getLocalizedHref = useCallback((href: string) => {
        if (localeConfig.multilanguage.enabled) {
            return `/${lang}${href}`;
        }
        return href;
    }, [lang]);

    // Check if item is already saved on mount
    useEffect(() => {
        async function checkSavedStatus() {
            if (!user || !contentId) {
                setIsChecking(false);
                return;
            }

            try {
                const saved = await checkItemSaved(contentType, contentId);
                setIsSaved(saved);
            } catch (error) {
                console.error('Error checking saved status:', error);
            } finally {
                setIsChecking(false);
            }
        }

        checkSavedStatus();
    }, [user, contentType, contentId]);

    const handleSaveClick = async () => {
        // If not logged in, redirect to login
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please log in to save items to your library.',
                variant: 'default'
            });
            router.push(getLocalizedHref('/auth/login'));
            return;
        }

        setIsLoading(true);

        try {
            const payload: SaveItemPayload = {
                contentType,
                contentId,
                title,
                slug,
                excerpt,
                coverImageUrl
            };

            const result = await toggleSaveItem(payload);
            setIsSaved(result.saved);

            toast({
                title: result.saved ? 'Saved to Library' : 'Removed from Library',
                description: result.saved
                    ? 'This item has been added to your library.'
                    : 'This item has been removed from your library.',
                variant: 'default'
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to save item',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = isLoading || isChecking;
    const Icon = isSaved ? BookmarkCheck : Bookmark;

    return (
        <Button
            variant={isSaved ? 'default' : variant}
            size={size}
            onClick={handleSaveClick}
            disabled={isDisabled}
            className={`${isSaved ? 'bg-primary text-white' : ''} ${className}`}
            aria-label={isSaved ? 'Remove from library' : 'Save to library'}
        >
            {isLoading || isChecking ? (
                <Loader2 className={`w-4 h-4 animate-spin ${showText ? 'mr-2' : ''}`} />
            ) : (
                <Icon className={`w-4 h-4 ${showText ? 'mr-2' : ''}`} />
            )}
            {showText && (isSaved ? 'Saved' : 'Save')}
        </Button>
    );
}
