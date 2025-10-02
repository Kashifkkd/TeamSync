"use client";

import { useEffect, useRef } from "react";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = div.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      div.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill || "rgba(29, 78, 216, 0.15)"}, transparent 40%)`;
    };

    div.addEventListener("mousemove", handleMouseMove);
    return () => div.removeEventListener("mousemove", handleMouseMove);
  }, [fill]);

  return (
    <div
      ref={divRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `radial-gradient(600px circle at 50% 50%, ${fill || "rgba(29, 78, 216, 0.15)"}, transparent 40%)`,
      }}
    />
  );
}
