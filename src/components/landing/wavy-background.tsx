"use client";

import { useEffect, useRef } from "react";

export function WavyBackground() {
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

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create multiple wave layers
      const waves = [
        { amplitude: 50, frequency: 0.01, speed: 0.002, color: "rgba(59, 130, 246, 0.1)", offset: 0 },
        { amplitude: 30, frequency: 0.015, speed: 0.003, color: "rgba(147, 51, 234, 0.08)", offset: Math.PI / 3 },
        { amplitude: 40, frequency: 0.008, speed: 0.001, color: "rgba(6, 182, 212, 0.06)", offset: Math.PI / 2 },
        { amplitude: 25, frequency: 0.012, speed: 0.004, color: "rgba(236, 72, 153, 0.05)", offset: Math.PI },
      ];

      waves.forEach((wave, index) => {
        ctx.fillStyle = wave.color;
        ctx.beginPath();
        
        // Start from left edge
        ctx.moveTo(0, canvas.height);
        
        // Draw wave
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.7 + 
                   wave.amplitude * Math.sin(x * wave.frequency + time * wave.speed + wave.offset) +
                   (index * 20); // Offset each wave vertically
          ctx.lineTo(x, y);
        }
        
        // Complete the shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      });

      // Add some floating particles
      for (let i = 0; i < 20; i++) {
        const x = (time * 0.5 + i * 100) % (canvas.width + 50) - 25;
        const y = canvas.height * 0.3 + Math.sin(time * 0.001 + i) * 30;
        const size = 2 + Math.sin(time * 0.002 + i) * 1;
        const alpha = 0.3 + Math.sin(time * 0.003 + i) * 0.2;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 1;
      animationId = requestAnimationFrame(drawWaves);
    };

    resizeCanvas();
    drawWaves();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50"
      style={{ zIndex: 1 }}
    />
  );
}
