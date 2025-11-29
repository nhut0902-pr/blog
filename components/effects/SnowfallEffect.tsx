'use client';

import { useEffect, useRef } from 'react';

export default function SnowfallEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Snowflake class
        class Snowflake {
            x: number;
            y: number;
            radius: number;
            speed: number;
            drift: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height - canvas!.height;
                this.radius = Math.random() * 2 + 1; // Small size for gentle effect
                this.speed = Math.random() * 0.5 + 0.3; // Slow fall speed
                this.drift = Math.random() * 0.5 - 0.25; // Gentle drift
            }

            update() {
                this.y += this.speed;
                this.x += this.drift;

                // Reset when snowflake goes off screen
                if (this.y > canvas!.height) {
                    this.y = -10;
                    this.x = Math.random() * canvas!.width;
                }

                if (this.x > canvas!.width) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = canvas!.width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
                ctx.closePath();
            }
        }

        // Create snowflakes (gentle amount - 50 particles)
        const snowflakes: Snowflake[] = [];
        for (let i = 0; i < 50; i++) {
            snowflakes.push(new Snowflake());
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            snowflakes.forEach(snowflake => {
                snowflake.update();
                snowflake.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
