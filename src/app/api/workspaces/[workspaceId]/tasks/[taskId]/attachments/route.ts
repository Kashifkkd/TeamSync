import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    const attachments = await db.attachment.findMany({
      where: { taskId },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ attachments })
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", taskId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filepath = join(uploadsDir, filename)

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create database record
    const url = `/uploads/${taskId}/${filename}`
    const attachment = await db.attachment.create({
      data: {
        name: file.name,
        url,
        size: file.size,
        type: file.type,
        taskId,
        uploaderId: user.id!
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "UPLOAD_ATTACHMENT",
        entity: "TASK",
        entityId: taskId,
        userId: user.id!,
        changes: {
          filename: file.name,
          size: file.size
        }
      }
    })

    return NextResponse.json({ attachment }, { status: 201 })
  } catch (error) {
    console.error("Error uploading attachment:", error)
    return NextResponse.json(
      { error: "Failed to upload attachment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const attachmentId = searchParams.get("attachmentId")

    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 }
      )
    }

    const attachment = await db.attachment.findUnique({
      where: { id: attachmentId }
    })

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      )
    }

    // Delete from database
    await db.attachment.delete({
      where: { id: attachmentId }
    })

    // Note: In production, you'd also delete the file from disk or S3
    // For now, we'll leave the file on disk

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting attachment:", error)
    return NextResponse.json(
      { error: "Failed to delete attachment" },
      { status: 500 }
    )
  }
}

