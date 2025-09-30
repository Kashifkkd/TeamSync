"use client"

import { useState, useEffect } from "react"
import { useViewParams } from "@/hooks/use-view-params"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CreateStatusDialog } from "@/components/task-statuses/create-status-dialog"
import { TaskDialogMUI as TaskDialog } from "@/components/tasks/task-dialog-mui"
import {
    Plus,
    Calendar,
    Target,
    Users,
    CheckSquare,
    Clock,
    MoreHorizontal,
    Play,
    BarChart3,
    List,
    Calendar as CalendarIcon,
    Table,
    GanttChart
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for specific milestone
const mockMilestone = {
    id: "sprint-1",
    name: "Sprint 1 - Foundation",
    description: "Core authentication and user management features",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    progress: 85,
    tasks: { total: 12, completed: 10, inProgress: 2 },
    assignees: [
        { name: "Kashif", initials: "K", avatar: null },
        { name: "Nikhil", initials: "NC", avatar: null },
        { name: "Faisal", initials: "FJ", avatar: null }
    ],
    priority: "high"
}

// Mock tasks for this milestone
const mockTasks = {
    todo: [
        {
            id: "1",
            title: "Coupon by coupon id api",
            description: "Create API endpoint to fetch coupon by ID",
            status: "todo",
            priority: "high",
            assignee: { 
                id: "1",
                name: "Kashif", 
                initials: "K", 
                avatar: null as string | null
            },
            dueDate: "Feb 20",
            tags: ["API", "Backend"],
            progress: 0,
            comments: 3,
            attachments: 1,
            subtasks: 2
        },
        {
            id: "2",
            title: "All Screens Completed React Native",
            description: "Complete all mobile app screens",
            status: "todo",
            priority: "medium",
            assignee: { 
                id: "2",
                name: "Nikhil", 
                initials: "NC", 
                avatar: null as string | null
            },
            dueDate: "Feb 22",
            tags: ["Frontend", "Mobile"],
            progress: 0,
            comments: 1,
            attachments: 0,
            subtasks: 0
        }
    ],
    inProgress: [
        {
            id: "3",
            title: "Database Schema Design",
            description: "Design database schema for the application",
            status: "inProgress",
            priority: "high",
            assignee: { 
                id: "3",
                name: "Faisal", 
                initials: "FJ", 
                avatar: null as string | null
            },
            dueDate: "Feb 18",
            tags: ["Database", "Backend"],
            progress: 60,
            comments: 2,
            attachments: 1,
            subtasks: 1
        }
    ],
    complete: [
        {
            id: "4",
            title: "FE-1-login module",
            description: "Frontend login module implementation",
            status: "complete",
            priority: "normal",
            assignee: { 
                id: "1",
                name: "Kashif", 
                initials: "K", 
                avatar: null as string | null
            },
            dueDate: "Feb 14 - Feb 16",
            tags: ["Frontend", "Auth"],
            progress: 100,
            comments: 5,
            attachments: 2,
            subtasks: 3
        },
        {
            id: "5",
            title: "FE integration web app",
            description: "Frontend integration for web application",
            status: "complete",
            priority: "high",
            assignee: { 
                id: "1",
                name: "Kashif", 
                initials: "K", 
                avatar: null as string | null
            },
            dueDate: "Feb 15",
            tags: ["Frontend", "Integration"],
            progress: 100,
            comments: 2,
            attachments: 1,
            subtasks: 1
        },
        {
            id: "6",
            title: "Be-(Services-post and get",
            description: "Backend services for POST and GET operations",
            status: "complete",
            priority: "medium",
            assignee: { 
                id: "1",
                name: "Kashif", 
                initials: "K", 
                avatar: null as string | null
            },
            dueDate: "Feb 16",
            tags: ["Backend", "API"],
            progress: 100,
            comments: 4,
            attachments: 0,
            subtasks: 0
        },
        {
            id: "7",
            title: "Be-1-login-mod",
            description: "Backend login module implementation",
            status: "complete",
            priority: "normal",
            assignee: { 
                id: "3",
                name: "Faisal", 
                initials: "FJ", 
                avatar: null as string | null
            },
            dueDate: "Feb 16",
            tags: ["Backend", "Auth"],
            progress: 100,
            comments: 1,
            attachments: 0,
            subtasks: 0
        },
        {
            id: "8",
            title: "House cleaning",
            description: "Personal house cleaning task",
            status: "complete",
            priority: "low",
            assignee: { 
                id: "1",
                name: "Kashif", 
                initials: "K", 
                avatar: null as string | null
            },
            dueDate: "Feb 17",
            tags: ["Personal"],
            progress: 100,
            comments: 0,
            attachments: 0,
            subtasks: 0
        }
    ]
}

const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    normal: "bg-blue-100 text-blue-800 border-blue-200",
    low: "bg-gray-100 text-gray-800 border-gray-200"
}

