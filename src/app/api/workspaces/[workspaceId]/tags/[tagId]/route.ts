import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; tagId: string } }
) {
  try {
    const user = await requireAuth();
    const { workspaceId: workspaceSlugOrId, tagId } = params;

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

    const tag = await db.tag.update({
      where: {
        id: tagId,
        workspaceId: workspace.id,
      },
      data: {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; tagId: string } }
) {
  try {
    const user = await requireAuth();
    const { workspaceId: workspaceSlugOrId, tagId } = params;

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

    await db.tag.delete({
      where: {
        id: tagId,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}