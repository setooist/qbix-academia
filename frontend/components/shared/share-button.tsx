'use client';

import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface ShareButtonProps {
    readonly title: string;
    readonly url?: string;
    readonly variant?: 'default' | 'outline' | 'ghost';
    readonly size?: 'default' | 'sm' | 'lg' | 'icon';
    readonly showText?: boolean;
    readonly className?: string;
}

export function ShareButton({
    title,
    url,
    variant = 'outline',
    size = 'sm',
    showText = true,
    className = ''
}: ShareButtonProps) {
    // Get current URL if not provided
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const handleEmailShare = () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}`;
        window.location.href = emailUrl;
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleEmailShare}
            aria-label="Share via Email"
        >
            <Mail className={`w-4 h-4 ${showText ? 'mr-2' : ''}`} />
            {showText && 'Share'}
        </Button>
    );
}

