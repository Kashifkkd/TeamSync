"use client"

import { useState } from "react"
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Play,
  Edit3,
  Trash2,
  Copy,
  Move,
  Tag,
  Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const priorityConfig = {
  high: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  low: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 }
}

const statusConfig = {
  todo: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Circle, label: "To Do" },
  in_progress: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Play, label: "In Progress" },
  completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2, label: "Completed" },
  blocked: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Blocked" }
}

const columns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-100" },
  { id: "completed", title: "Completed", color: "bg-green-100" },
  { id: "blocked", title: "Blocked", color: "bg-red-100" }
]

interface Task {
  id: string
  name: string
  assignee: { name: string; initials: string; avatar: string | null }
  dueDate: string
  priority: keyof typeof priorityConfig
  status: keyof typeof statusConfig
  progress: number
  comments: number
  attachments: number
  subtasks: Array<{ id: string; name: string; completed: boolean }>
  tags: string[]
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove?: (taskId: string, newStatus: string) => void
  onTaskEdit?: (taskId: string, updates: Partial<Task>) => void
}

export function KanbanBoard({ tasks, onTaskMove, onTaskEdit }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask, newStatus)
    }
    setDraggedTask(null)
  }

  const getPriorityIcon = (priority: keyof typeof priorityConfig) => {
    const Icon = priorityConfig[priority].icon
    return <Icon className="h-3 w-3" />
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card 
      className="group hover:shadow-md transition-all duration-200 cursor-move mb-3"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">
            {task.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Move className="mr-2 h-4 w-4" />
                Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {task.tags.filter(tag => tag && tag.trim().length > 0).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.filter(tag => tag && tag.trim().length > 0).slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {task.tags.filter(tag => tag && tag.trim().length > 0).length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.filter(tag => tag && tag.trim().length > 0).length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Task Details */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
            </Avatar>
            <span>{task.assignee.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={cn("text-xs", priorityConfig[task.priority].color)}>
            {getPriorityIcon(task.priority)}
            <span className="ml-1 capitalize">{task.priority}</span>
          </Badge>
        </div>

        {/* Progress Bar */}
        {task.progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
            </div>
            <div className="space-y-1">
              {task.subtasks.slice(0, 2).map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2 text-xs">
                  <div className={cn(
                    "w-3 h-3 rounded border flex items-center justify-center",
                    subtask.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                  )}>
                    {subtask.completed && <CheckCircle2 className="h-2 w-2 text-white" />}
                  </div>
                  <span className={cn(
                    "truncate",
                    subtask.completed ? "line-through text-gray-500" : "text-gray-700"
                  )}>
                    {subtask.name}
                  </span>
                </div>
              ))}
              {task.subtasks.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{task.subtasks.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {task.comments > 0 && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        
        return (
          <div 
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded-full", column.color)} />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 min-h-[400px]">
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-sm">No tasks in this column</div>
                      <Button size="sm" variant="ghost" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Add task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
