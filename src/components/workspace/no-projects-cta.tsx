"use client"

import { Button } from "@/components/ui/button"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Plus, FolderKanban, Sparkles, ArrowRight } from "lucide-react"

interface NoProjectsCTAProps {
  workspaceId: string
  canCreate: boolean
}

export function NoProjectsCTA({ workspaceId, canCreate }: NoProjectsCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background via-background to-muted/20 p-6 shadow-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon with animated background */}
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
            <div className="relative rounded-xl bg-primary/5 p-3 border border-primary/20">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-foreground">Ready to get started?</h3>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Create your first project to organize work, track milestones, and collaborate with your team.
            </p>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="flex-shrink-0">
          <CreateProjectDialog 
            workspaceId={workspaceId}
            onProjectCreated={() => window.location.reload()}
            canCreate={canCreate}
          >
            <Button className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md">
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Create Project
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </CreateProjectDialog>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
    </div>
  )
}
