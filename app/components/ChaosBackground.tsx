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
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.speedX = (Math.random() - 0.5) * 15; // Fast chaotic movement
                this.speedY = (Math.random() - 0.5) * 15;
                this.size = Math.random() * 150 + 50; // Large abstract shapes
                
                // Cyber-surreal colors
                const colors = [
                    'rgba(20, 0, 50, 0.1)',   // Deep Void
                    'rgba(100, 0, 255, 0.05)', // Neon Purple
                    'rgba(0, 255, 150, 0.03)', // Cyber Green
                    'rgba(50, 50, 255, 0.05)'  // Electric Blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Glitch effect: random jumps
                if (Math.random() < 0.01) {
                    this.x += (Math.random() - 0.5) * 100;
                }

                // Wrap around screen
                if (this.x > canvas!.width + 200) this.x = -200;
                if (this.x < -200) this.x = canvas!.width + 200;
                if (this.y > canvas!.height + 200) this.y = -200;
                if (this.y < -200) this.y = canvas!.height + 200;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add some "data noise" lines
                if (Math.random() < 0.05) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x + (Math.random() - 0.5) * 200, this.y);
                    ctx.stroke();
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(5, 5, 10, 0.2)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Random "glitch" overlay
            if (Math.random() < 0.05) {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
                ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 50);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen"
        />
    );
}
