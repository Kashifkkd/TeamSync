"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Target,
  Calendar
} from "lucide-react"
import { getInitials } from "@/lib/utils"

interface AdvancedAnalyticsProps {
  workspaceId: string
  projectId?: string
  data: {
    tasks: any[]
    members: any[]
    milestones: any[]
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdvancedAnalytics({ workspaceId, projectId, data }: AdvancedAnalyticsProps) {
  const { tasks, members, milestones } = data

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
  const blockedTasks = tasks.filter((t) => t.status === "blocked").length
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
  ).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const avgTimeSpent = Math.round(
    tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0) / Math.max(tasks.length, 1)
  )

  // Task distribution by status
  const statusDistribution = [
    { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#94a3b8" },
    { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
    { name: "In Review", value: tasks.filter((t) => t.status === "in_review").length, color: "#eab308" },
    { name: "Done", value: completedTasks, color: "#10b981" },
    { name: "Blocked", value: blockedTasks, color: "#ef4444" },
  ]

  // Priority distribution
  const priorityDistribution = [
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
    { name: "High", value: tasks.filter((t) => t.priority === "high").length },
    { name: "Critical", value: tasks.filter((t) => t.priority === "critical").length },
  ]

  // Weekly task completion trend (last 7 days)
  const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
    const completed = tasks.filter((t) => {
      const updatedDate = new Date(t.updatedAt)
      return (
        t.status === "done" &&
        updatedDate.toDateString() === date.toDateString()
      )
    }).length
    return { day: dateStr, completed }
  })

  // Team performance
  const teamPerformance = members.map((member: any) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === member.user?.id)
    const completed = memberTasks.filter((t) => t.status === "done").length
    return {
      name: member.user?.name?.split(" ")[0] || "User",
      tasks: memberTasks.length,
      completed,
      efficiency: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0
    }
  }).slice(0, 10)

  // Task type distribution
  const typeDistribution = [
    { name: "Tasks", value: tasks.filter((t) => t.type === "task").length },
    { name: "Bugs", value: tasks.filter((t) => t.type === "bug").length },
    { name: "Features", value: tasks.filter((t) => t.type === "feature").length },
    { name: "Epics", value: tasks.filter((t) => t.type === "epic").length },
    { name: "Stories", value: tasks.filter((t) => t.type === "story").length },
  ]

  // Burndown data for milestones
  const burndownData = milestones.slice(0, 1).map((milestone: any) => {
    const milestoneTasks = tasks.filter((t) => t.milestoneId === milestone.id)
    const totalPoints = milestoneTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
    const completedPoints = milestoneTasks
      .filter((t) => t.status === "done")
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0)
    return {
      name: milestone.name,
      total: totalPoints,
      completed: completedPoints,
      remaining: totalPoints - completedPoints
    }
  })

  // Team capacity radar
  const capacityData = teamPerformance.slice(0, 5).map((member) => ({
    subject: member.name,
    tasks: member.tasks,
    efficiency: member.efficiency,
    fullMark: 100
  }))

  // Top performers
  const topPerformers = [...teamPerformance]
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+5% from last week</span>
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Time/Task</p>
                <p className="text-2xl font-bold">{avgTimeSpent}m</p>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-10% from last week</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold">{overdueTasks}</p>
                <div className="flex items-center text-xs text-amber-600 mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Needs attention</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{members.length}</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  <span>All active</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Capacity Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Capacity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={capacityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Tasks"
                  dataKey="tasks"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => {
                const member = members.find(
                  (m: any) => m.user?.name?.split(" ")[0] === performer.name
                )
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member?.user?.image || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(performer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{performer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {performer.completed} tasks completed
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{performer.efficiency}%</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Progress */}
      {burndownData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Milestone Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {burndownData.map((milestone, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{milestone.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {milestone.completed} / {milestone.total} points
                    </span>
                  </div>
                  <Progress
                    value={(milestone.completed / Math.max(milestone.total, 1)) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

