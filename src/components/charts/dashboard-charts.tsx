'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, BarChart, Bar } from "recharts"

interface ChartData {
  taskTrendData: Array<{
    name: string
    completed: number
    inProgress: number
    blocked: number
  }>
  statusDistribution: Array<{
    name: string
    value: number
    color: string
  }>
  projectProgressData: Array<{
    name: string
    progress: number
    tasks: number
  }>
  weeklyActivityData: Array<{
    day: string
    tasks: number
    comments: number
    meetings: number
  }>
  teamPerformanceData: Array<{
    name: string
    tasks: number
    efficiency: number
  }>
}

export function DashboardCharts({ data }: { data: ChartData }) {
  const { taskTrendData, statusDistribution, projectProgressData, weeklyActivityData, teamPerformanceData } = data

  return (
    <>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Trend Chart */}
        <div className="card-elevated">
          <div className="p-4 pb-3">
            <div className="flex items-center space-x-2 text-base font-semibold">
              <div className="h-4 w-4 bg-blue-500 rounded" />
              <span>Task Trends (7 Days)</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={taskTrendData}>
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `${label}:`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="inProgress" 
                    stackId="1" 
                    stroke="#2563eb" 
                    fill="#2563eb" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blocked" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="card-elevated">
          <div className="p-4 pb-3">
            <div className="flex items-center space-x-2 text-base font-semibold">
              <div className="h-4 w-4 bg-green-500 rounded" />
              <span>Task Status Distribution</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold">{item.value}</span> {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Project Progress Chart */}
        <div className="card-elevated">
          <div className="p-4 pb-3">
            <div className="flex items-center space-x-2 text-base font-semibold">
              <div className="h-4 w-4 bg-purple-500 rounded" />
              <span>Project Progress</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData}>
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Bar dataKey="progress" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="card-elevated">
          <div className="p-4 pb-3">
            <div className="flex items-center space-x-2 text-base font-semibold">
              <div className="h-4 w-4 bg-orange-500 rounded" />
              <span>Weekly Activity</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivityData}>
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="meetings" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Team Performance Chart */}
        <div className="card-elevated">
          <div className="p-4 pb-3">
            <div className="flex items-center space-x-2 text-base font-semibold">
              <div className="h-4 w-4 bg-cyan-500 rounded" />
              <span>Team Performance</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformanceData}>
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [value, name]}
                  />
                  <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="efficiency" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
