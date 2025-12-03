"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTask, useUpdateTask } from '@/hooks/use-tasks'
import { useAutoSave } from '@/hooks/use-autosave'
import { useParams } from 'next/navigation'
import {
  FileText,
  CheckSquare,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { SubtaskSection } from './subtask-section'
import { Task } from '@/hooks/use-tasks'
import { AutoSaveIndicator } from '@/components/ui/autosave-indicator'

interface TaskTabsProps {
  taskId?: string
  workspaceId?: string
  onSubtaskClick?: (subtask: Task) => void
  onSubtaskEdit?: (subtask: Task) => void
}

export function TaskTabs({ taskId, workspaceId, onSubtaskClick, onSubtaskEdit }: TaskTabsProps) {
  const params = useParams()
  const workspaceSlug = params.slug as string
  
  const { data: taskData } = useTask(workspaceSlug, taskId)
  const updateTask = useUpdateTask(workspaceSlug, taskId || '')
  
  const [activeTab, setActiveTab] = useState('subtasks') // Start with subtasks as the default
  const [description, setDescription] = useState('')

  // Update description when task data loads
  useEffect(() => {
    if (taskData?.task?.description) {
      setDescription(taskData.task.description)
    }
  }, [taskData])

  // Auto-save for description
  const { isSaving, lastSaved, hasUnsavedChanges } = useAutoSave(description, {
    delay: 2000,
    enabled: !!taskId,
    onSave: async (desc) => {
      await updateTask.mutateAsync({
        description: desc.trim() || null,
      })
    }
  })

  const tabs = [
    { id: 'subtasks', label: 'Subtasks', icon: CheckSquare },
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'actionItems', label: 'Action Items', icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      {/* Subtasks Section - Always visible at the top */}
      {taskId && workspaceId && (
        <SubtaskSection
          workspaceId={workspaceId}
          parentTaskId={taskId}
          onSubtaskClick={onSubtaskClick}
          onSubtaskEdit={onSubtaskEdit}
        />
      )}

      {/* Description Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Description</h3>
          <div className="flex items-center gap-2">
            <AutoSaveIndicator 
              isSaving={isSaving}
              lastSaved={lastSaved}
              hasUnsavedChanges={hasUnsavedChanges}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs h-6"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Write with AI
            </Button>
          </div>
        </div>
        
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Additional Tabs */}
      <div className="space-y-4">
        <div className="border-b border-border">
          <div className="flex gap-6">
            {tabs.slice(1).map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-normal rounded-none pb-1 px-0 ${
                    activeTab === tab.id 
                      ? 'text-primary font-medium border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Additional task details and custom fields will be displayed here.
              </div>
            </div>
          )}
          {activeTab === 'actionItems' && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Action items and follow-up tasks will be managed here.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
