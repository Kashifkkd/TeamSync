"use client";

import { useEffect, useRef } from "react";

export function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const beams: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBeam = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = 0;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 2 + 1;
          break;
        case 1: // Right
          x = canvas.width;
          y = Math.random() * canvas.height;
          vx = -(Math.random() * 2 + 1);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 2 + 1);
          break;
        default: // Left
          x = 0;
          y = Math.random() * canvas.height;
          vx = Math.random() * 2 + 1;
          vy = (Math.random() - 0.5) * 2;
      }

      beams.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new beams
      if (Math.random() < 0.02) {
        createBeam();
      }

      // Update and draw beams
      for (let i = beams.length - 1; i >= 0; i--) {
        const beam = beams[i];
        beam.x += beam.vx;
        beam.y += beam.vy;
        beam.life++;

        if (beam.life >= beam.maxLife || beam.x < 0 || beam.x > canvas.width || beam.y < 0 || beam.y > canvas.height) {
          beams.splice(i, 1);
          continue;
        }

        const alpha = 1 - (beam.life / beam.maxLife);
        const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x + beam.vx * 10, beam.y + beam.vy * 10);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(147, 51, 234, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, ${alpha * 0.4})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(beam.x + beam.vx * 20, beam.y + beam.vy * 20);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 1 }}
    />
  );
}
