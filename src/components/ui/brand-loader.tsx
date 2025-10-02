"use client"

import { cn } from "@/lib/utils"

interface BrandLoaderProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function BrandLoader({ 
  size = "md", 
  text = "Loading...", 
  className 
}: BrandLoaderProps) {
  const sizeClasses = {
    sm: "w-32 h-16",
    md: "w-48 h-24", 
    lg: "w-64 h-32"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {/* Infinity SVG Animation */}
      <div className={cn("relative", sizeClasses[size])}>
        <svg 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox="0 0 187.3 93.7" 
          width="100%" 
          height="100%"
        >
          <defs>
            <style>
              {`
                #outline {
                  stroke-dasharray: 2.42777px, 242.77666px;
                  stroke-dashoffset: 0;
                  animation: anim 1.6s linear infinite;
                }
                @keyframes anim {
                  12.5% {
                    stroke-dasharray: 33.98873px, 242.77666px;
                    stroke-dashoffset: -26.70543px;
                  }
                  43.75% {
                    stroke-dasharray: 84.97183px, 242.77666px;
                    stroke-dashoffset: -84.97183px;
                  }
                  100% {
                    stroke-dasharray: 2.42777px, 242.77666px;
                    stroke-dashoffset: -240.34889px;
                  }
                }
              `}
            </style>
          </defs>
          <path 
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" 
            strokeMiterlimit="10" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth="4" 
            fill="none" 
            id="outline" 
            stroke="url(#gradient)"
          />
          <path 
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" 
            strokeMiterlimit="10" 
            strokeLinejoin="round" 
            strokeLinecap="round" 
            strokeWidth="4" 
            stroke="url(#gradient)" 
            fill="none" 
            opacity="0.1"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <span className={cn(
          "font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent",
          textSizeClasses[size]
        )}>
          {text}
        </span>
      </div>
    </div>
  )
}

// Epic full screen loader overlay
export function BrandLoaderOverlay({ 
  text = "Welcome to TeamSync!", 
  show = false 
}: { 
  text?: string
  show?: boolean 
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 backdrop-blur-md">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-12 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-sm"></div>
        <div className="relative">
          <BrandLoader size="lg" text={text} />
        </div>
      </div>
    </div>
  )
}

// Simple inline loader for buttons
export function BrandLoaderInline({ 
  text = "Loading...", 
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-4 h-4 relative">
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin">
          <div className="absolute inset-0.5 rounded-full bg-white dark:bg-black"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm animate-pulse"></div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{text}</span>
    </div>
  )
}

