"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronsUpDown,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Download,
  Edit2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getInitials, formatRelativeTime } from "@/lib/utils"
import { Task, useTasks, useUpdateTask, useBulkUpdateTasks, useBulkDeleteTasks } from "@/hooks/use-tasks"
import { useWorkspaceMembers } from "@/hooks/use-workspace-members"
import { useLabels } from "@/hooks/use-labels"
import { TaskEditorDialog as TaskDialog } from "./task-editor-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

interface ListViewProps {
  workspaceId: string
  projectId?: string
  milestoneId?: string
}

const priorityColors = {
  low: "text-gray-600 bg-gray-100",
  medium: "text-blue-600 bg-blue-100",
  high: "text-orange-600 bg-orange-100",
  critical: "text-red-600 bg-red-100",
}

const statusColors = {
  todo: "text-gray-600 bg-gray-100",
  in_progress: "text-blue-600 bg-blue-100",
  in_review: "text-yellow-600 bg-yellow-100",
  done: "text-green-600 bg-green-100",
}

export function ListView({ workspaceId, projectId, milestoneId }: ListViewProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")

  const { data, isLoading } = useTasks({ workspaceId, projectId, milestoneId })
  const tasks = data?.tasks || []

  const { members } = useWorkspaceMembers({ workspaceId })


  const { data: labelsData } = useLabels(workspaceId, projectId)
  const labels = labelsData?.labels || []

  const bulkUpdateMutation = useBulkUpdateTasks(workspaceId)
  const bulkDeleteMutation = useBulkDeleteTasks(workspaceId)

  const selectedRows = Object.keys(rowSelection).filter((key) => rowSelection[key as keyof typeof rowSelection])
  const selectedTaskIds = selectedRows.map((index) => tasks[parseInt(index)]?.id).filter(Boolean)

  const handleInlineEdit = async (taskId: string, field: string, value: any) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      // Use the update mutation
      const mutation = useUpdateTask(workspaceId, taskId)
      await mutation.mutateAsync({ [field]: value })
      
      setEditingCell(null)
      setEditValue("")
      
      toast({
        title: "Success",
        description: "Task updated"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive"
      })
    }
  }

  const handleBulkUpdate = async (updates: Partial<Task>) => {
    if (selectedTaskIds.length === 0) return

    try {
      await bulkUpdateMutation.mutateAsync({ taskIds: selectedTaskIds, updates })
      setRowSelection({})
      toast({
        title: "Success",
        description: `${selectedTaskIds.length} task(s) updated`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tasks",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return
    if (!confirm(`Delete ${selectedTaskIds.length} task(s)?`)) return

    try {
      await bulkDeleteMutation.mutateAsync(selectedTaskIds)
      setRowSelection({})
      toast({
        title: "Success",
        description: `${selectedTaskIds.length} task(s) deleted`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tasks",
        variant: "destructive"
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ["ID", "Title", "Status", "Priority", "Assignee", "Due Date", "Created"].join(","),
      ...tasks.map((task) =>
        [
          `${task.project.key}-${task.number}`,
          `"${task.title.replace(/"/g, '""')}"`,
          task.status,
          task.priority,
          task.assignee?.name || "Unassigned",
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
          new Date(task.createdAt).toLocaleDateString()
        ].join(",")
      )
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tasks-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "number",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm">
            {row.original.project.key}-{row.original.number}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const task = row.original
          const isEditing = editingCell?.taskId === task.id && editingCell?.field === "title"

          return isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                if (editValue.trim() !== task.title) {
                  handleInlineEdit(task.id, "title", editValue.trim())
                } else {
                  setEditingCell(null)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur()
                } else if (e.key === "Escape") {
                  setEditingCell(null)
                }
              }}
              autoFocus
              className="h-8"
            />
          ) : (
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-1 rounded"
              onClick={() => {
                setEditingCell({ taskId: task.id, field: "title" })
                setEditValue(task.title)
              }}
            >
              <span className="text-lg">{task.type === "bug" ? "🐛" : task.type === "feature" ? "✨" : "📋"}</span>
              <span className="font-medium">{task.title}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const task = row.original
          return (
            <Select
              value={task.status}
              onValueChange={(value) => handleInlineEdit(task.id, "status", value)}
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue>
                  <Badge className={cn("text-xs", statusColors[task.status as keyof typeof statusColors])}>
                    {task.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const task = row.original
          return (
            <Select
              value={task.priority}
              onValueChange={(value) => handleInlineEdit(task.id, "priority", value)}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue>
                  <Badge className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) => {
          const task = row.original
          return (
            <Select
              value={task.assigneeId || "unassigned"}
              onValueChange={(value) => handleInlineEdit(task.id, "assigneeId", value === "unassigned" ? null : value)}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue>
                  {task.assignee ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={task.assignee.image || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignee.name || task.assignee.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.user?.id || ""}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.user?.image || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user?.name || member.user?.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user?.name || member.user?.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: "labels",
        header: "Labels",
        cell: ({ row }) => {
          const task = row.original
          const validLabels = task.labels.filter(({ label }) => label && label.name && label.name.trim().length > 0)
          return (
            <div className="flex flex-wrap gap-1">
              {validLabels.slice(0, 2).map(({ label }) => (
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
              {validLabels.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{validLabels.length - 2}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const task = row.original
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"
          return task.dueDate ? (
            <div className={cn("flex items-center space-x-1 text-sm", isOverdue && "text-red-600")}>
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(task.dueDate)}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No date</span>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatRelativeTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const task = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTask(task)
                    setIsTaskDialogOpen(true)
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (confirm("Delete this task?")) {
                      handleBulkDelete()
                    }
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [tasks, members, labels, editingCell, editValue]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          {selectedTaskIds.length > 0 && (
            <>
              <Select onValueChange={(value) => handleBulkUpdate({ status: value })}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleBulkUpdate({ priority: value })}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedTaskIds.length})
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => {
            setSelectedTask(null)
            setIsTaskDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

