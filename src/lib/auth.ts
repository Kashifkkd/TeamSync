import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signInSchema } from "@/lib/validations"

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const validatedFields = signInSchema.safeParse(credentials)
        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await db.user.findUnique({
          where: { email },
          include: {
            workspaceMembers: {
              include: {
                workspace: true,
              },
            },
          },
        })

        if (!user) {
          return null
        }

        // For OAuth users, we don't have a password
        if (!user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email!
        session.user.image = token.picture
      }

      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            return true
          }

          // Create new user for OAuth
          await db.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              image: user.image,
              emailVerified: new Date(),
            },
          })

          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }

      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Create a personal workspace for new users
      const workspace = await db.workspace.create({
        data: {
          name: `${user.name}'s Workspace`,
          slug: `${user.name?.toLowerCase().replace(/\s+/g, "-")}-workspace`,
          creatorId: user.id!,
        },
      })

      // Add user as owner of their workspace
      await db.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id!,
          role: "owner",
        },
      })
    },
  },
})