const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    upcoming: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
    paused: "bg-yellow-100 text-yellow-800 border-yellow-200"
}

interface Task {
    id: string
    title: string
    description: string
    status: string
    priority: string
    assigneeId?: string
    assignee: {
        id: string
        name: string
        initials: string
        avatar: string | null
    }
    startDate?: string
    dueDate: string
    timeEstimate?: number
    tags: string[]
    progress: number
    milestoneId?: string
    projectId?: string
    comments: number
    attachments: number
    subtasks: number
}


// TaskDialog Task interface (simplified)
interface TaskDialogTask {
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
    tags?: string[]
    progress?: number
    milestoneId?: string
    projectId?: string
    comments?: number
    attachments?: number
    subtasks?: number
}

// Helper function to convert TaskDialog Task to local Task
const convertFromTaskDialogTask = (task: TaskDialogTask): Task => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    assignee: task.assignee ? {
        id: task.assignee.id,
        name: task.assignee.name,
        initials: task.assignee.initials,
        avatar: task.assignee.avatar ?? null
    } : { id: "", name: "", initials: "", avatar: null },
    startDate: task.startDate,
    dueDate: task.dueDate || "",
    timeEstimate: task.timeEstimate,
    tags: task.tags || [],
    progress: task.progress || 0,
    milestoneId: task.milestoneId,
    projectId: task.projectId,
    comments: task.comments || 0,
    attachments: task.attachments || 0,
    subtasks: task.subtasks || 0
})

