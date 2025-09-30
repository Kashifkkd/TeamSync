import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signUpSchema } from "@/lib/validations"
import { generateSlug } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Registration attempt:", { name: body.name, email: body.email })
    
    const validatedFields = signUpSchema.safeParse(body)

    if (!validatedFields.success) {
      console.log("Validation failed:", validatedFields.error.format())
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validatedFields.error.format() 
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log("User created:", user.id)

    // Create personal workspace
    const workspaceSlug = generateSlug(`${name}-workspace`)
    const workspace = await db.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug: workspaceSlug,
        creatorId: user.id,
      },
    })

    console.log("Workspace created:", workspace.id)

    // Add user as owner of their workspace
    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: "owner",
      },
    })

    console.log("Workspace member created")

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "User already exists with this email" },
          { status: 400 }
        )
      }
      
      if (error.message.includes("Connection") || error.message.includes("connect")) {
        return NextResponse.json(
          { error: "Database connection failed. Please check your database configuration." },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: "Something went wrong", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
