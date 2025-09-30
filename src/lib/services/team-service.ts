import { db } from "@/lib/db"
import { 
  WorkspaceRole, 
  ProjectRole, 
  MemberStatus, 
  InviteStatus,
  InviteWorkspaceMemberRequest,
  InviteProjectMemberRequest,
  WorkspaceMemberWithUser,
  ProjectMemberWithUser,
  WorkspaceInviteWithDetails,
  ProjectInviteWithDetails,
  canCreateProject,
  canInviteMembers,
  canManageMembers
} from "@/lib/types/team"
import { MEMBER_STATUS, INVITE_STATUS } from "@/lib/constants"
import { randomBytes } from "crypto"

export class TeamService {
  // Workspace Member Management
  static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberWithUser[]> {
    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    })

    return members.map(member => ({
      id: member.id,
      role: member.role as WorkspaceRole,
      status: member.status as MemberStatus,
      joinedAt: member.joinedAt,
      invitedAt: member.invitedAt,
      invitedBy: member.invitedBy,
      user: member.user,
      inviter: member.inviter,
    }))
  }

  static async inviteWorkspaceMember(
    workspaceId: string,
    inviterId: string,
    inviterRole: WorkspaceRole,
    data: InviteWorkspaceMemberRequest
  ): Promise<WorkspaceInviteWithDetails> {
    // Check permissions
    if (!canInviteMembers(inviterRole)) {
      throw new Error('Insufficient permissions to invite members')
    }

    // Check if user already exists in workspace
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        user: { email: data.email }
      }
    })

    if (existingMember) {
      throw new Error('User is already a member of this workspace')
    }

    // Check for existing pending invite
    const existingInvite = await db.workspaceInvite.findFirst({
      where: {
        workspaceId,
        email: data.email,
        status: INVITE_STATUS.PENDING
      }
    })

    if (existingInvite) {
      throw new Error('User already has a pending invitation')
    }

    // Create invite
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invite = await db.workspaceInvite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt,
        workspaceId,
        invitedBy: inviterId,
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role as WorkspaceRole,
      status: invite.status as InviteStatus,
      token: invite.token,
      expiresAt: invite.expiresAt,
      invitedAt: invite.invitedAt,
      acceptedAt: invite.acceptedAt,
      inviter: invite.inviter,
    }
  }

  static async acceptWorkspaceInvite(token: string, userId: string): Promise<void> {
    const invite = await db.workspaceInvite.findUnique({
      where: { token },
      include: { workspace: true }
    })

    if (!invite) {
      throw new Error('Invalid invitation token')
    }

    if (invite.status !== INVITE_STATUS.PENDING) {
      throw new Error('Invitation has already been processed')
    }

    if (invite.expiresAt < new Date()) {
      throw new Error('Invitation has expired')
    }

    // Create workspace member
    await db.workspaceMember.create({
      data: {
        workspaceId: invite.workspaceId,
        userId,
        role: invite.role,
        status: MEMBER_STATUS.ACTIVE,
        invitedAt: invite.invitedAt,
        invitedBy: invite.invitedBy,
      }
    })

    // Update invite status
    await db.workspaceInvite.update({
      where: { id: invite.id },
      data: {
        status: INVITE_STATUS.ACCEPTED,
        acceptedAt: new Date(),
      }
    })
  }

  static async updateWorkspaceMemberRole(
    workspaceId: string,
    memberId: string,
    newRole: WorkspaceRole,
    updaterRole: WorkspaceRole
  ): Promise<void> {
    if (!canManageMembers(updaterRole)) {
      throw new Error('Insufficient permissions to manage members')
    }

    await db.workspaceMember.update({
      where: { id: memberId },
      data: { role: newRole }
    })
  }

  static async removeWorkspaceMember(
    workspaceId: string,
    memberId: string,
    removerRole: WorkspaceRole
  ): Promise<void> {
    if (!canManageMembers(removerRole)) {
      throw new Error('Insufficient permissions to remove members')
    }

    await db.workspaceMember.delete({
      where: { id: memberId }
    })
  }

  // Project Member Management
  static async getProjectMembers(projectId: string): Promise<ProjectMemberWithUser[]> {
    const members = await db.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    })

    return members.map(member => ({
      id: member.id,
      role: member.role as ProjectRole,
      status: member.status as MemberStatus,
      joinedAt: member.joinedAt,
      invitedAt: member.invitedAt,
      invitedBy: member.invitedBy,
      user: member.user,
      inviter: member.inviter,
    }))
  }

  static async inviteProjectMember(
    projectId: string,
    inviterId: string,
    inviterRole: ProjectRole,
    data: InviteProjectMemberRequest
  ): Promise<ProjectInviteWithDetails> {
    // Check permissions
    if (inviterRole !== 'admin') {
      throw new Error('Only project admins can invite members')
    }

    // Check if user already exists in project
    const existingMember = await db.projectMember.findFirst({
      where: {
        projectId,
        user: { email: data.email }
      }
    })

    if (existingMember) {
      throw new Error('User is already a member of this project')
    }

    // Check for existing pending invite
    const existingInvite = await db.projectInvite.findFirst({
      where: {
        projectId,
        email: data.email,
        status: INVITE_STATUS.PENDING
      }
    })

    if (existingInvite) {
      throw new Error('User already has a pending invitation')
    }

    // Create invite
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invite = await db.projectInvite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt,
        projectId,
        invitedBy: inviterId,
      },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role as ProjectRole,
      status: invite.status as InviteStatus,
      token: invite.token,
      expiresAt: invite.expiresAt,
      invitedAt: invite.invitedAt,
      acceptedAt: invite.acceptedAt,
      inviter: invite.inviter,
    }
  }

  static async acceptProjectInvite(token: string, userId: string): Promise<void> {
    const invite = await db.projectInvite.findUnique({
      where: { token },
      include: { project: true }
    })

    if (!invite) {
      throw new Error('Invalid invitation token')
    }

    if (invite.status !== INVITE_STATUS.PENDING) {
      throw new Error('Invitation has already been processed')
    }

    if (invite.expiresAt < new Date()) {
      throw new Error('Invitation has expired')
    }

    // Create project member
    await db.projectMember.create({
      data: {
        projectId: invite.projectId,
        userId,
        role: invite.role,
        status: MEMBER_STATUS.ACTIVE,
        invitedAt: invite.invitedAt,
        invitedBy: invite.invitedBy,
      }
    })

    // Update invite status
    await db.projectInvite.update({
      where: { id: invite.id },
      data: {
        status: INVITE_STATUS.ACCEPTED,
        acceptedAt: new Date(),
      }
    })
  }

  static async updateProjectMemberRole(
    projectId: string,
    memberId: string,
    newRole: ProjectRole,
    updaterRole: ProjectRole
  ): Promise<void> {
    if (updaterRole !== 'admin') {
      throw new Error('Only project admins can manage members')
    }

    await db.projectMember.update({
      where: { id: memberId },
      data: { role: newRole }
    })
  }

  static async removeProjectMember(
    projectId: string,
    memberId: string,
    removerRole: ProjectRole
  ): Promise<void> {
    if (removerRole !== 'admin') {
      throw new Error('Only project admins can remove members')
    }

    await db.projectMember.delete({
      where: { id: memberId }
    })
  }

  // Permission checking
  static async getUserWorkspaceRole(workspaceId: string, userId: string): Promise<WorkspaceRole | null> {
    const member = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        status: MEMBER_STATUS.ACTIVE
      }
    })

    return member?.role as WorkspaceRole || null
  }

  static async getUserProjectRole(projectId: string, userId: string): Promise<ProjectRole | null> {
    const member = await db.projectMember.findFirst({
      where: {
        projectId,
        userId,
        status: MEMBER_STATUS.ACTIVE
      }
    })

    return member?.role as ProjectRole || null
  }

  // Project creation permission check
  static async canUserCreateProject(workspaceId: string, userId: string): Promise<boolean> {
    const role = await this.getUserWorkspaceRole(workspaceId, userId)
    return role ? canCreateProject(role) : false
  }
}
