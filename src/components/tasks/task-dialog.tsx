"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  ChevronDown,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"

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

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800 border-gray-200" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "urgent", label: "Urgent", color: "bg-purple-100 text-purple-800 border-purple-200" }
]

const statusOptions = [
  { value: "todo", label: "TO DO", color: "bg-gray-500" },
  { value: "inProgress", label: "IN PROGRESS", color: "bg-blue-500" },
  { value: "review", label: "IN REVIEW", color: "bg-yellow-500" },
  { value: "complete", label: "COMPLETE", color: "bg-green-500" }
]

const mockAssignees = [
  { id: "1", name: "Kashif", initials: "K", avatar: null },
  { id: "2", name: "Nikhil", initials: "NC", avatar: null },
  { id: "3", name: "Faisal", initials: "FJ", avatar: null },
  { id: "4", name: "Sarah", initials: "S", avatar: null }
]

export function TaskDialog({
  open,
  onOpenChange,
  taskId,
  milestoneId,
  projectId,
  onTaskSave,
  onTaskDelete,
  fullscreen = false
}: TaskDialogProps) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(fullscreen)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [task, setTask] = useState<Task>({
    id: taskId || "",
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
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

  const fetchTask = async () => {
    if (!taskId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      const data = await response.json()
      setTask(data.task)
    } catch (error) {
      console.error('Error fetching task:', error)
      // Handle error - maybe show toast
    } finally {
      setLoading(false)
    }
  }

  // Fetch task data if editing
  useEffect(() => {
    if (taskId && open) {
      fetchTask()
    } else if (!taskId && open) {
      // Reset for new task
      setTask({
        id: "",
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
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
    }
  }, [taskId, open, milestoneId, projectId])

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const url = taskId ? `/api/tasks/${taskId}` : '/api/tasks'
      const method = taskId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error('Failed to save task')
      }

      const data = await response.json()
      onTaskSave?.(data.task)
      onOpenChange(false)
      
      // Navigate to task if creating new
      if (!taskId && data.task.id) {
        router.push(`/tasks/${data.task.id}`)
      }
    } catch (error) {
      console.error('Error saving task:', error)
      // Handle error - maybe show toast
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!taskId) return
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      onTaskDelete?.(taskId)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting task:', error)
      // Handle error - maybe show toast
    }
  }

  const handleAssigneeChange = (assigneeId: string) => {
    const assignee = mockAssignees.find(a => a.id === assigneeId)
    setTask(prev => ({
      ...prev,
      assigneeId,
      assignee: assignee ? {
        id: assignee.id,
        name: assignee.name,
        initials: assignee.initials,
        avatar: assignee.avatar
      } : undefined
    }))
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !task.tags.includes(tag.trim())) {
      setTask(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const DialogContentComponent = isFullscreen ? 'div' : DialogContent
  const dialogProps = isFullscreen ? {
    className: "fixed inset-0 z-50 bg-background overflow-auto"
  } : {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentComponent {...dialogProps}>
        {isFullscreen && (
          <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">
                {taskId ? "Edit Task" : "Create Task"}
              </h1>
              <Badge variant="outline" className="text-xs">
                {taskId ? `Task ${taskId.slice(-8)}` : "New Task"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="h-4 w-4" />
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
        )}

        <div className={cn(
          "flex-1 overflow-auto",
          isFullscreen ? "p-6" : ""
        )}>
          <div className="max-w-4xl mx-auto">
            {/* Task Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold">Task</h2>
                  {taskId && (
                    <>
                      <span className="text-muted-foreground">/</span>
                      <Badge variant="outline" className="text-xs">
                        {taskId.slice(-8)}
                      </Badge>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ask AI
                  </Button>
                  {!isFullscreen && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Task Title */}
              <Input
                placeholder="Task title"
                value={task.title}
                onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
              />

              {/* AI Prompt */}
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Ask Brain to write a description, create a summary or find similar tasks
                </p>
              </div>
            </div>

            {/* Task Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={task.status}
                  onValueChange={(value) => setTask(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        statusOptions.find(s => s.value === task.status)?.color || "bg-gray-500"
                      )} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-2 h-2 rounded-full", status.color)} />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Assignees</Label>
                <Select
                  value={task.assigneeId || ""}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger>
                    <div className="flex items-center space-x-2">
                      {task.assignee ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <SelectValue placeholder="Select assignee" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssignees.map((assignee) => (
                      <SelectItem key={assignee.id} value={assignee.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                              {assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{assignee.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={task.startDate}
                    onChange={(e) => setTask(prev => ({ ...prev, startDate: e.target.value }))}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Due</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => setTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => setTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4" />
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Estimate */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Time Estimate</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Hours"
                    value={task.timeEstimate || ""}
                    onChange={(e) => setTask(prev => ({ ...prev, timeEstimate: parseInt(e.target.value) || 0 }))}
                    className="pl-10"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Progress</Label>
                <div className="space-y-2">
                  <Progress value={task.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{task.progress}% Complete</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={(e) => setTask(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                      className="w-16 h-8 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Add description</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Write with AI</span>
                </Button>
              </div>
              <Textarea
                placeholder="Add a description..."
                value={task.description}
                onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            {/* Bottom Tabs */}
            <div className="border-t border-border pt-4">
              <div className="flex space-x-6">
                <Button variant="ghost" className="px-0 font-medium">
                  Details
                </Button>
                <Button variant="ghost" className="px-0 text-muted-foreground">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Subtasks
                </Button>
                <Button variant="ghost" className="px-0 text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Action Items
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "border-t border-border p-4",
          isFullscreen ? "sticky bottom-0 bg-background" : ""
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {taskId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !task.title.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : taskId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContentComponent>
    </Dialog>
  )
}
