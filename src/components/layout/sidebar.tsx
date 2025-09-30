"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  Home, 
  FolderKanban, 
  Target, 
  CheckSquare, 
  Users, 
  Settings, 
  Plus,
  ChevronDown,
  LogOut,
  Building2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"

interface SidebarProps {
  workspace: {
    id: string
    name: string
    slug: string
    image?: string
  }
  user: {
    id: string
    name?: string
    email?: string
    image?: string
  }
  projects?: Array<{
    id: string
    name: string
    key: string
    color: string
  }>
}

const navigation = [
  { name: "Overview", href: "", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Milestones", href: "/milestones", icon: Target },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ workspace, user, projects = [] }: SidebarProps) {
  const pathname = usePathname()
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true)

  const baseUrl = `/workspace/${workspace.slug}`

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border shadow-sm">
      {/* Workspace Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 hover:bg-muted/50 w-full justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {workspace.image ? (
                    <img src={workspace.image} alt={workspace.name} className="w-8 h-8 rounded-lg" />
                  ) : (
                    <span className="text-primary-foreground font-semibold text-sm">
                      {getInitials(workspace.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Workspace</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem>
              <Building2 className="mr-2 h-4 w-4" />
              Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Switch Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const href = `${baseUrl}${item.href}`
          const isActive = pathname === href || (item.href !== "" && pathname.startsWith(href))
          
          return (
            <Link key={item.name} href={href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}

        {/* Projects Section */}
        <div className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-between text-xs font-medium text-gray-500 uppercase tracking-wider"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
          >
            Projects
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform",
              !isProjectsExpanded && "-rotate-90"
            )} />
          </Button>
          
          {isProjectsExpanded && (
            <div className="mt-2 space-y-1">
              {projects.map((project) => {
                const href = `${baseUrl}/projects/${project.id}`
                const isActive = pathname === href
                
                return (
                  <Link key={project.id} href={href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start pl-4 text-sm",
                        isActive && "bg-blue-50 text-blue-700 hover:bg-blue-50"
                      )}
                    >
                      <div 
                        className="mr-2 h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="truncate">{project.name}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        {project.key}
                      </span>
                    </Button>
                  </Link>
                )
              })}
              
              <Link href={`${baseUrl}/projects/new`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  New Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback className="text-xs">
                  {getInitials(user.name || user.email || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
