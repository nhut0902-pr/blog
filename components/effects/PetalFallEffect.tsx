'use client';

import { useEffect, useRef } from 'react';

export default function PetalFallEffect() {
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

        // Petal class
        class Petal {
            x: number;
            y: number;
            size: number;
            speed: number;
            drift: number;
            rotation: number;
            rotationSpeed: number;
            emoji: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height - canvas!.height;
                this.size = Math.random() * 4 + 3; // Smaller size for emoji
                this.speed = Math.random() * 0.5 + 0.3; // Slow fall
                this.drift = Math.random() * 0.5 - 0.25; // Gentle drift
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;

                // Random flower emojis for spring
                const flowers = ['🌸', '🌺', '🌼', '🏵️'];
                this.emoji = flowers[Math.floor(Math.random() * flowers.length)];
            }

            update() {
                this.y += this.speed;
                this.x += this.drift;
                this.rotation += this.rotationSpeed;

                // Reset when petal goes off screen
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
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.font = `${this.size * 5}px Arial`;
                ctx.fillText(this.emoji, 0, 0);
                ctx.restore();
            }
        }

        // Create petals (gentle amount - 40 particles)
        const petals: Petal[] = [];
        for (let i = 0; i < 40; i++) {
            petals.push(new Petal());
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            petals.forEach(petal => {
                petal.update();
                petal.draw();
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
