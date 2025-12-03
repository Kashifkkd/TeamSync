"use client"

import React, { useState } from 'react'
import { TaskHeader } from './task-header'
import { TaskAttributes } from './task-attributes'
import { TaskTabs } from './task-tabs'
import { CustomFields } from './custom-fields'
import { Attachments } from './attachments'
import { ActivityFeed } from './activity-feed'
import { TaskEditorDialog as TaskDialog } from './task-editor-dialog'
import { Task } from '@/hooks/use-tasks'

interface TaskEditorProps {
  taskId?: string
  milestoneId?: string
  projectId?: string
  workspaceId?: string
  onTaskSave?: (task: unknown) => void
  onTaskDelete?: (taskId: string) => void
  onClose?: () => void
}

export function TaskEditor({
  taskId,
  milestoneId,
  projectId,
  workspaceId,
  onTaskSave,
  onTaskDelete,
  onClose,
}: TaskEditorProps) {
  const [selectedSubtask, setSelectedSubtask] = useState<Task | null>(null)
  const [subtaskDialogOpen, setSubtaskDialogOpen] = useState(false)

  const handleSubtaskClick = (subtask: Task) => {
    setSelectedSubtask(subtask)
    setSubtaskDialogOpen(true)
  }

  const handleSubtaskEdit = (subtask: Task) => {
    setSelectedSubtask(subtask)
    setSubtaskDialogOpen(true)
  }

  const handleSubtaskDialogClose = () => {
    setSubtaskDialogOpen(false)
    setSelectedSubtask(null)
  }

  const handleTaskCreated = (task: unknown) => {
    // Call the parent's onTaskSave if provided
    onTaskSave?.(task)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex h-full">
        {/* Left Panel - Task Details */}
        <div className="flex-2 flex flex-col">
          <div className="p-6 flex-1 overflow-auto">
            <TaskHeader 
              taskId={taskId} 
              milestoneId={milestoneId}
              projectId={projectId}
              onClose={onClose}
              onTaskCreated={handleTaskCreated}
            />
            
            <div className="mt-6">
              <TaskAttributes taskId={taskId} />
            </div>
            
            <div className="mt-6">
              <TaskTabs 
                taskId={taskId}
                workspaceId={workspaceId}
                onSubtaskClick={handleSubtaskClick}
                onSubtaskEdit={handleSubtaskEdit}
              />
            </div>
            
            <div className="mt-6">
              <CustomFields />
            </div>
            
            <div className="mt-6">
              <Attachments />
            </div>
          </div>
        </div>

        {/* Right Panel - Activity Feed */}
        <div className="flex-1 border-l border-border">
          <ActivityFeed />
        </div>
      </div>

      {/* Subtask Dialog */}
      <TaskDialog
        open={subtaskDialogOpen}
        onClose={handleSubtaskDialogClose}
        taskId={selectedSubtask?.id}
        workspaceId={workspaceId}
        onTaskSave={() => {
          // Refresh subtasks when a subtask is saved
          handleSubtaskDialogClose()
        }}
        onTaskDelete={() => {
          // Refresh subtasks when a subtask is deleted
          handleSubtaskDialogClose()
        }}
      />
    </div>
  )
}
