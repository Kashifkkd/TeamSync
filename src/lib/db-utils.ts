import { db } from "./db"

// Utility function to safely execute Prisma queries
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await queryFn()
  } catch (error) {
    console.error("Database query error:", error)
    
    // If it's a prepared statement error, try to reconnect
    if (error instanceof Error && 
        (error.message.includes("prepared statement") || 
         error.message.includes("does not exist"))) {
      
      console.log("Attempting to reconnect to database...")
      
      try {
        // Disconnect and reconnect
        await db.$disconnect()
        await db.$connect()
        
        // Retry the query once
        return await queryFn()
      } catch (retryError) {
        console.error("Retry failed:", retryError)
        return fallback || null
      }
    }
    
    return fallback || null
  }
}

// Wrapper for common Prisma operations
export const safeDb = {
  user: {
    findUnique: (args: any) => safeDbQuery(() => db.user.findUnique(args)),
    findMany: (args: any) => safeDbQuery(() => db.user.findMany(args)),
    create: (args: any) => safeDbQuery(() => db.user.create(args)),
    update: (args: any) => safeDbQuery(() => db.user.update(args)),
    delete: (args: any) => safeDbQuery(() => db.user.delete(args)),
  },
  workspace: {
    findUnique: (args: any) => safeDbQuery(() => db.workspace.findUnique(args)),
    findMany: (args: any) => safeDbQuery(() => db.workspace.findMany(args)),
    create: (args: any) => safeDbQuery(() => db.workspace.create(args)),
    update: (args: any) => safeDbQuery(() => db.workspace.update(args)),
    delete: (args: any) => safeDbQuery(() => db.workspace.delete(args)),
  },
  project: {
    findUnique: (args: any) => safeDbQuery(() => db.project.findUnique(args)),
    findMany: (args: any) => safeDbQuery(() => db.project.findMany(args)),
    create: (args: any) => safeDbQuery(() => db.project.create(args)),
    update: (args: any) => safeDbQuery(() => db.project.update(args)),
    delete: (args: any) => safeDbQuery(() => db.project.delete(args)),
  },
  task: {
    findUnique: (args: any) => safeDbQuery(() => db.task.findUnique(args)),
    findMany: (args: any) => safeDbQuery(() => db.task.findMany(args)),
    create: (args: any) => safeDbQuery(() => db.task.create(args)),
    update: (args: any) => safeDbQuery(() => db.task.update(args)),
    delete: (args: any) => safeDbQuery(() => db.task.delete(args)),
  },
}
