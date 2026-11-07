"use client";

import React, { useEffect, useRef } from "react";

type SparklesCoreProps = {
  className?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  phase: number;
  drift: number;
  rise: number;
};

export const SparklesCore = ({
  className,
  particleColor = "#FFFFFF",
  particleDensity = 520,
  minSize = 0.4,
  maxSize = 1.2,
  speed = 0.8,
}: SparklesCoreProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 1;
    let height = 1;
    let particles: Particle[] = [];
    let animationFrame = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const createParticles = () => {
      const count = Math.min(
        220,
        Math.max(
          28,
          Math.round(((width * height) / 100_000) * particleDensity),
        ),
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: minSize + Math.random() * Math.max(0, maxSize - minSize),
        opacity: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.035,
        rise: 0.015 + Math.random() * 0.045,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = particleColor;

      particles.forEach((particle) => {
        const pulse = (Math.sin(time * 0.002 * speed + particle.phase) + 1) / 2;
        context.globalAlpha = particle.opacity * (0.5 + pulse * 0.5);
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius * (0.8 + pulse * 0.35),
          0,
          Math.PI * 2,
        );
        context.fill();

        if (!reduceMotion) {
          particle.x += particle.drift * speed;
          particle.y -= particle.rise * speed;

          if (particle.y < -2) particle.y = height + 2;
          if (particle.x < -2) particle.x = width + 2;
          if (particle.x > width + 2) particle.x = -2;
        }
      });

      context.globalAlpha = 1;
      if (!reduceMotion && visible) animationFrame = window.requestAnimationFrame(draw);
    };

    // Perf: only animate while on screen.
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) animationFrame = window.requestAnimationFrame(draw);
      if (!visible) window.cancelAnimationFrame(animationFrame);
    });
    io.observe(canvas);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    draw(performance.now());

    return () => {
      io.disconnect();
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [maxSize, minSize, particleColor, particleDensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className ?? ""}`}
    />
  );
};
