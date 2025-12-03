"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  ChevronDown,
  LogOut,
  Bell,
  Settings,
  Squircle
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  primaryNavigation,
  getActiveModule,
  moduleDataFetchers
} from "@/lib/sidebar-config"
import { useProjectsClient } from "@/hooks/use-projects-client"
import { useMilestonesClient } from "@/hooks/use-milestones-client"

// Status color mapping removed - now handled in sidebar-config.ts

// Navigation item interface
// Removed old interfaces - now using sidebar-config.ts
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

interface User {
  id: string
  name?: string
  email?: string
  image?: string
}

interface Workspace {
  id: string
  name: string
  slug: string
  image?: string
}

interface HoverSidebarProps {
  user: User
  workspace: Workspace
}

// Removed Milestone interface - now using sidebar-config.ts

// Navigation structure is now imported from sidebar-config.ts

export function HoverSidebar({ user, workspace }: HoverSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isHovered, setIsHovered] = useState(false)
  const [moduleData, setModuleData] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const baseUrl = `/workspace/${workspace.slug}`

  // Get active module using the new configuration
  const activeModule = getActiveModule(pathname, baseUrl)
  const hasSubmenu = activeModule.hasSubmenu

  // Get status from URL params, default to "all"
  const status = searchParams.get('status') || 'all'

  // Use client-side data fetching for projects
  const { data: projectsData, isLoading: projectsLoading } = useProjectsClient({
    workspaceSlug: workspace.slug,
    status: activeModule.id === 'projects' ? status : 'all',
    enabled: activeModule.id === 'projects'
  })

  // Use client-side data fetching for milestones
  const { data: milestonesData, isLoading: milestonesLoading } = useMilestonesClient({
    workspaceSlug: workspace.slug,
    enabled: activeModule.id === 'milestones'
  })

  // Fetch data for other modules (non-projects)
  useEffect(() => {
    const fetchModuleData = async () => {
      if (!hasSubmenu || !activeModule.id || activeModule.id === 'projects' || activeModule.id === 'milestones') {
        setModuleData(null)
        return
      }

      setLoading(true)
      try {
        const fetcher = moduleDataFetchers[activeModule.id as keyof typeof moduleDataFetchers]
        if (fetcher) {
          const data = await fetcher(workspace.slug)
          setModuleData(data)
        }
      } catch (error) {
        console.error(`Error fetching ${activeModule.id} data:`, error)
        setModuleData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchModuleData()
  }, [activeModule.id, workspace.slug, hasSubmenu])

  // Use appropriate data based on active module
  const finalModuleData = activeModule.id === 'projects' ? projectsData : 
                         activeModule.id === 'milestones' ? milestonesData : 
                         moduleData
  const finalLoading = activeModule.id === 'projects' ? projectsLoading : 
                      activeModule.id === 'milestones' ? milestonesLoading : 
                      loading

  // Get secondary navigation for the active module
  const secondaryNavigation = activeModule.getSecondaryNavigation(finalModuleData || [])
  const topItems = secondaryNavigation?.topSections || []
  const secondaryItems = secondaryNavigation?.sections || []
  const bottomItems = secondaryNavigation?.bottomSections || []

  return (
    <div className="flex h-full relative">
      {/* Primary Sidebar - Fixed width, expands as overlay */}
      <div
        className="w-16 flex flex-col bg-card border-r border-border relative z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Overlay expansion */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 ease-in-out z-40",
            isHovered ? "w-64 opacity-100" : "w-16 opacity-0 pointer-events-none"
          )}
        >
          {/* Expanded content */}
          <div className="p-2 space-y-2 h-full flex flex-col">
            <nav className="flex-1 space-y-2">
              {primaryNavigation.map((item) => {
                const isActive = activeModule.id === item.id
                const Icon = item.icon

                return (
                  <div key={item.id}>
                    <Link href={`${baseUrl}${item.href}`}>
                      <Button
                        variant="secondary"
                        className={cn(
                          "w-full justify-start h-10 relative cursor-pointer shadow-none",
                          isActive 
                            ? "bg-primary/10 text-primary hover:bg-primary/20" 
                            : "bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="flex-1 text-left text-sm">{item.name}</span>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                        )}
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </nav>

            {/* User Menu in overlay */}
            <div className="p-3 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="h-auto p-2 bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground w-full justify-start cursor-pointer shadow-none">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name || user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.name || user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Collapsed content */}
        <nav className="flex-1 p-2 space-y-2">
          {primaryNavigation.map((item) => {
            const isActive = activeModule.id === item.id
            const Icon = item.icon

            return (
              <div key={item.id}>
                <Link href={`${baseUrl}${item.href}`}>
                  <Button
                    variant="secondary"
                    className={cn(
                      "w-full justify-center h-10 relative cursor-pointer px-2 shadow-none",
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/20" 
                        : "bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                    title={item.name}
                  >
                    <Icon className="h-5 w-5" />
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />
                    )}
                  </Button>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User Menu collapsed */}
        <div className="p-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-auto p-2 bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground w-full justify-center cursor-pointer shadow-none">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name || user.email || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary Sidebar - Fixed position, only show if has submenu */}
      {hasSubmenu && (
        <div className="w-52 bg-card border-r border-border flex-shrink-0 relative z-20">
          <div className="px-5 pt-5">
            <h3 className="text-lg font-semibold text-foreground">
              {activeModule.name}
            </h3>
          </div>

          <nav className="p-5 space-y-6">
            {hasSubmenu && (
              <>
                {/* Top Section Items */}
                {topItems.length > 0 && (
                  <>
                    <div className="space-y-2 mb-4">
                      {topItems.map((item, index) => {
                        const Icon = item.icon
                        const currentPath = pathname.replace(baseUrl, '')
                        const currentStatus = searchParams.get('status') || 'all'

                        // Check if this is the active item based on href and status
                        let isActive = false
                        if (item.href === '/projects?status=all' || item.href === '/projects') {
                          isActive = currentPath === '/projects' && currentStatus === 'all'
                        } else if (item.href === '/projects?status=active') {
                          isActive = currentPath === '/projects' && currentStatus === 'active'
                        } else if (item.href === '/projects?status=archived') {
                          isActive = currentPath === '/projects' && currentStatus === 'archived'
                        } else if (item.href === '/projects?status=on_hold') {
                          isActive = currentPath === '/projects' && currentStatus === 'on_hold'
                        } else {
                          isActive = currentPath === item.href
                        }

                        return (
                          <Link key={`top-${index}`} href={`${baseUrl}${item.href}`}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className={cn(
                                      "w-full justify-start h-10 text-sm px-4 cursor-pointer shadow-none",
                                      isActive 
                                        ? "bg-primary/10 text-primary border-primary/20" 
                                        : "bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground"
                                    )}
                                  >
                                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                    <span className="flex-1 text-left truncate">{item.name}</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="border-b border-border -mx-5"></div>
                  </>
                )}

                {/* Section Items */}
                <div className="space-y-2">
                  {finalLoading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-3 h-10 px-4">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                        <div className="flex-1 h-4 bg-gray-300 rounded animate-pulse" />
                      </div>
                    ))
                  ) : secondaryItems.length > 0 ? (
                    secondaryItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname.replace(baseUrl, '') === item.href

                      return (
                        <Link key={index} href={`${baseUrl}${item.href}`}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  className={cn(
                                    "w-full justify-start h-10 text-sm px-4 cursor-pointer shadow-none",
                                    isActive 
                                      ? "bg-primary/10 text-primary border-primary/20" 
                                      : "bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground"
                                  )}
                                >
                                  <div className="flex items-center space-x-3 w-full min-w-0">
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    <div className="flex-1 text-left min-w-0">
                                      <div className="truncate">{item.name}</div>
                                      {/* {item.description && (
                                        <div className="text-xs text-muted-foreground truncate">
                                          {item.description}
                                        </div>
                                      )} */}
                                    </div>
                                    {item.badge && (<Squircle className={`h-2.25 w-2.25 flex-shrink-0 ${item.badge === 'Active' ? 'text-green-500 fill-green-500' : 'text-yellow-500 fill-yellow-500'}`} />
                                    )}
                                  </div>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Link>
                      )
                    })
                  ) : null}
                </div>

                {/* Empty state - only show if no top sections and no secondary items and not loading */}
                {!finalLoading && topItems.length === 0 && secondaryItems.length === 0 && (
                  <div className="text-center py-4 px-4">
                    <div className="text-sm text-muted-foreground">
                      No items to display
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {activeModule.id === 'projects' && 'Create a project first'}
                      {activeModule.id === 'milestones' && 'Create your first milestone'}
                      {activeModule.id === 'team' && 'No team members yet'}
                      {!['projects', 'milestones', 'team'].includes(activeModule.id) && 'No data available'}
                    </div>
                  </div>
                )}

                {/* Bottom Sections */}
                {bottomItems.length > 0 && (
                  <>
                    <div className="border-t border-border -mx-5 mt-8 mb-4"></div>
                    <div className="space-y-2">
                      {bottomItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname.replace(baseUrl, '') === item.href

                        return (
                          <Link key={`bottom-${index}`} href={`${baseUrl}${item.href}`}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className={cn(
                                      "w-full justify-start h-10 text-sm px-4 cursor-pointer shadow-none",
                                      isActive 
                                        ? "bg-primary/10 text-primary border-primary/20" 
                                        : "bg-[#1a1a1a] hover:bg-accent/50 hover:text-accent-foreground"
                                    )}
                                  >
                                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                    <span className="flex-1 text-left truncate">{item.name}</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Link>
                        )
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}