"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  MessageCircle, 
  Clock, 
  AlertCircle,
  Flag,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { Task } from "./kanban-board"
import { cn, getInitials, formatRelativeTime, getPriorityIcon } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  isDragging?: boolean
}

const priorityColors = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200", 
  high: "text-orange-600 bg-orange-50 border-orange-200",
  critical: "text-red-600 bg-red-50 border-red-200",
}

const priorityIcons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: AlertCircle,
}

const typeIcons = {
  task: "📋",
  bug: "🐛",
  feature: "✨",
  epic: "🎯",
  story: "📖",
}

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const PriorityIcon = priorityIcons[task.priority as keyof typeof priorityIcons]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 group",
        isDragging || isSortableDragging ? "shadow-lg scale-105 rotate-2" : "",
        isOverdue ? "border-red-200 bg-red-50" : ""
      )}
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-lg">{typeIcons[task.type as keyof typeof typeIcons]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {task.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {task.project.key}-{task.number}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <PriorityIcon 
              className={cn("h-3 w-3", priorityColors[task.priority as keyof typeof priorityColors])}
            />
            {task.storyPoints && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {task.storyPoints}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map(({ label }) => (
              <Badge
                key={label.id}
                variant="secondary"
                className="text-xs px-2 py-0"
                style={{ 
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  borderColor: `${label.color}40`
                }}
              >
                {label.name}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {task._count.comments > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{task._count.comments}</span>
              </div>
            )}
            
            {task._count.timeEntries > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{task._count.timeEntries}</span>
              </div>
            )}

            {task.dueDate && (
              <div className={cn(
                "flex items-center space-x-1",
                isOverdue ? "text-red-600" : ""
              )}>
                <Calendar className="h-3 w-3" />
                <span>{formatRelativeTime(task.dueDate)}</span>
                {isOverdue && <AlertCircle className="h-3 w-3 text-red-600" />}
              </div>
            )}
          </div>

          {/* Assignee */}
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.image || ""} />
              <AvatarFallback className="text-xs">
                {getInitials(task.assignee.name || task.assignee.email || "")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
