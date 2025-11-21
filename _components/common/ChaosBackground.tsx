'use client';

import { useEffect, useRef } from 'react';

export function ChaosBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            speedX: number;
            speedY: number;
            size: number;
            color: string;

            constructor() {
                this.x =
                    Math.random() * (canvas?.width || 0);
                this.y =
                    Math.random() * (canvas?.height || 0);
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                const colors = [
                    '#ccff00',
                    '#4f46e5',
                    '#ff00ff',
                    '#00ccff',
                ];
                this.color =
                    colors[
                        Math.floor(
                            Math.random() * colors.length
                        )
                    ];
            }

            update() {
                if (!canvas) return;
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width)
                    this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height)
                    this.speedY *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(
                    this.x,
                    this.y,
                    this.size,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.3;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor(
                (canvas.width * canvas.height) / 15000
            );
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {
                    const dx =
                        particles[i].x - particles[j].x;
                    const dy =
                        particles[i].y - particles[j].y;
                    const distance = Math.sqrt(
                        dx * dx + dy * dy
                    );

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle =
                            particles[i].color;
                        ctx.globalAlpha =
                            0.1 * (1 - distance / 100);
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(
                            particles[i].x,
                            particles[i].y
                        );
                        ctx.lineTo(
                            particles[j].x,
                            particles[j].y
                        );
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            animationFrameId =
                requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
