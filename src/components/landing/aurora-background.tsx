"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
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

    const drawAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient1.addColorStop(0, "rgba(59, 130, 246, 0.1)");
      gradient1.addColorStop(0.5, "rgba(147, 51, 234, 0.1)");
      gradient1.addColorStop(1, "rgba(6, 182, 212, 0.1)");

      const gradient2 = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height);
      gradient2.addColorStop(0, "rgba(236, 72, 153, 0.1)");
      gradient2.addColorStop(0.5, "rgba(168, 85, 247, 0.1)");
      gradient2.addColorStop(1, "rgba(59, 130, 246, 0.1)");

      // First aurora layer
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.3);
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height * 0.3 + Math.sin((x * 0.01) + time * 0.002) * 100 + 
                  Math.sin((x * 0.005) + time * 0.001) * 50;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Second aurora layer
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.6);
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height * 0.6 + Math.sin((x * 0.008) + time * 0.003) * 80 + 
                  Math.sin((x * 0.003) + time * 0.002) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      time += 1;
      animationId = requestAnimationFrame(drawAurora);
    };

    resizeCanvas();
    drawAurora();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ zIndex: 1 }}
    />
  );
}
