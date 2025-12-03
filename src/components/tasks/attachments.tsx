"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Paperclip, 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  X 
} from 'lucide-react'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

export function Attachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('pdf') || type.includes('document')) return FileText
    return File
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)
    
    try {
      // Simulate file upload - in real implementation, upload to server
      const newAttachments: Attachment[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // In real app, this would be server URL
        uploadedAt: new Date()
      }))

      setAttachments(prev => [...prev, ...newAttachments])
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const handleDownload = (attachment: Attachment) => {
    // In real implementation, this would download from server
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Attachments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-primary text-sm"
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        className="p-8 text-center border-2 border-dashed border-border rounded-md bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={32} className="text-muted-foreground mb-2 mx-auto" />
        <p className="text-sm text-muted-foreground mb-1">
          {attachments.length === 0 ? 'No attachments yet' : 'Drop files here or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports images, documents, and other files
        </p>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const Icon = getFileIcon(attachment.type)
            return (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(attachment.size)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {attachment.uploadedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
