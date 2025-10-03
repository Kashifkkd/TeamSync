"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

interface CreateMilestoneDialogProps {
  onMilestoneCreated?: () => void
  workspaceId: string
  projects?: Array<{ id: string; name: string; key: string }>
}

export function CreateMilestoneDialog({ onMilestoneCreated, workspaceId, projects = [] }: CreateMilestoneDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "medium" as "low" | "medium" | "high",
    projectId: ""
  })

  const queryClient = useQueryClient()
  const router = useRouter()

  const createMilestoneMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create milestone")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Invalidate and refetch milestones
      queryClient.invalidateQueries({ queryKey: ['milestones', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
      
      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "medium",
        projectId: ""
      })
      setOpen(false)
      
      // Navigate to the newly created milestone
      if (data.milestone?.id) {
        router.push(`/workspace/${workspaceId}/milestones/${data.milestone.id}`)
      }
      
      // Call the callback if provided
      onMilestoneCreated?.()
    },
    onError: (error) => {
      console.error("Error creating milestone:", error)
      // You could add a toast notification here
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createMilestoneMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Milestone</DialogTitle>
          <DialogDescription>
            Create a new milestone or sprint for your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sprint 1 - Foundation"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} ({project.key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the milestone goals and objectives..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMilestoneMutation.isPending}>
            {createMilestoneMutation.isPending ? "Creating..." : "Create Milestone"}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
