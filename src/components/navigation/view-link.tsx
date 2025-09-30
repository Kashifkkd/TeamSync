"use client"

import Link from "next/link"
import { useViewParams } from "@/hooks/use-view-params"
import { cn } from "@/lib/utils"

interface ViewLinkProps {
  view: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
}

export function ViewLink({ 
  view, 
  children, 
  className,
  activeClassName,
  inactiveClassName 
}: ViewLinkProps) {
  const { generateViewLink, isViewActive } = useViewParams()
  
  const link = generateViewLink(view)
  const isActive = isViewActive(view)
  
  return (
    <Link 
      href={link}
      className={cn(
        className,
        isActive ? activeClassName : inactiveClassName
      )}
    >
      {children}
    </Link>
  )
}
