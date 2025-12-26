'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        setProgress(20);

        const timer1 = setTimeout(() => setProgress(40), 100);
        const timer2 = setTimeout(() => setProgress(60), 200);
        const timer3 = setTimeout(() => setProgress(80), 300);
        const timer4 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => setLoading(false), 200);
        }, 400);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-primary via-orange to-primary transition-all duration-300 ease-out"
                style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 10px rgba(250, 129, 17, 0.5)',
                }}
            />
        </div>
    );
}
