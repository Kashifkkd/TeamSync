"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Calendar as CalendarIcon, Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { KanbanView } from "./kanban-view"
import { ListView } from "./list-view"
import { CalendarView } from "./calendar-view"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useWorkspaceMembers } from "@/hooks/use-workspace-members"
import { useMilestones } from "@/hooks/use-milestones"

interface TaskViewsProps {
  workspaceId: string
  projectId?: string
  milestoneId?: string
}

type ViewType = "kanban" | "list" | "calendar"

export function TaskViews({ workspaceId, projectId, milestoneId }: TaskViewsProps) {
  const [viewType, setViewType] = useState<ViewType>("kanban")
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assigneeId: "",
    search: ""
  })

  const { members = [] } = useWorkspaceMembers({ workspaceId })

  const { data: milestonesData } = useMilestones(workspaceId)
  const milestones = milestonesData?.milestones || []

  const viewOptions = [
    { value: "kanban", label: "Board", icon: LayoutGrid },
    { value: "list", label: "List", icon: List },
    { value: "calendar", label: "Calendar", icon: CalendarIcon },
  ]

  return (
    <div className="space-y-4">
      {/* View Switcher and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {viewOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                variant={viewType === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType(option.value as ViewType)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.label}
              </Button>
            )
          })}
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-8 w-[200px]"
            />
          </div>

          {/* Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Filter Tasks</h4>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select
                    value={filters.assigneeId}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, assigneeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All assignees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All assignees</SelectItem>
                      {Array.isArray(members) && members.map((member: any) => (
                        <SelectItem key={member.id} value={member.user?.id || ""}>
                          {member.user?.name || member.user?.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setFilters({ status: "", priority: "", assigneeId: "", search: "" })}
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto">
        {viewType === "kanban" && (
          <KanbanView
            workspaceId={workspaceId}
            projectId={projectId}
            milestoneId={milestoneId}
          />
        )}
        {viewType === "list" && (
          <ListView
            workspaceId={workspaceId}
            projectId={projectId}
            milestoneId={milestoneId}
          />
        )}
        {viewType === "calendar" && (
          <CalendarView
            workspaceId={workspaceId}
            projectId={projectId}
            milestoneId={milestoneId}
          />
        )}
      </div>
    </div>
  )
}