export default function MilestoneDetailPage() {
    const { activeView, updateView, isViewActive } = useViewParams({
        defaultView: "all",
        validViews: ["all", "board", "list", "calendar", "table", "gantt"]
    })
    const [draggedTask, setDraggedTask] = useState<string | null>(null)
    const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
    const [taskDialogOpen, setTaskDialogOpen] = useState(false)
    const [editingTaskId, setEditingTaskId] = useState<string | undefined>(undefined)
    const [statuses, setStatuses] = useState([
        {
            id: "todo",
            name: "TO DO",
            color: "bg-gray-500",
            bgColor: "bg-gray-50",
            textColor: "text-gray-800",
            badgeColor: "bg-gray-100"
        },
        {
            id: "inProgress",
            name: "IN PROGRESS",
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
            badgeColor: "bg-blue-100"
        },
        {
            id: "complete",
            name: "COMPLETE",
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-800",
            badgeColor: "bg-green-100"
        }
    ])
    const [tasks, setTasks] = useState(mockTasks)

    // Task dialog handlers
    const openTaskDialog = (taskId?: string) => {
        setEditingTaskId(taskId)
        setTaskDialogOpen(true)
    }

    const closeTaskDialog = () => {
        setTaskDialogOpen(false)
        setEditingTaskId(undefined)
    }

    const handleTaskSave = (savedTask: TaskDialogTask) => {
        const convertedTask = convertFromTaskDialogTask(savedTask)
        if (editingTaskId) {
            // Update existing task
            setTasks(prevTasks => {
                const newTasks = { ...prevTasks }
                Object.keys(newTasks).forEach(status => {
                    const taskIndex = newTasks[status as keyof typeof newTasks].findIndex(
                        task => task.id === editingTaskId
                    )
                    if (taskIndex !== -1) {
                        newTasks[status as keyof typeof newTasks][taskIndex] = convertedTask
                    }
                })
                return newTasks
            })
        } else {
            // Add new task
            const statusId = convertedTask.status || "todo"
            setTasks(prevTasks => ({
                ...prevTasks,
                [statusId]: [...(prevTasks[statusId as keyof typeof prevTasks] || []), convertedTask]
            }))
        }
        closeTaskDialog()
    }

    const handleTaskDelete = (deletedTaskId: string) => {
        setTasks(prevTasks => {
            const newTasks = { ...prevTasks }
            Object.keys(newTasks).forEach(status => {
                newTasks[status as keyof typeof newTasks] = newTasks[status as keyof typeof newTasks].filter(
                    task => task.id !== deletedTaskId
                )
            })
            return newTasks
        })
        closeTaskDialog()
    }

    // Fetch task statuses from API
    const fetchTaskStatuses = async () => {
        try {
            const response = await fetch(`/api/workspaces/your-workspace-slug/task-statuses`)
            if (!response.ok) {
                throw new Error('Failed to fetch task statuses')
            }
            const data = await response.json()
            setStatuses(data.taskStatuses)
        } catch (error) {
            console.error('Error fetching task statuses:', error)
            // Keep default statuses if API fails
        }
    }

    // Create new task status via API
    const createTaskStatus = async (statusData: {
        name: string
        color: string
        bgColor: string
        textColor: string
        badgeColor: string
    }) => {
        try {
            const response = await fetch(`/api/workspaces/your-workspace-slug/task-statuses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(statusData),
            })

            if (!response.ok) {
                throw new Error('Failed to create task status')
            }

            const data = await response.json()
            setStatuses(prev => [...prev, data.taskStatus])
            setTasks(prev => ({ ...prev, [data.taskStatus.id]: [] }))
        } catch (error) {
            console.error('Error creating task status:', error)
            // Fallback to local state
            const newStatus = {
                id: statusData.name.toLowerCase().replace(/\s+/g, ''),
                ...statusData
            }
            setStatuses(prev => [...prev, newStatus])
            setTasks(prev => ({ ...prev, [newStatus.id]: [] }))
        }
    }

    // Initialize task statuses
    useEffect(() => {
        fetchTaskStatuses()
    }, [])

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent, statusId: string) => {
        e.preventDefault()
        setDraggedOverColumn(statusId)
        e.dataTransfer.dropEffect = "move"
    }

    const handleDragLeave = () => {
        setDraggedOverColumn(null)
    }

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault()
        if (!draggedTask) return

        setTasks(prevTasks => {
            const newTasks = { ...prevTasks }

            // Remove task from current status
            Object.keys(newTasks).forEach(status => {
                newTasks[status as keyof typeof newTasks] = newTasks[status as keyof typeof newTasks].filter(
                    task => task.id !== draggedTask
                )
            })

            // Add task to new status
            const taskToMove = Object.values(prevTasks).flat().find(task => task.id === draggedTask)
            if (taskToMove) {
                newTasks[targetStatus as keyof typeof newTasks].push(taskToMove)
            }

            return newTasks
        })

        setDraggedTask(null)
        setDraggedOverColumn(null)
    }


    // Add new task
    const addNewTask = () => {
        // Open task dialog for new task
        openTaskDialog()
    }

    const views = [
        { id: "all", name: "All", icon: Target },
        { id: "board", name: "Board", icon: BarChart3 },
        { id: "list", name: "List", icon: List },
        { id: "calendar", name: "Calendar", icon: CalendarIcon },
        { id: "table", name: "Table", icon: Table },
        { id: "gantt", name: "Gantt", icon: GanttChart }
    ]

    const TaskCard = ({ task }: { task: Task }) => (
        <Card
            className="mb-3 hover:shadow-md transition-shadow cursor-pointer group"
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={() => setDraggedTask(null)}
            onClick={() => openTaskDialog(task.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {task.title}
                    </h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar || undefined} alt={task.assignee.name} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {task.assignee.initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{task.dueDate}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <Badge className={cn("text-xs px-2 py-0.5", priorityColors[task.priority as keyof typeof priorityColors])}>
                        <Target className="h-3 w-3 mr-1" />
                        {task.priority}
                    </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                        {task.subtasks > 0 && (
                            <div className="flex items-center space-x-1">
                                <CheckSquare className="h-3 w-3" />
                                <span>{task.subtasks}</span>
                            </div>
                        )}
                        {task.comments > 0 && (
                            <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{task.comments}</span>
                            </div>
                        )}
                        {task.attachments > 0 && (
                            <div className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>{task.attachments}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>2h</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Milestone Title */}
            <div className="border-b border-border bg-card">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-foreground">{mockMilestone.name}</h1>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">

                                <Badge className={cn("text-sm flex items-center space-x-1", statusColors[mockMilestone.status as keyof typeof statusColors])}>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full scale-110",
                                        mockMilestone.status === "active" ? "bg-green-600" :
                                            mockMilestone.status === "upcoming" ? "bg-blue-600" :
                                                mockMilestone.status === "completed" ? "bg-gray-600" :
                                                    "bg-yellow-600"
                                    )} />
                                    <span>{mockMilestone.status.charAt(0).toUpperCase() + mockMilestone.status.slice(1)}</span>
                                </Badge>
                            </div>
                            <Button 
                                size="sm" 
                                className="bg-primary text-primary-foreground px-2 py-1 text-sm font-medium"
                                onClick={() => addNewTask()}
                            >
                                <Plus className="h-3 w-3 mr-1" strokeWidth={2.5} />
                                Add Task
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Toggle */}
            <div className="border-b border-border bg-muted/30">
                <div className="px-6 py-3">
                    <div className="flex items-center space-x-1">
                        {views.map((view) => {
                            const Icon = view.icon
                            return (
                                <Button
                                    key={view.id}
                                    variant={isViewActive(view.id) ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => updateView(view.id)}
                                    className="flex items-center space-x-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{view.name}</span>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Tasks Content */}
            <div className="flex-1 overflow-hidden">
                {activeView === "all" ? (
                    <div className="h-full overflow-auto p-6">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card className="card-elevated">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {Object.values(tasks).flat().length}
                                            </p>
                                        </div>
                                        <Target className="h-8 w-8 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-elevated">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {tasks.todo?.length || 0}
                                            </p>
                                        </div>
                                        <Clock className="h-8 w-8 text-yellow-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-elevated">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {tasks.inProgress?.length || 0}
                                            </p>
                                        </div>
                                        <Play className="h-8 w-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-elevated">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {tasks.complete?.length || 0}
                                            </p>
                                        </div>
                                        <CheckSquare className="h-8 w-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Task Completion Progress */}
                        <Card className="card-elevated mb-6">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-foreground">Task Completion Progress</h3>
                                    <div className="text-sm text-muted-foreground">
                                        {tasks.complete?.length || 0} of {Object.values(tasks).flat().length} tasks completed
                                    </div>
                                </div>
                                <Progress
                                    value={Object.values(tasks).flat().length > 0 ? Math.round(((tasks.complete?.length || 0) / Object.values(tasks).flat().length) * 100) : 0}
                                    className="h-3 mb-2"
                                />
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>0%</span>
                                    <span className="font-medium text-foreground">
                                        {Object.values(tasks).flat().length > 0 ? Math.round(((tasks.complete?.length || 0) / Object.values(tasks).flat().length) * 100) : 0}% Complete
                                    </span>
                                    <span>100%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* All Tasks List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">All Tasks</h3>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Task
                                    </Button>
                                </div>
                            </div>

                            {statuses.map((status) => {
                                const statusTasks = tasks[status.id as keyof typeof tasks] || []
                                if (statusTasks.length === 0) return null

                                return (
                                    <div key={status.id} className="space-y-2">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                            <h4 className="font-medium text-foreground">{status.name} ({statusTasks.length})</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                            {statusTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Empty State */}
                            {Object.values(tasks).flat().length === 0 && (
                                <div className="text-center py-12">
                                    <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold text-foreground">No Tasks Yet</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Get started by creating your first task for this milestone.
                                    </p>
                                    <Button className="mt-4">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Task
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeView === "board" ? (
                    <div className="h-full p-6">
                        <div className="flex gap-6 overflow-x-auto">
                            {statuses.map((status) => (
                                <Card
                                    key={status.id}
                                    className={`w-80 flex-shrink-0 ${draggedOverColumn === status.id ? 'ring-2 ring-primary/50' : ''
                                        }`}
                                    onDragOver={(e) => handleDragOver(e, status.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, status.id)}
                                >
                                    <CardContent className="p-0">
                                        {/* Status Header */}
                                        <div className={`px-3 py-2 rounded-t-sm ${status.bgColor}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                                    <h3 className={`text-sm font-semibold ${status.textColor}`}>
                                                        {status.name.toUpperCase()}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs ${
                                                            status.id === 'todo' ? 'bg-gray-500 text-white' :
                                                            status.id === 'inProgress' ? 'bg-blue-500 text-white' :
                                                            'bg-green-500 text-white'
                                                        }`}
                                                    >
                                                        {tasks[status.id as keyof typeof tasks]?.length || 0}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => addNewTask()}
                                                    className={`h-6 w-6 p-0 border-2 border-dashed transition-colors ${
                                                        status.id === 'todo' ? 'border-gray-500' :
                                                        status.id === 'inProgress' ? 'border-blue-500' :
                                                        'border-green-500'
                                                    } ${status.textColor}`}
                                                >
                                                    <Plus className={`h-4 w-4 ${
                                                        status.id === 'todo' ? 'text-gray-500' :
                                                        status.id === 'inProgress' ? 'text-blue-500' :
                                                        'text-green-500'
                                                    }`} />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Tasks List */}
                                        <div className="p-4 space-y-3 min-h-[200px] max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                                            {(tasks[status.id as keyof typeof tasks] || []).map((task) => (
                                                <TaskCard key={task.id} task={task} />
                                            ))}
                                            <Button 
                                                variant="ghost" 
                                                className="w-full h-12 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                                onClick={() => addNewTask()}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Task
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add New Status Card */}
                            <Card className="w-80 flex-shrink-0">
                                <CardContent className="p-4">
                                    <CreateStatusDialog onStatusCreate={createTaskStatus} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="text-center py-12">
                            <div className="text-lg font-semibold text-foreground mb-2">
                                {views.find(v => v.id === activeView)?.name} View
                            </div>
                            <p className="text-muted-foreground">
                                This view is coming soon. Currently showing Board view.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Task Dialog */}
            <TaskDialog
                open={taskDialogOpen}
                onClose={closeTaskDialog}
                taskId={editingTaskId}
                milestoneId="sprint-1"
                onTaskSave={handleTaskSave}
                onTaskDelete={handleTaskDelete}
            />
        </div>
    )
}
