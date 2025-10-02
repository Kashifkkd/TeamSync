"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FolderKanban, 
  ChevronDown, 
  Plus,
  CheckSquare,
  Activity,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  key: string;
  color: string;
  description?: string;
  _count?: {
    tasks: number;
  };
  tasks?: Array<{
    status: string;
  }>;
}

interface ProjectSelectorProps {
  projects: Project[];
  currentProject?: Project;
  workspaceSlug: string;
  canCreateProject?: boolean;
}

export function ProjectSelector({ 
  projects, 
  currentProject, 
  workspaceSlug, 
  canCreateProject = false 
}: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(currentProject);

  // Update URL when project changes
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    const params = new URLSearchParams(searchParams.toString());
    params.set('projectId', project.id);
    router.push(`/workspace/${workspaceSlug}?${params.toString()}`);
  };

  // Clear project selection
  const handleClearProject = () => {
    setSelectedProject(undefined);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('projectId');
    router.push(`/workspace/${workspaceSlug}?${params.toString()}`);
  };

  // Calculate project statistics
  const getProjectStats = (project: Project) => {
    const totalTasks = project._count?.tasks || 0;
    const completedTasks = project.tasks?.filter(t => t.status === "done").length || 0;
    const inProgressTasks = project.tasks?.filter(t => t.status === "in_progress").length || 0;
    const blockedTasks = project.tasks?.filter(t => t.status === "blocked").length || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      progress
    };
  };

  const stats = selectedProject ? getProjectStats(selectedProject) : null;

  return (
    <div className="space-y-4">
      {/* Project Selector Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FolderKanban className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Projects</h2>
            <p className="text-sm text-muted-foreground">
              {selectedProject ? `Working on ${selectedProject.name}` : "Select a project to get started"}
            </p>
          </div>
        </div>
        
        {canCreateProject && (
          <Link href={`/workspace/${workspaceSlug}/projects/new`}>
            <Button size="sm" className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Project Selection */}
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between min-w-[200px]">
              <div className="flex items-center space-x-2">
                {selectedProject ? (
                  <>
                    <div 
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: selectedProject.color }}
                    />
                    <span className="truncate">{selectedProject.name}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Select a project</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {projects.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No projects available
              </div>
            ) : (
              <>
                <DropdownMenuItem onClick={handleClearProject}>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                    <span>All Projects</span>
                  </div>
                </DropdownMenuItem>
                {projects.map((project) => (
                  <DropdownMenuItem 
                    key={project.id} 
                    onClick={() => handleProjectSelect(project)}
                    className="flex items-center space-x-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {project.key}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedProject && (
          <Button variant="ghost" size="sm" onClick={handleClearProject}>
            Clear
          </Button>
        )}
      </div>

      {/* Selected Project Details */}
      {selectedProject && stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <span>{selectedProject.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedProject.key}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.progress}% complete
              </div>
            </CardTitle>
            {selectedProject.description && (
              <p className="text-sm text-muted-foreground">
                {selectedProject.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.totalTasks}</div>
                <div className="text-xs text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.blockedTasks}</div>
                <div className="text-xs text-muted-foreground">Blocked</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{stats.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {selectedProject && (
        <div className="flex flex-wrap gap-2">
          <Link href={`/workspace/${workspaceSlug}/tasks?projectId=${selectedProject.id}`}>
            <Button variant="outline" size="sm">
              <CheckSquare className="mr-2 h-4 w-4" />
              View Tasks
            </Button>
          </Link>
          <Link href={`/workspace/${workspaceSlug}/milestones?projectId=${selectedProject.id}`}>
            <Button variant="outline" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              Milestones
            </Button>
          </Link>
          <Link href={`/workspace/${workspaceSlug}/team?projectId=${selectedProject.id}`}>
            <Button variant="outline" size="sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              Team
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}


