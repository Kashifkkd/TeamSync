"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Calendar, 
  Users, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock analytics data
const analyticsData = {
  overview: {
    totalMilestones: 6,
    activeSprints: 1,
    completedMilestones: 1,
    averageProgress: 42,
    totalTasks: 69,
    completedTasks: 18,
    overdueTasks: 3
  },
  velocity: [
    { sprint: "Sprint 1", planned: 12, completed: 10, velocity: 83 },
    { sprint: "Sprint 2", planned: 18, completed: 0, velocity: 0 },
    { sprint: "Sprint 3", planned: 15, completed: 0, velocity: 0 },
    { sprint: "Q1 Release", planned: 8, completed: 8, velocity: 100 },
    { sprint: "Sprint 4", planned: 10, completed: 0, velocity: 0 },
    { sprint: "Sprint 5", planned: 6, completed: 0, velocity: 0 }
  ],
  burndown: [
    { day: "Day 1", remaining: 12, ideal: 12 },
    { day: "Day 2", remaining: 11, ideal: 10 },
    { day: "Day 3", remaining: 9, ideal: 8 },
    { day: "Day 4", remaining: 8, ideal: 6 },
    { day: "Day 5", remaining: 6, ideal: 4 },
    { day: "Day 6", remaining: 4, ideal: 2 },
    { day: "Day 7", remaining: 2, ideal: 0 }
  ],
  teamPerformance: [
    { name: "Kashif", tasksCompleted: 15, efficiency: 95, availability: 100 },
    { name: "Nikhil", tasksCompleted: 8, efficiency: 88, availability: 90 },
    { name: "Faisal", tasksCompleted: 5, efficiency: 92, availability: 85 }
  ],
  milestoneProgress: [
    { name: "Sprint 1 - Foundation", progress: 85, status: "active", tasks: { total: 12, completed: 10 } },
    { name: "Sprint 2 - Core Features", progress: 0, status: "upcoming", tasks: { total: 18, completed: 0 } },
    { name: "Sprint 3 - Integration", progress: 0, status: "upcoming", tasks: { total: 15, completed: 0 } },
    { name: "Q1 Release Milestone", progress: 100, status: "completed", tasks: { total: 8, completed: 8 } },
    { name: "Sprint 4 - Testing", progress: 0, status: "upcoming", tasks: { total: 10, completed: 0 } },
    { name: "Sprint 5 - Launch", progress: 0, status: "upcoming", tasks: { total: 6, completed: 0 } }
  ]
}

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  upcoming: "bg-blue-100 text-blue-800 border-blue-200", 
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200"
}

export default function MilestonesAnalyticsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {/* <Link href="/milestones">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link> */}
            <div>
              <h1 className="text-base font-bold text-foreground">Milestones Analytics</h1>
              <p className="text-muted-foreground text-sm">
                Track sprint performance and team productivity
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Milestones</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.overview.totalMilestones}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sprints</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.overview.activeSprints}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.completedMilestones}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.overview.averageProgress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{analyticsData.overview.totalTasks}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.overview.completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
                  <p className="text-2xl font-bold text-red-600">{analyticsData.overview.overdueTasks}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestone Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Milestone Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.milestoneProgress.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm text-foreground">{milestone.name}</h4>
                        <Badge className={cn("text-xs", statusColors[milestone.status as keyof typeof statusColors])}>
                          {milestone.status}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium text-foreground">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{milestone.tasks.completed}/{milestone.tasks.total} tasks completed</span>
                      <span>{milestone.tasks.total - milestone.tasks.completed} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.teamPerformance.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-foreground">{member.name}</h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{member.tasksCompleted} tasks</span>
                        <span>{member.efficiency}% efficiency</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Efficiency</span>
                        <span>{member.efficiency}%</span>
                      </div>
                      <Progress value={member.efficiency} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Availability</span>
                        <span>{member.availability}%</span>
                      </div>
                      <Progress value={member.availability} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sprint Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Sprint Velocity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.velocity.map((sprint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{sprint.sprint}</h4>
                      <p className="text-xs text-muted-foreground">
                        {sprint.completed}/{sprint.planned} tasks completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">{sprint.velocity}%</div>
                      <div className="text-xs text-muted-foreground">velocity</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Burndown Chart Placeholder */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Current Sprint Burndown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.burndown.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{day.day}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm text-foreground">{day.remaining} remaining</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                        <span className="text-sm text-muted-foreground">{day.ideal} ideal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
