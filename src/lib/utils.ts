import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }

  return formatDate(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateProjectKey(name: string): string {
  if (!name.trim()) return ""
  
  // Split by spaces and take first letter of each word
  const words = name.trim().split(/\s+/)
  let key = ""
  
  if (words.length === 1) {
    // Single word - take first 4 characters
    key = words[0].substring(0, 4).toLowerCase()
  } else {
    // Multiple words - take first letter of each word
    key = words.map(word => word.charAt(0)).join("").toLowerCase()
  }
  
  // Ensure it's at least 2 characters and max 4
  if (key.length < 2) {
    key = name.substring(0, 4).toLowerCase()
  }
  
  // Remove any non-alphanumeric characters and ensure lowercase
  return key.replace(/[^a-z0-9]/g, "").substring(0, 4)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Task statuses
    todo: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    in_review: "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    
    // Priority colors
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
    
    // Project statuses
    active: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
    on_hold: "bg-yellow-100 text-yellow-800",
  }
  
  return colors[status] || "bg-gray-100 text-gray-800"
}

export function getPriorityIcon(priority: string): string {
  const icons: Record<string, string> = {
    low: "🔽",
    medium: "➡️",
    high: "🔼",
    critical: "🔴",
  }
  
  return icons[priority] || "➡️"
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(null, args)
    }
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  
  // Fallback for older browsers
  const textArea = document.createElement("textarea")
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand("copy")
  } catch (err) {
    console.error("Failed to copy text: ", err)
  }
  
  document.body.removeChild(textArea)
  return Promise.resolve()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function sortByProperty<T>(
  array: T[],
  property: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })
}
