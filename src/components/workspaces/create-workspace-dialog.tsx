"use client"

import { useState } from "react"
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
import { Plus, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateWorkspaceDialogProps {
  onWorkspaceCreated?: (workspace: any) => void
  onDialogOpen?: () => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateWorkspaceDialog({ 
  onWorkspaceCreated,
  onDialogOpen,
  children,
  open: controlledOpen,
  onOpenChange
}: CreateWorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  })
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) return

    try {
      setLoading(true)
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create workspace')
      }

      const workspace = await response.json()
      setOpen(false)
      setFormData({ name: "", slug: "", description: "" })
      
      if (onWorkspaceCreated) {
        onWorkspaceCreated(workspace)
      } else {
        // Navigate to the new workspace only if no callback
        router.push(`/workspace/${workspace.slug}`)
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && onDialogOpen) {
      onDialogOpen()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded text-white">
              <Building2 className="h-4 w-4" />
            </div>
            Create Workspace
          </DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your projects and team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              placeholder="e.g., Acme Inc, My Team"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Workspace URL</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">team-sync.com/workspace/</span>
              <Input
                id="slug"
                placeholder="acme-inc"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this workspace"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
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
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
