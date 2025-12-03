"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Check, 
  Calendar,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSubtasks, useCreateSubtask, useDeleteSubtask, useToggleSubtaskCompletion } from '@/hooks/use-subtasks'
import { Task } from '@/hooks/use-tasks'
import { format } from 'date-fns'

interface SubtaskSectionProps {
  workspaceId: string
  parentTaskId: string
  onSubtaskClick?: (subtask: Task) => void
  onSubtaskEdit?: (subtask: Task) => void
  className?: string
}

interface SubtaskItemProps {
  subtask: Task
  onToggle: (completed: boolean) => void
  onEdit: () => void
  onDelete: () => void
  onClick: () => void
  isUpdating: boolean
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-gray-100 text-gray-800 border-gray-200"
}

const priorityIcons = {
  high: "🔴",
  medium: "🟡", 
  low: "⚪"
}

function SubtaskItem({ subtask, onToggle, onEdit, onDelete, onClick, isUpdating }: SubtaskItemProps) {
  const isCompleted = subtask.status === 'completed'
  
  return (
    <div 
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all cursor-pointer",
        isCompleted && "opacity-60"
      )}
      onClick={onClick}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(checked) => onToggle(checked as boolean)}
        className="shrink-0"
        disabled={isUpdating}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={cn(
            "text-sm font-medium text-foreground truncate",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {subtask.title}
          </h4>
          {subtask.priority && subtask.priority !== 'medium' && (
            <span className="text-xs">
              {priorityIcons[subtask.priority as keyof typeof priorityIcons]}
            </span>
          )}
        </div>
        
        {subtask.description && (
          <p className="text-xs text-muted-foreground truncate">
            {subtask.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          {subtask.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={subtask.assignee.image || undefined} />
                <AvatarFallback className="text-xs">
                  {subtask.assignee.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {subtask.assignee.name}
              </span>
            </div>
          )}
          
          {subtask.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(subtask.dueDate), 'MMM d')}</span>
            </div>
          )}
          
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-2 py-0.5",
              priorityColors[subtask.priority as keyof typeof priorityColors]
            )}
          >
            {subtask.priority}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

export function SubtaskSection({ 
  workspaceId, 
  parentTaskId, 
  onSubtaskClick, 
  onSubtaskEdit,
  className 
}: SubtaskSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  
  const { data: subtasksData, isLoading } = useSubtasks({ workspaceId, parentTaskId })
  const createSubtask = useCreateSubtask(workspaceId, parentTaskId)
  const deleteSubtask = useDeleteSubtask(workspaceId, parentTaskId)
  const toggleCompletion = useToggleSubtaskCompletion(workspaceId, parentTaskId)
  
  const subtasks = subtasksData?.subtasks || []
  const completedCount = subtasks.filter(s => s.status === 'completed').length
  const totalCount = subtasks.length
  
  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return
    
    try {
      await createSubtask.mutateAsync({
        title: newSubtaskTitle.trim(),
        priority: 'medium'
      })
      setNewSubtaskTitle('')
      setIsAdding(false)
    } catch (error) {
      console.error('Failed to create subtask:', error)
    }
  }
  
  const handleToggleCompletion = async (subtaskId: string, completed: boolean) => {
    try {
      await toggleCompletion.mutateAsync({ subtaskId, completed })
    } catch (error) {
      console.error('Failed to toggle subtask completion:', error)
    }
  }
  
  const handleEditSubtask = (subtask: Task) => {
    onSubtaskEdit?.(subtask)
  }
  
  const handleDeleteSubtask = async (subtaskId: string) => {
    if (confirm('Are you sure you want to delete this subtask?')) {
      try {
        await deleteSubtask.mutateAsync(subtaskId)
      } catch (error) {
        console.error('Failed to delete subtask:', error)
      }
    }
  }
  
  const handleSubtaskClick = (subtask: Task) => {
    onSubtaskClick?.(subtask)
  }
  
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Subtasks</h3>
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Subtasks</h3>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          )}
        </div>
        
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add subtask
          </Button>
        )}
      </div>
      
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Subtasks List */}
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            onToggle={(completed) => handleToggleCompletion(subtask.id, completed)}
            onEdit={() => handleEditSubtask(subtask)}
            onDelete={() => handleDeleteSubtask(subtask.id)}
            onClick={() => handleSubtaskClick(subtask)}
            isUpdating={toggleCompletion.isPending}
          />
        ))}
        
        {/* Add Subtask Input */}
        {isAdding && (
          <div className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg">
            <Checkbox disabled className="shrink-0" />
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSubtask()
                } else if (e.key === 'Escape') {
                  setIsAdding(false)
                  setNewSubtaskTitle('')
                }
              }}
              autoFocus
            />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim() || createSubtask.isPending}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false)
                  setNewSubtaskTitle('')
                }}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {subtasks.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">No subtasks yet</div>
            <div className="text-xs mt-1">Add subtasks to break down this task</div>
          </div>
        )}
      </div>
    </div>
  )
}
