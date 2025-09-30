"use client"

import React from 'react'
import { Box } from '@mui/material'
import { TaskHeader } from './task-header'
import { TaskAttributes } from './task-attributes'
import { TaskTabs } from './task-tabs'
import { CustomFields } from './custom-fields'
import { Attachments } from './attachments'
import { ActivityFeed } from './activity-feed'

interface TaskEditorProps {
  taskId?: string
  milestoneId?: string
  projectId?: string
  onTaskSave?: (task: unknown) => void
  onTaskDelete?: (taskId: string) => void
  onClose?: () => void
}

export function TaskEditor({
  taskId,
  onClose,
}: TaskEditorProps) {
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex h-full">
        {/* Left Panel - Task Details */}
        <div className="flex-2 flex flex-col">
          <div className="p-6 flex-1 overflow-auto">
            <TaskHeader taskId={taskId} onClose={onClose} />
            
            <div className="mt-6">
              <TaskAttributes />
            </div>
            
            <div className="mt-6">
              <TaskTabs />
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
    </div>
  )
}
