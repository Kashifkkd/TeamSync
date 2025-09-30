"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  User,
  Flag,
  CheckSquare,
  MessageSquare,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Save,
  Trash2,
  Play,
  Tag,
  Link,
  Plus,
  Search,
  Bell,
  Menu,
  Paperclip,
  Send,
  ChevronDown
} from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assigneeId?: string
  assignee?: {
    id: string
    name: string
    initials: string
    avatar?: string | null
  }
  startDate?: string
  dueDate?: string
  timeEstimate?: number
  tags: string[]
  progress: number
  milestoneId?: string
  projectId?: string
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId?: string
  milestoneId?: string
  projectId?: string
  onTaskSave?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  fullscreen?: boolean
}

const statusOptions = [
  { value: "todo", label: "TO DO", color: "bg-gray-500" },
  { value: "inProgress", label: "IN PROGRESS", color: "bg-blue-500" },
  { value: "complete", label: "COMPLETE", color: "bg-green-500" }
]

const priorityOptions = [
  { value: "low", label: "Low", color: "text-green-600" },
  { value: "normal", label: "Normal", color: "text-blue-600" },
  { value: "high", label: "High", color: "text-orange-600" },
  { value: "urgent", label: "Urgent", color: "text-red-600" }
]


export function TaskDialogModern({
  open,
  onOpenChange,
  taskId,
  milestoneId,
  projectId,
  onTaskSave,
  onTaskDelete,
  fullscreen = false
}: TaskDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(fullscreen)
  const [saving, setSaving] = useState(false)
  const [task, setTask] = useState<Task>({
    id: taskId || "",
    title: "",
    description: "",
    status: "todo",
    priority: "normal",
    assigneeId: "",
    assignee: undefined,
    startDate: "",
    dueDate: "",
    timeEstimate: 0,
    tags: [],
    progress: 0,
    milestoneId,
    projectId
  })

  const fetchTask = useCallback(async () => {
    if (!taskId) return
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      const data = await response.json()
      setTask(data.task)
    } catch (error) {
      console.error('Error fetching task:', error)
    }
  }, [taskId])

  useEffect(() => {
    if (taskId) {
      fetchTask()
    }
  }, [taskId, fetchTask])

  const handleSave = async () => {
    if (!task.title.trim()) return
    
    try {
      setSaving(true)
      
      if (taskId) {
        // Update existing task
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        })
        
        if (!response.ok) {
          throw new Error('Failed to update task')
        }
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        })
        
        if (!response.ok) {
          throw new Error('Failed to create task')
        }
      }
      
      onTaskSave?.(task)
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!taskId) return
    
    try {
      setSaving(true)
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      
      onTaskDelete?.(taskId)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setSaving(false)
    }
  }

  const dialogProps = isFullscreen ? {
    className: "max-w-none w-screen h-screen m-0 rounded-none",
    style: { maxHeight: '100vh' }
  } : {
    className: "max-w-[1200px] max-h-[90vh]"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent {...dialogProps} className="p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Pane - Task Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckSquare className="h-3 w-3 text-white" />
                  </div>
                  <Select defaultValue="task">
                    <SelectTrigger className="w-24 h-8 border-none shadow-none p-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground font-mono">86cy7290b</span>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Task Title */}
            <div className="mb-6">
              <Input
                value={task.title}
                onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
              />
            </div>

            {/* AI Description Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Ask Brain to write a description, create a summary or find similar tasks</span>
              </div>
            </div>

            {/* Task Attributes - Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Play className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Status</span>
                    <Select
                      value={task.status}
                      onValueChange={(value) => setTask(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Start → Due</span>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="date"
                        value={task.startDate || ""}
                        onChange={(e) => setTask(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-32 h-8 text-xs"
                      />
                      <span className="text-gray-400">→</span>
                      <Input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => setTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-32 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Time Estimate</span>
                    <Input
                      placeholder="Empty"
                      className="w-32 h-8 text-xs text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Tags</span>
                    <Input
                      placeholder="Empty"
                      value={task.tags.join(", ")}
                      onChange={(e) => setTask(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(",").map(t => t.trim()).filter(t => t)
                      }))}
                      className="w-32 h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Assignees</span>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee?.avatar || undefined} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          {task.assignee?.initials || "K"}
                        </AvatarFallback>
                      </Avatar>
                      <X className="h-3 w-3 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Flag className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Priority</span>
                    <Select
                      value={task.priority}
                      onValueChange={(value) => setTask(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Empty" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Play className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Track Time</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Add time
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link className="h-4 w-4 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Relationships</span>
                    <span className="text-xs text-gray-400">Empty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description and AI Options */}
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" size="sm" className="text-blue-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add description
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Write with AI
              </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6 mb-6 border-b">
              <Button variant="ghost" className="px-0 pb-2 border-b-2 border-blue-600 text-blue-600 rounded-none">
                Details
              </Button>
              <Button variant="ghost" className="px-0 pb-2 text-gray-600 rounded-none">
                Subtasks
              </Button>
              <Button variant="ghost" className="px-0 pb-2 text-gray-600 rounded-none">
                Action Items
              </Button>
            </div>

            {/* Custom Fields Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Custom Fields</h3>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create a field on this location
                </Button>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Attachments</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No attachments yet</p>
              </div>
            </div>
          </div>

          {/* Right Pane - Activity Feed */}
          <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
            {/* Activity Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Activity</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Activity Content */}
            <div className="space-y-4">
              <div className="text-sm text-blue-600 cursor-pointer">
                <ChevronDown className="h-4 w-4 inline mr-1" />
                Show more
              </div>
              
              <div className="text-sm">
                <p>You added follower: You</p>
                <p className="text-xs text-gray-500 mt-1">Mar 8 at 12:05 am</p>
              </div>
            </div>

            {/* Comment Input */}
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Write a comment..."
                  className="flex-1 h-8 text-sm"
                />
                <Button size="sm" className="h-8 w-8 p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex items-center justify-between p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="px-0 text-muted-foreground">
              <CheckSquare className="h-4 w-4 mr-2" />
              Subtasks
            </Button>
            <Button variant="ghost" className="px-0 text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Action Items
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {taskId && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : taskId ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
