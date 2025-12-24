'use client';

import { useEffect, useRef } from 'react';

export function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      time += 0.005;

      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        0,
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        canvas.width * 0.6
      );
      gradient1.addColorStop(0, 'rgba(250, 129, 17, 0.15)');
      gradient1.addColorStop(1, 'rgba(250, 129, 17, 0)');

      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.cos(time * 0.8) * 0.3),
        canvas.height * (0.7 + Math.sin(time * 0.8) * 0.3),
        0,
        canvas.width * (0.3 + Math.cos(time * 0.8) * 0.3),
        canvas.height * (0.7 + Math.sin(time * 0.8) * 0.3),
        canvas.width * 0.5
      );
      gradient2.addColorStop(0, 'rgba(36, 47, 80, 0.15)');
      gradient2.addColorStop(1, 'rgba(36, 47, 80, 0)');

      const gradient3 = ctx.createRadialGradient(
        canvas.width * (0.7 + Math.sin(time * 1.2) * 0.2),
        canvas.height * (0.3 + Math.cos(time * 1.2) * 0.2),
        0,
        canvas.width * (0.7 + Math.sin(time * 1.2) * 0.2),
        canvas.height * (0.3 + Math.cos(time * 1.2) * 0.2),
        canvas.width * 0.4
      );
      gradient3.addColorStop(0, 'rgba(167, 19, 34, 0.1)');
      gradient3.addColorStop(1, 'rgba(167, 19, 34, 0)');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'soft-light' }}
    />
  );
}
