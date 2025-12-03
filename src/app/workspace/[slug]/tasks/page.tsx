"use client"

import { use } from "react"
import { TaskViews } from "@/components/tasks/task-views"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface TasksPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ projectId?: string; milestoneId?: string }>
}

export default function TasksPage({ params, searchParams }: TasksPageProps) {
  const { data: session, status } = useSession()
  const { slug } = use(params)
  const search = use(searchParams)

  if (status === "loading") {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Get workspace ID from slug (you'll need to fetch this)
  // For now, we'll use the slug as a placeholder
  const workspaceId = slug

  return (
    <div className="h-full flex flex-col p-6">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and organize your tasks across multiple views
        </p>
      </div> */}

      <TaskViews
        workspaceId={workspaceId}
        projectId={search.projectId}
        milestoneId={search.milestoneId}
      />
    </div>
  )
}
