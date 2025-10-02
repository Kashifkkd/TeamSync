"use client";

import { ReactNode } from "react";

interface HoverEffectProps {
  children: ReactNode;
  className?: string;
}

export function HoverEffect({ children, className = "" }: HoverEffectProps) {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
