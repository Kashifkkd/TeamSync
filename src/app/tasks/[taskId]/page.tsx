"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TaskDialog } from "@/components/tasks/task-dialog"

export default function TaskPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.taskId as string
  const [open, setOpen] = useState(true)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      router.back()
    }
  }

  const handleTaskSave = (task: any) => {
    // Handle task save - maybe show toast or update parent
    console.log("Task saved:", task)
  }

  const handleTaskDelete = (deletedTaskId: string) => {
    // Handle task delete - maybe show toast or update parent
    console.log("Task deleted:", deletedTaskId)
    router.back()
  }

  return (
    <TaskDialog
      open={open}
      onOpenChange={handleOpenChange}
      taskId={taskId}
      fullscreen={true}
      onTaskSave={handleTaskSave}
      onTaskDelete={handleTaskDelete}
    />
  )
}
