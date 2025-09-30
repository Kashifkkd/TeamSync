"use client"

import { useState } from "react"

interface UseTaskDialogOptions {
  onTaskSave?: (task: any) => void
  onTaskDelete?: (taskId: string) => void
}

export function useTaskDialog(options: UseTaskDialogOptions = {}) {
  const [open, setOpen] = useState(false)
  const [taskId, setTaskId] = useState<string | undefined>(undefined)
  const [milestoneId, setMilestoneId] = useState<string | undefined>(undefined)
  const [projectId, setProjectId] = useState<string | undefined>(undefined)

  const openDialog = (taskId?: string, milestoneId?: string, projectId?: string) => {
    setTaskId(taskId)
    setMilestoneId(milestoneId)
    setProjectId(projectId)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setTaskId(undefined)
    setMilestoneId(undefined)
    setProjectId(undefined)
  }

  const handleTaskSave = (savedTask: any) => {
    options.onTaskSave?.(savedTask)
    closeDialog()
  }

  const handleTaskDelete = (deletedTaskId: string) => {
    options.onTaskDelete?.(deletedTaskId)
    closeDialog()
  }

  return {
    open,
    taskId,
    milestoneId,
    projectId,
    openDialog,
    closeDialog,
    handleTaskSave,
    handleTaskDelete
  }
}
