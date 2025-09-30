"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

interface UseViewParamsOptions {
  defaultView?: string
  validViews?: string[]
  paramName?: string
}

export function useViewParams(options: UseViewParamsOptions = {}) {
  const {
    defaultView = "all",
    validViews = ["all", "board", "list", "calendar", "table", "gantt"],
    paramName = "view"
  } = options

  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeView, setActiveView] = useState(defaultView)

  // Initialize view from URL parameters
  useEffect(() => {
    const viewParam = searchParams.get(paramName)
    if (viewParam && validViews.includes(viewParam)) {
      setActiveView(viewParam)
    } else {
      setActiveView(defaultView)
    }
  }, [searchParams, paramName, validViews, defaultView])

  // Update URL parameters when view changes
  const updateView = (view: string) => {
    if (!validViews.includes(view)) {
      console.warn(`Invalid view: ${view}. Must be one of: ${validViews.join(", ")}`)
      return
    }

    setActiveView(view)
    
    const params = new URLSearchParams(searchParams.toString())
    if (view === defaultView) {
      params.delete(paramName)
    } else {
      params.set(paramName, view)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Generate dynamic links for different views
  const generateViewLink = (view: string) => {
    if (!validViews.includes(view)) {
      console.warn(`Invalid view: ${view}. Must be one of: ${validViews.join(", ")}`)
      return "#"
    }

    const params = new URLSearchParams(searchParams.toString())
    if (view === defaultView) {
      params.delete(paramName)
    } else {
      params.set(paramName, view)
    }
    return `?${params.toString()}`
  }

  // Get current view parameter value
  const getViewParam = () => {
    return searchParams.get(paramName) || defaultView
  }

  // Check if a view is currently active
  const isViewActive = (view: string) => {
    return activeView === view
  }

  return {
    activeView,
    updateView,
    generateViewLink,
    getViewParam,
    isViewActive,
    validViews
  }
}
