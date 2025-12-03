"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Task, useTasks } from "@/hooks/use-tasks"
import { Skeleton } from "@/components/ui/skeleton"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths } from "date-fns"

interface GanttViewProps {
  workspaceId: string
  projectId?: string
  milestoneId?: string
}

type ViewScale = "day" | "week" | "month"

export function GanttView({ workspaceId, projectId, milestoneId }: GanttViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewScale, setViewScale] = useState<ViewScale>("week")

  const { data, isLoading } = useTasks({ workspaceId, projectId, milestoneId })
  const tasks = data?.tasks || []

  // Filter tasks that have dates
  const tasksWithDates = useMemo(() => {
    return tasks.filter((task) => task.startDate || task.dueDate)
  }, [tasks])

  // Calculate view range
  const viewRange = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  // Calculate task bar position and width
  const getTaskBar = (task: Task) => {
    const start = task.startDate ? new Date(task.startDate) : task.dueDate ? new Date(task.dueDate) : null
    const end = task.dueDate ? new Date(task.dueDate) : task.startDate ? new Date(task.startDate) : null

    if (!start || !end) return null

    const viewStart = viewRange[0]
    const viewEnd = viewRange[viewRange.length - 1]
    const totalDays = viewRange.length

    const startDay = Math.max(0, Math.floor((start.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24)))
    const endDay = Math.min(
      totalDays,
      Math.ceil((end.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24))
    )

    const leftPercent = (startDay / totalDays) * 100
    const widthPercent = ((endDay - startDay) / totalDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%`,
      startDay,
      endDay
    }
  }

  const priorityColors = {
    low: "bg-gray-400",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    critical: "bg-red-500"
  }

  const statusColors = {
    todo: "bg-gray-500",
    in_progress: "bg-blue-500",
    in_review: "bg-yellow-500",
    done: "bg-green-500",
    blocked: "bg-red-500"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2 ml-4">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={viewScale}
            onValueChange={(value: ViewScale) => setViewScale(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Timeline View - {tasksWithDates.length} tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {tasksWithDates.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                <p>No tasks with dates found</p>
                <p className="text-sm">Add start or due dates to tasks to see them in timeline view</p>
              </div>
            ) : (
              <div className="min-w-[1000px]">
                {/* Timeline Header */}
                <div className="flex border-b bg-muted/50">
                  <div className="w-64 p-4 border-r font-medium">Task</div>
                  <div className="flex-1 flex">
                    {viewRange.map((day, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 p-2 text-center text-xs border-r",
                          isSameDay(day, new Date()) && "bg-primary/10"
                        )}
                      >
                        <div className="font-medium">{format(day, "d")}</div>
                        <div className="text-muted-foreground">{format(day, "EEE")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Rows */}
                <div className="divide-y">
                  {tasksWithDates.map((task) => {
                    const taskBar = getTaskBar(task)

                    return (
                      <div key={task.id} className="flex items-center hover:bg-accent/50">
                        {/* Task Info */}
                        <div className="w-64 p-4 border-r space-y-1">
                          <div className="font-medium text-sm truncate">{task.title}</div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {task.project.key}-{task.number}
                            </span>
                          </div>
                        </div>

                        {/* Timeline Bar */}
                        <div className="flex-1 relative h-16 px-2">
                          {taskBar && (
                            <div
                              className={cn(
                                "absolute top-1/2 -translate-y-1/2 h-6 rounded flex items-center justify-center",
                                statusColors[task.status as keyof typeof statusColors]
                              )}
                              style={{
                                left: taskBar.left,
                                width: taskBar.width,
                              }}
                            >
                              <span className="text-xs text-white font-medium px-2 truncate">
                                {task.status === "done" ? "✓" : ""} {task.title}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gray-500" />
          <span>To Do</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span>In Review</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Done</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span>Blocked</span>
        </div>
      </div>
    </div>
  )
}

