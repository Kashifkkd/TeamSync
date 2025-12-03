"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations"
import { generateProjectKey } from "@/lib/utils"

interface NewProjectPageProps {
  params: Promise<{ slug: string }>
}

const projectColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
]

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "archived", label: "Archived" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const visibilityOptions = [
  { value: "private", label: "Private", description: "Only team members can see this project" },
  { value: "internal", label: "Internal", description: "All workspace members can see this project" },
  { value: "public", label: "Public", description: "Anyone with the link can view this project" },
]

export default function NewProjectPage({ params }: NewProjectPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [workspaceSlug, setWorkspaceSlug] = useState("")

  React.useEffect(() => {
    params.then(({ slug }) => setWorkspaceSlug(slug))
  }, [params])

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      status: "active",
      priority: "medium",
      visibility: "private",
      color: projectColors[0],
      startDate: "",
      endDate: "",
    },
  })

  const watchedName = form.watch("name")
  const watchedColor = form.watch("color")

  // Auto-generate project key from name
  React.useEffect(() => {
    if (watchedName) {
      const key = generateProjectKey(watchedName)
      form.setValue("key", key)
    }
  }, [watchedName, form])

  const onSubmit = async (data: CreateProjectInput) => {
    if (!workspaceSlug) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Call the project creation API directly with workspace slug
      const response = await fetch(`/api/workspaces/${workspaceSlug}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Something went wrong")
        return
      }

      const project = await response.json()
      setSuccess("Project created successfully!")
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push(`/workspace/${workspaceSlug}/projects/${project.id}`)
        router.refresh()
      }, 1500)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/workspace/${workspaceSlug}/projects`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center px-0 cursor-pointer "
              >
                <ArrowLeft className="h-6 w-6 text-[#fff] hover:text-gray-500" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Create New Project</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-4 space-y-4">
                {/* Project Name and Key */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Project Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Website Redesign, Mobile App"
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Project Key  <span className="text-xs text-gray-500">(Used for task IDs. Only lowercase letters, numbers, and hyphens allowed.)</span></FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="e.g., petc, web"
                              className="lowercase h-9 pr-20"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                                field.onChange(value)
                              }}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-mono">
                              {field.value ? `${field.value}-123` : 'key-123'}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Project Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Project Color</FormLabel>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                          style={{ backgroundColor: watchedColor }}
                        />
                        <div className="flex gap-1">
                          {projectColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-6 h-6 rounded border-2 shadow-sm transition-all ${watchedColor === color
                                ? 'border-gray-400 scale-110'
                                : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                }`}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this project is about..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status, Priority, Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select visibility">
                                {field.value && visibilityOptions.find(option => option.value === field.value)?.label}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-muted-foreground">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start and End Dates */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DatePicker
                              label="Start Date"
                              value={field.value ? new Date(field.value) : undefined}
                              onChange={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                              placeholder="Select start date"
                              error={!!form.formState.errors.startDate}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DatePicker
                              label="End Date"
                              value={field.value ? new Date(field.value) : undefined}
                              onChange={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                              placeholder="Select end date"
                              minDate={form.watch("startDate") ? new Date(form.watch("startDate") as string) : undefined}
                              error={!!form.formState.errors.endDate}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Link href={`/workspace/${workspaceSlug}/projects`}>
                    <Button variant="outline" type="button" className="h-9 px-4">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading || !!success} className="h-9 px-6 bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Creating..." : success ? "Project Created!" : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
