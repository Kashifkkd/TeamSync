"use client";

import { ReactNode } from "react";

interface CardHoverEffectProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CardHoverEffect({ children, className = "", onClick }: CardHoverEffectProps) {
  return (
    <div 
      className={`group relative ${className}`}
      onClick={onClick}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
