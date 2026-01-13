import { useEffect, useState } from 'react';

export function useCounter(end: number, duration: number = 2000, start: number = 0) {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(easeOutQuart * (end - start) + start));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [end, duration, start, hasStarted]);

    return { count, startCounting: () => setHasStarted(true) };
}