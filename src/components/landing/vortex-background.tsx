"use client";

import { useEffect, useRef } from "react";

export function VortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawVortex = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) / 2;

      // Create multiple vortex layers
      for (let layer = 0; layer < 3; layer++) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        
        if (layer === 0) {
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
          gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.05)");
          gradient.addColorStop(1, "rgba(6, 182, 212, 0.02)");
        } else if (layer === 1) {
          gradient.addColorStop(0, "rgba(236, 72, 153, 0.08)");
          gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.04)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0.01)");
        } else {
          gradient.addColorStop(0, "rgba(6, 182, 212, 0.06)");
          gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.03)");
          gradient.addColorStop(1, "rgba(236, 72, 153, 0.01)");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        const radius = maxRadius * (1 - layer * 0.3);
        const rotation = time * 0.001 + layer * Math.PI / 3;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const r = radius * (0.8 + 0.2 * Math.sin(angle * 3 + rotation));
          const x = centerX + r * Math.cos(angle + rotation);
          const y = centerY + r * Math.sin(angle + rotation);
          
          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
      }

      time += 1;
      animationId = requestAnimationFrame(drawVortex);
    };

    resizeCanvas();
    drawVortex();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ zIndex: 2 }}
    />
  );
}
