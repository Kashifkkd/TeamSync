"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingBarProps {
  isLoading: boolean
}

export function LoadingBar({ isLoading }: LoadingBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      // Complete the progress bar
      setProgress(100)
      const timeout = setTimeout(() => setProgress(0), 500)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {progress > 0 && progress < 100 && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          exit={{ width: "100%", opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  )
}

