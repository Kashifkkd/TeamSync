"use client";

import { useEffect, useRef } from "react";

interface MeteorsProps {
  number?: number;
}

export function Meteors({ number = 20 }: MeteorsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const meteors: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      trail: Array<{ x: number; y: number; life: number }>;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createMeteor = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -10;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 3 + 2;
          break;
        case 1: // Right
          x = canvas.width + 10;
          y = Math.random() * canvas.height;
          vx = -(Math.random() * 3 + 2);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 10;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 3 + 2);
          break;
        default: // Left
          x = -10;
          y = Math.random() * canvas.height;
          vx = Math.random() * 3 + 2;
          vy = (Math.random() - 0.5) * 2;
      }

      meteors.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        size: Math.random() * 3 + 1,
        trail: []
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new meteors
      if (Math.random() < 0.02) {
        createMeteor();
      }

      // Update and draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        
        // Add to trail
        meteor.trail.push({ x: meteor.x, y: meteor.y, life: 1 });
        if (meteor.trail.length > 20) {
          meteor.trail.shift();
        }

        // Update trail
        meteor.trail.forEach(point => {
          point.life -= 0.05;
        });

        // Draw trail
        for (let j = 0; j < meteor.trail.length - 1; j++) {
          const point = meteor.trail[j];
          const nextPoint = meteor.trail[j + 1];
          
          if (point.life > 0) {
            const alpha = point.life * 0.8;
            const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y);
            gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
            gradient.addColorStop(1, `rgba(147, 51, 234, ${alpha * 0.5})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = meteor.size * point.life;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }

        // Update position
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life++;

        // Draw meteor head
        if (meteor.life < meteor.maxLife) {
          const alpha = 1 - (meteor.life / meteor.maxLife);
          const gradient = ctx.createRadialGradient(
            meteor.x, meteor.y, 0,
            meteor.x, meteor.y, meteor.size * 2
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.8})`);
          gradient.addColorStop(1, `rgba(147, 51, 234, ${alpha * 0.4})`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          meteors.splice(i, 1);
        }
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
  }, [number]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ zIndex: 3 }}
    />
  );
}
