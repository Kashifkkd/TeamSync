"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  File,
  Image as ImageIcon,
  FileText,
  X,
  Download,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  createdAt: string
  uploader: {
    id: string
    name?: string | null
    email?: string | null
  }
}

interface FileUploadProps {
  taskId: string
  workspaceId: string
  attachments: Attachment[]
  onUploadComplete: () => void
  onDelete: (attachmentId: string) => void
}

export function FileUpload({
  taskId,
  workspaceId,
  attachments,
  onUploadComplete,
  onDelete
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch(
            `/api/workspaces/${workspaceId}/tasks/${taskId}/attachments`,
            {
              method: "POST",
              body: formData
            }
          )

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to upload file")
          }
        }

        toast({
          title: "Success",
          description: `${acceptedFiles.length} file(s) uploaded successfully`
        })

        onUploadComplete()
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to upload files",
          variant: "destructive"
        })
      } finally {
        setUploading(false)
      }
    },
    [taskId, workspaceId, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  })

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Delete this attachment?")) return

    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/attachments?attachmentId=${attachmentId}`,
        {
          method: "DELETE"
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete attachment")
      }

      toast({
        title: "Success",
        description: "Attachment deleted"
      })

      onDelete(attachmentId)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete attachment",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.includes("pdf") || type.includes("document")) return FileText
    return File
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          uploading && "opacity-50 cursor-not-allowed",
          !isDragActive && "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "Drop files here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attachments ({attachments.length})</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.type)
              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment.size)}</span>
                        <span>•</span>
                        <span>{attachment.uploader.name || attachment.uploader.email}</span>
                        <span>•</span>
                        <span>
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(attachment.url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

