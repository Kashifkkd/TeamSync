"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Plus,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { Task, useTasks } from "@/hooks/use-tasks"
import { TaskEditorDialog as TaskDialog } from "./task-editor-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"

interface CalendarViewProps {
  workspaceId: string
  projectId?: string
  milestoneId?: string
}

type ViewMode = "month" | "week" | "day"

const priorityColors = {
  low: "border-gray-400 bg-gray-100",
  medium: "border-blue-400 bg-blue-100",
  high: "border-orange-400 bg-orange-100",
  critical: "border-red-400 bg-red-100",
}

export function CalendarView({ workspaceId, projectId, milestoneId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data, isLoading } = useTasks({ workspaceId, projectId, milestoneId })
  const tasks = data?.tasks || []

  // Filter tasks by date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = parseISO(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  // Get tasks for a date range
  const getTasksInRange = (start: Date, end: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = parseISO(task.dueDate)
      return taskDate >= start && taskDate <= end
    })
  }

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, -1))
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, -1))
    } else {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setSelectedDate(null)
    setIsTaskDialogOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedTask(null)
    setIsTaskDialogOpen(true)
  }

  // Get header title based on view mode
  const getHeaderTitle = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy")
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy")
    }
  }

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d")
        const cloneDay = day
        const dayTasks = getTasksForDate(day)
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isTodayDate = isToday(day)

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[120px] border-r border-b p-2 flex flex-col",
              !isCurrentMonth && "bg-muted/30",
              isTodayDate && "bg-blue-50 dark:bg-blue-950/20"
            )}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  !isCurrentMonth && "text-muted-foreground",
                  isTodayDate && "text-blue-600 font-bold"
                )}
              >
                {formattedDate}
              </span>
              {dayTasks.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  {dayTasks.length}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {dayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "text-xs p-1 rounded border-l-2 cursor-pointer hover:bg-accent",
                    priorityColors[task.priority as keyof typeof priorityColors]
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTaskClick(task)
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium truncate">{task.title}</span>
                  </div>
                  {task.assignee && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Avatar className="h-3 w-3">
                        <AvatarImage src={task.assignee.image || ""} />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(task.assignee.name || task.assignee.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {task.assignee.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-xs text-muted-foreground pl-1">
                  +{dayTasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={rows.length} className="grid grid-cols-7">
          {days}
        </div>
      )
      days = []
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-muted">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        {rows}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const dayTasks = getTasksForDate(day)
      const isTodayDate = isToday(day)

      days.push(
        <div key={i} className="flex-1 min-w-0 border-r last:border-r-0">
          <div
            className={cn(
              "p-2 border-b text-center",
              isTodayDate && "bg-blue-50 dark:bg-blue-950/20"
            )}
          >
            <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
            <div
              className={cn(
                "text-lg font-semibold",
                isTodayDate && "text-blue-600"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
          <div className="p-2 space-y-2 min-h-[400px]" onClick={() => handleDateClick(day)}>
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-2 rounded border-l-2 cursor-pointer hover:bg-accent",
                  priorityColors[task.priority as keyof typeof priorityColors]
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleTaskClick(task)
                }}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs font-medium">{task.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {task.project.key}-{task.number}
                  </Badge>
                  {task.assignee && (
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={task.assignee.image || ""} />
                        <AvatarFallback className="text-[8px]">
                          {getInitials(task.assignee.name || task.assignee.email || "")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="flex">{days}</div>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate)
    const isTodayDate = isToday(currentDate)

    return (
      <div className="border rounded-lg overflow-hidden">
        <div
          className={cn(
            "p-4 border-b",
            isTodayDate && "bg-blue-50 dark:bg-blue-950/20"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">{format(currentDate, "EEEE")}</div>
              <div className="text-2xl font-bold">{format(currentDate, "MMMM d, yyyy")}</div>
            </div>
            <Badge variant="secondary">{dayTasks.length} tasks</Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {dayTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>No tasks due on this date</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleDateClick(currentDate)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          ) : (
            dayTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 cursor-pointer hover:bg-accent",
                  priorityColors[task.priority as keyof typeof priorityColors]
                )}
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {task.project.key}-{task.number}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          task.status === "done" && "bg-green-100 text-green-800"
                        )}
                      >
                        {task.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      {task.assignee && (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.image || ""} />
                            <AvatarFallback className="text-xs">
                              {getInitials(task.assignee.name || task.assignee.email || "")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{task.assignee.name}</span>
                        </div>
                      )}
                      {task.storyPoints && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <span className="font-medium">{task.storyPoints}</span>
                          <span>points</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-4">
                      {task.labels.map(({ label }) => (
                        <Badge
                          key={label.id}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: `${label.color}20`,
                            color: label.color,
                            borderColor: `${label.color}40`,
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => handleDateClick(currentDate)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Calendar views */}
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}

      <TaskDialog
        open={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        taskId={selectedTask?.id}
        workspaceId={workspaceId}
        projectId={projectId}
        milestoneId={milestoneId}
      />
    </div>
  )
}

