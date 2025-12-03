"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { TeamMemberSelector } from "@/components/projects/team-member-selector"
import { PROJECT_COLOR_OPTIONS, DEFAULT_COLORS } from "@/lib/constants"
import { Plus, FolderKanban, Shield } from "lucide-react"

interface CreateProjectDialogProps {
  workspaceId: string // This is actually the workspace slug
  onProjectCreated?: (project: any) => void
  onDialogOpen?: () => void
  children?: React.ReactNode
  canCreate?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isButtonTrigger?: boolean
}

export function CreateProjectDialog({
  workspaceId,
  onProjectCreated,
  onDialogOpen,
  children,
  isButtonTrigger = true,
  canCreate = true,
  open: controlledOpen,
  onOpenChange
}: CreateProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    color: DEFAULT_COLORS.PRIMARY
  })
  const [selectedMembers, setSelectedMembers] = useState<Array<{ id: string, name: string, email: string, image?: string | null, role: string }>>([])
  const [customColor, setCustomColor] = useState("")
  const [showCustomColor, setShowCustomColor] = useState(false)

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20)
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      key: generateKey(name)
    }))
  }

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }))
    setShowCustomColor(false)
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    if (color.match(/^#[0-9A-F]{6}$/i)) {
      setFormData(prev => ({ ...prev, color }))
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && onDialogOpen) {
      onDialogOpen()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.key.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/workspaces/${workspaceId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teamMembers: selectedMembers.map(member => ({
            userId: member.id,
            role: member.role
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const project = await response.json()

      // Show success toast
      toast({
        title: "Project created successfully!",
        description: `"${project.name}" has been created and you're being redirected.`,
      })

      setOpen(false)
      setFormData({ name: "", key: "", description: "", color: DEFAULT_COLORS.PRIMARY })
      setSelectedMembers([])
      setCustomColor("")
      setShowCustomColor(false)

      if (onProjectCreated) {
        onProjectCreated(project)
      }

      // Redirect to the new project page
      router.push(`/workspace/${workspaceId}/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Failed to create project",
        description: "There was an error creating the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const colorOptions = PROJECT_COLOR_OPTIONS

  if (!canCreate) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Only admins can create projects</span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isButtonTrigger && <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        )}
      </DialogTrigger>
      }
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded text-white">
              <FolderKanban className="h-4 w-4" />
            </div>
            Create Project
          </DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks and milestones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="e.g., Website Redesign, Mobile App"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Project Key</Label>
            <Input
              id="key"
              placeholder="Auto-generated from project name"
              value={formData.key}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Project key is automatically generated from the project name
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this project"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <TeamMemberSelector
            workspaceId={workspaceId}
            selectedMembers={selectedMembers}
            onSelectionChange={setSelectedMembers}
            disabled={loading}
          />
          <div className="space-y-3">
            <Label>Project Color</Label>
            <div className="space-y-3">
              {/* Predefined Colors */}
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleColorSelect(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color.value
                        ? 'border-foreground scale-110'
                        : 'border-border hover:scale-105'
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Custom Color Option */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCustomColor(!showCustomColor)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md border-2 transition-all ${showCustomColor
                      ? 'border-primary bg-primary/5'
                      : 'border-dashed border-border hover:border-primary/50'
                    }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: formData.color }}
                  />
                  <span className="text-sm">Custom Color</span>
                </button>

                {showCustomColor && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customColor || formData.color}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={customColor || formData.color}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-24 h-8 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
