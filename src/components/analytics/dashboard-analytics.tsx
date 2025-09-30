"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  Users, 
  Target,
  Activity,
  Calendar,
  Zap,
  AlertCircle
} from "lucide-react"

interface AnalyticsData {
  taskCompletion: {
    completed: number
    total: number
    trend: number // percentage change
  }
  velocity: {
    current: number
    previous: number
    trend: number
  }
  burndown: Array<{
    date: string
    planned: number
    actual: number
  }>
  tasksByStatus: Array<{
    status: string
    count: number
    color: string
  }>
  teamPerformance: Array<{
    name: string
    completed: number
    assigned: number
    efficiency: number
  }>
  projectProgress: Array<{
    name: string
    progress: number
    dueDate: string
    status: "on_track" | "at_risk" | "overdue"
  }>
  activityTrend: Array<{
    date: string
    tasks: number
    comments: number
    commits: number
  }>
}

interface DashboardAnalyticsProps {
  data: AnalyticsData
  timeRange: "7d" | "30d" | "90d"
  onTimeRangeChange: (range: "7d" | "30d" | "90d") => void
}

export function DashboardAnalytics({ data, timeRange, onTimeRangeChange }: DashboardAnalyticsProps) {
  const completionRate = Math.round((data.taskCompletion.completed / data.taskCompletion.total) * 100) || 0
  const velocityTrend = data.velocity.current - data.velocity.previous

  const statusColors = {
    todo: "#6b7280",
    in_progress: "#3b82f6",
    in_review: "#f59e0b",
    done: "#10b981",
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{data.taskCompletion.completed} of {data.taskCompletion.total}</span>
              {data.taskCompletion.trend !== 0 && (
                <div className={`flex items-center ${data.taskCompletion.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.taskCompletion.trend > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(data.taskCompletion.trend)}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.velocity.current}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>points per sprint</span>
              {velocityTrend !== 0 && (
                <div className={`flex items-center ${velocityTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {velocityTrend > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(velocityTrend)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projectProgress.length}</div>
            <div className="text-xs text-muted-foreground">
              {data.projectProgress.filter(p => p.status === "at_risk").length} at risk
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.activityTrend.reduce((sum, day) => sum + day.tasks + day.comments, 0)}
            </div>
            <div className="text-xs text-muted-foreground">
              actions this {timeRange === "7d" ? "week" : "month"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Burndown</CardTitle>
            <CardDescription>
              Track progress against planned work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.burndown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#9ca3af" 
                  strokeDasharray="5 5"
                  name="Planned"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>
              Current status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {data.tasksByStatus.map((status) => (
                <div key={status.status} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm capitalize">
                    {status.status.replace("_", " ")}: {status.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>
              Individual productivity metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.teamPerformance.map((member) => (
                <div key={member.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{member.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {member.completed}/{member.assigned} tasks
                    </span>
                  </div>
                  <Progress value={member.efficiency} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{member.efficiency}% efficiency</span>
                    <Badge 
                      variant={member.efficiency >= 80 ? "default" : member.efficiency >= 60 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {member.efficiency >= 80 ? "Excellent" : member.efficiency >= 60 ? "Good" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>
              Daily team activity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Tasks"
                />
                <Area 
                  type="monotone" 
                  dataKey="comments" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Comments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            Track all active projects and their health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.projectProgress.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{project.name}</span>
                    <Badge 
                      variant={
                        project.status === "on_track" ? "default" : 
                        project.status === "at_risk" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {project.status === "on_track" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {project.status === "at_risk" && <Clock className="mr-1 h-3 w-3" />}
                      {project.status === "overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due {project.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={project.progress} className="flex-1 h-2" />
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
