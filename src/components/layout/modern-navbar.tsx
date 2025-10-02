"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  Building2,
  FolderKanban,
  Zap,
  Plus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Combobox } from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

interface Workspace {
  id: string
  name: string
  slug: string
  image?: string
}

interface Project {
  id: string
  name: string
  key: string
  color?: string
}

interface ModernNavbarProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showActions?: boolean
  onMenuToggle?: () => void
  isMenuOpen?: boolean
  workspaces?: Workspace[]
  projects?: Project[]
  currentWorkspace?: Workspace
  currentProject?: Project
  userRole?: string
  onWorkspaceChange?: (workspaceId: string) => void
  onProjectChange?: (projectId: string) => void
}

export function ModernNavbar({
  showSearch = true,
  showActions = true,
  onMenuToggle,
  isMenuOpen = false,
  workspaces = [],
  projects = [],
  currentWorkspace,
  currentProject,
  userRole,
  onWorkspaceChange,
  onProjectChange
}: ModernNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const workspaceOptions = workspaces.map(ws => ({
    value: ws.id,
    label: ws.name,
    description: ws.slug,
    icon: <Building2 className="h-4 w-4" />
  }))

  const projectOptions = [
    // Add "All Projects" option for admin/owner users
    ...(userRole === 'owner' || userRole === 'admin' ? [{
      value: 'all-projects',
      label: 'All Projects',
      description: 'View all projects',
      icon: <Zap className="h-4 w-4" />
    }] : []),
    // Regular project options
    ...projects.map(project => ({
      value: project.id,
      label: project.name,
      description: project.key,
      icon: <FolderKanban className="h-4 w-4" />
    }))
  ]

  console.log('workspace options:', workspaceOptions.length)
  console.log('project options:', projectOptions.length)

  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between w-full">
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-accent hover:rounded-[25%] cursor-pointer transition-all duration-200"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="flex items-center space-x-2">
          <Combobox
            options={workspaceOptions}
            value={currentWorkspace?.id}
            onValueChange={onWorkspaceChange}
            placeholder="Select workspace"
            searchPlaceholder="Find workspace..."
            className="min-w-[200px]"
            footerContent={
              <CreateWorkspaceDialog onWorkspaceCreated={() => window.location.reload()}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workspace
                </Button>
              </CreateWorkspaceDialog>
            }
          />
          <span className="text-muted-foreground">/</span>
        </div>

        {/* Project Switcher */}
        <div className="flex items-center space-x-2">
          <Combobox
            options={projectOptions}
            value={currentProject?.id}
            onValueChange={onProjectChange}
            placeholder="Select project"
            searchPlaceholder="Find project..."
            className="min-w-[200px]"
            footerContent={
              currentWorkspace ? (
                <CreateProjectDialog 
                  workspaceId={currentWorkspace.id}
                  onProjectCreated={() => window.location.reload()}
                  canCreate={userRole === 'owner' || userRole === 'admin'}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CreateProjectDialog>
              ) : null
            }
          />
        </div>

      </div>

      {/* Center Section - Search */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, tasks, or team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 bg-muted/50 border-muted-foreground/20 focus:bg-background"
            />
          </div>
        </div>
      )}

      {/* Right Section - Actions */}
      {showActions && (
        <div className="flex items-center space-x-2">


          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-accent hover:rounded-[25%] cursor-pointer transition-all duration-200">
                <Bell className="h-4 w-4" />
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">New task assigned</span>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have been assigned to &quot;Update user dashboard&quot;
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-sm font-medium">Project deadline approaching</span>
                    <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    &quot;Mobile App Redesign&quot; is due in 2 days
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center space-x-2 w-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-sm font-medium">Task completed</span>
                    <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    &quot;Fix login bug&quot; has been completed by John Doe
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <div className="hover:bg-accent hover:rounded-[25%] cursor-pointer transition-all duration-200">
            <ThemeToggle />
          </div>

          {/* Help */}
          <Button variant="ghost" size="sm" className="hover:bg-accent hover:rounded-[25%] cursor-pointer transition-all duration-200">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-accent hover:rounded-[25%] cursor-pointer transition-all duration-200">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
