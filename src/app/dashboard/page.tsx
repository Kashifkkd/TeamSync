"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BrandLoader } from "@/components/ui/brand-loader"

const loadingMessages = [
  "Setting up your workspace...",
  "Loading your workspaces...",
  "Preparing your dashboard...",
  "Almost there...",
  "Finalizing setup...",
  "Redirecting to your workspace...",
  "Redirecting to onboarding...",
  "Welcome to TeamSync!",
  "Getting everything ready...",
  "Loading your projects...",
  "Setting up collaboration...",
  "Preparing your team space..."
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading] = useState(true)
  const [loadingText, setLoadingText] = useState("Setting up your workspace...")

  useEffect(() => {
    if (status === "loading") return // Still loading session

    if (!session) {
      router.push("/auth/signin")
      return
    }

    const getRandomMessage = () => {
      return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    }

    const checkWorkspaces = async () => {
      try {
        // Show random loading messages
        const messageInterval = setInterval(() => {
          setLoadingText(getRandomMessage())
        }, 800)
        
        const response = await fetch("/api/workspaces")
        clearInterval(messageInterval)
        
        if (response.ok) {
          const data = await response.json()
          const workspaces = data.workspaces || []
          
          if (workspaces.length > 0) {
            // Check if user is admin/owner in any workspace
            const hasAdminAccess = workspaces.some((ws: { userRole: string }) => 
              ws.userRole === 'owner' || ws.userRole === 'admin'
            )
            
            if (hasAdminAccess) {
              setLoadingText("Redirecting to admin dashboard...")
              setTimeout(() => {
                router.push("/admin")
              }, 500)
            } else {
              setLoadingText("Redirecting to your workspace...")
              setTimeout(() => {
                router.push(`/workspace/${workspaces[0].slug}`)
              }, 500)
            }
          } else {
            setLoadingText("Redirecting to onboarding...")
            setTimeout(() => {
              router.push("/onboarding")
            }, 500)
          }
        } else {
          setLoadingText("Redirecting to onboarding...")
          setTimeout(() => {
            router.push("/onboarding")
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        setLoadingText("Redirecting to onboarding...")
        setTimeout(() => {
          router.push("/onboarding")
        }, 500)
      }
    }

    checkWorkspaces()
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
        <BrandLoader 
          size="lg" 
          text={loadingText} 
        />
        </div>
      </div>
    )
  }

  return null
}
