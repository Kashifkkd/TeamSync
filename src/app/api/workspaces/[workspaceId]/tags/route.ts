import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth();
    const { workspaceId: workspaceSlugOrId } = params;

    // Try to find workspace by ID first, then by slug
    let workspace = await db.workspace.findUnique({
      where: { id: workspaceSlugOrId },
      include: {
        members: {
          where: { userId: user.id },
        },
      },
    });
    
    if (!workspace) {
      workspace = await db.workspace.findUnique({
        where: { slug: workspaceSlugOrId },
        include: {
          members: {
            where: { userId: user.id },
          },
        },
      });
    }

    if (!workspace || workspace.members.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const tags = await db.tag.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth();
    const { workspaceId: workspaceSlugOrId } = params;

    // Try to find workspace by ID first, then by slug
    let workspace = await db.workspace.findUnique({
      where: { id: workspaceSlugOrId },
      include: {
        members: {
          where: { userId: user.id },
        },
      },
    });
    
    if (!workspace) {
      workspace = await db.workspace.findUnique({
        where: { slug: workspaceSlugOrId },
        include: {
          members: {
            where: { userId: user.id },
          },
        },
      });
    }

    if (!workspace || workspace.members.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existingTag = await db.tag.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        workspaceId: workspace.id,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 409 }
      );
    }

    const tag = await db.tag.create({
      data: {
        name: name.trim(),
        color: color || "#3b82f6", // Default blue color
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}