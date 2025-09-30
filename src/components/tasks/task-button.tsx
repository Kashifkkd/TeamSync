"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TaskDialog } from "./task-dialog"
import { Plus, Edit } from "lucide-react"

interface TaskButtonProps {
  taskId?: string
  milestoneId?: string
  projectId?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
  onTaskSave?: (task: any) => void
  onTaskDelete?: (taskId: string) => void
  className?: string
}

export function TaskButton({
  taskId,
  milestoneId,
  projectId,
  variant = "default",
  size = "default",
  children,
  onTaskSave,
  onTaskDelete,
  className
}: TaskButtonProps) {
  const [open, setOpen] = useState(false)

  const handleTaskSave = (savedTask: any) => {
    onTaskSave?.(savedTask)
    setOpen(false)
  }

  const handleTaskDelete = (deletedTaskId: string) => {
    onTaskDelete?.(deletedTaskId)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      >
        {children || (
          <>
            {taskId ? (
              <Edit className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {taskId ? "Edit Task" : "Add Task"}
          </>
        )}
      </Button>

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        taskId={taskId}
        milestoneId={milestoneId}
        projectId={projectId}
        onTaskSave={handleTaskSave}
        onTaskDelete={handleTaskDelete}
      />
    </>
  )
}
