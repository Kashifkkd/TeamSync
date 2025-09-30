"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { generateViewUrl, getCurrentView } from "@/lib/view-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  BarChart3, 
  List, 
  Calendar as CalendarIcon, 
  Table, 
  GanttChart 
} from "lucide-react"

const views = [
  { id: "all", name: "All", icon: Target },
  { id: "board", name: "Board", icon: BarChart3 },
  { id: "list", name: "List", icon: List },
  { id: "calendar", name: "Calendar", icon: CalendarIcon },
  { id: "table", name: "Table", icon: Table },
  { id: "gantt", name: "Gantt", icon: GanttChart }
]

export function ViewNavigationExample() {
  const searchParams = useSearchParams()
  const currentView = getCurrentView(searchParams)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Dynamic View Navigation Example</CardTitle>
        <p className="text-sm text-muted-foreground">
          This shows how to create dynamic links that preserve URL parameters and toggle views.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current View: {currentView}</h3>
            <p className="text-sm text-muted-foreground">
              URL: {window.location.href}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">View Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {views.map((view) => {
                const Icon = view.icon
                const isActive = currentView === view.id
                const viewUrl = generateViewUrl(view.id, searchParams)
                
                return (
                  <Link key={view.id} href={viewUrl}>
                    <Button
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{view.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Generated URLs</h3>
            <div className="space-y-1 text-sm font-mono">
              {views.map((view) => {
                const viewUrl = generateViewUrl(view.id, searchParams)
                return (
                  <div key={view.id} className="flex items-center space-x-2">
                    <span className="font-medium">{view.name}:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {viewUrl}
                    </code>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
