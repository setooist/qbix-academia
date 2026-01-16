import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ContentCardProps {
    title: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    imageUnoptimized?: boolean;
    badges?: React.ReactNode[];
    meta?: React.ReactNode;
    action?: React.ReactNode;
    isLocked?: boolean;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
}

export function ContentCard({
    title,
    description,
    imageSrc,
    imageAlt = '',
    imageUnoptimized = false,
    badges = [],
    meta,
    action,
    isLocked = false,
    href,
    onClick,
    className
}: ContentCardProps) {
    const LinkWrapper = (!isLocked && href) ? Link : 'div';
    // @ts-ignore
    const linkProps = (!isLocked && href) ? { href } : {};

    return (
        // @ts-ignore
        <LinkWrapper
            {...linkProps}
            className={cn("block h-full cursor-pointer", className)}
            onClick={onClick}
        >
            <Card className={cn(
                "h-full border-2 transition-all duration-300 group flex flex-col",
                isLocked ? "border-gray-200 bg-gray-50 opacity-80" : "hover:border-primary hover:shadow-2xl hover:-translate-y-2"
            )}>
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg shrink-0">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            unoptimized={imageUnoptimized}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={cn("object-cover", isLocked && 'grayscale blur-sm')}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}

                    {isLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-10">
                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                <Lock className="w-6 h-6 text-gray-700" />
                            </div>
                        </div>
                    )}
                </div>

                <CardHeader>
                    {badges && badges.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {React.Children.toArray(badges)}
                        </div>
                    )}
                    <CardTitle className={cn("line-clamp-2", isLocked ? 'text-gray-600' : 'group-hover:text-primary transition-colors duration-300')}>
                        {title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto">
                    {meta && (
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            {meta}
                        </div>
                    )}
                    {action}
                </CardContent>
            </Card>
        </LinkWrapper>
    );
}
