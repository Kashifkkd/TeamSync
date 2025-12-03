"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTask, useUpdateTask, useCreateTask } from '@/hooks/use-tasks'
import { useAutoSave } from '@/hooks/use-autosave'
import { useParams } from 'next/navigation'
import {
  CheckSquare,
  Sparkles,
  X,
  Minimize2,
} from 'lucide-react'
import { AutoSaveIndicator } from '@/components/ui/autosave-indicator'

interface TaskHeaderProps {
  taskId?: string
  milestoneId?: string
  projectId?: string
  onClose?: () => void
  onTaskCreated?: (task: unknown) => void
}

export function TaskHeader({ taskId, milestoneId, projectId, onClose, onTaskCreated }: TaskHeaderProps) {
  const params = useParams()
  const workspaceSlug = params.slug as string
  
  const { data: taskData } = useTask(workspaceSlug, taskId)
  const updateTask = useUpdateTask(workspaceSlug, taskId || '')
  const createTask = useCreateTask(workspaceSlug)
  
  const [taskType, setTaskType] = useState('task')
  const [title, setTitle] = useState('')
  const [isEditing, setIsEditing] = useState(!taskId) // Start in edit mode for new tasks
  const [isNewTask, setIsNewTask] = useState(!taskId)
  
  // Update local state when task data loads
  useEffect(() => {
    if (taskData?.task) {
      setTitle(taskData.task.title)
      setTaskType(taskData.task.type || 'task')
      setIsNewTask(false)
    }
  }, [taskData])

  // Auto-save for title and task type
  const taskFormData = { title, type: taskType }
  
  const { isSaving, lastSaved, hasUnsavedChanges } = useAutoSave(taskFormData, {
    delay: 1000,
    enabled: !isNewTask && (title.trim() !== '' || taskType !== 'task'),
    onSave: async (data) => {
      if (isNewTask) {
        // Create new task
        if (!projectId) throw new Error('Project ID is required for new tasks')
        const newTask = await createTask.mutateAsync({
          title: data.title.trim(),
          type: data.type,
          projectId,
          milestoneId: milestoneId || null,
          status: 'todo',
          priority: 'medium'
        })
        setIsNewTask(false)
        onTaskCreated?.(newTask)
      } else {
        // Update existing task
        await updateTask.mutateAsync({
          title: data.title.trim(),
          type: data.type
        })
      }
    }
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      if (taskId) {
        setIsEditing(false)
        setTitle(taskData?.task?.title || '')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Task Type Dropdown */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <Select value={taskType} onValueChange={setTaskType} disabled={!isEditing}>
              <SelectTrigger className="w-20 h-8 border-none shadow-none p-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-mono text-muted-foreground">
              {taskData?.task?.number ? `#${taskData.task.number}` : 'New'}
            </span>
          </div>
          
          {/* Ask AI Button */}
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <AutoSaveIndicator 
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Title */}
      {isEditing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter task title"
          className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0 bg-transparent"
          autoFocus
        />
      ) : (
        <h1 
          className="text-2xl font-bold cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {title || 'Untitled Task'}
        </h1>
      )}

      {/* AI Description Section */}
      <div className="mt-4 p-4 bg-muted/50 rounded-md border border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Ask Brain to write a description, create a summary or find similar tasks
          </p>
        </div>
      </div>
    </div>
  )
}
