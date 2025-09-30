import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const john = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      bio: 'Product Manager passionate about building great user experiences.',
    },
  })

  const jane = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      bio: 'Full-stack developer with expertise in React and Node.js.',
    },
  })

  const mike = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedPassword,
      bio: 'UI/UX Designer focused on creating intuitive interfaces.',
    },
  })

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      description: 'A demo workspace for showcasing TeamSync features',
      creatorId: john.id,
    },
  })

  // Add users to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: john.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: john.id,
      role: 'owner',
    },
  })

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: jane.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: jane.id,
      role: 'admin',
    },
  })

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: mike.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: mike.id,
      role: 'member',
    },
  })

  // Create demo labels
  const bugLabel = await prisma.label.upsert({
    where: { workspaceId_name: { workspaceId: workspace.id, name: 'Bug' } },
    update: {},
    create: {
      name: 'Bug',
      color: '#ef4444',
      description: 'Something that needs to be fixed',
      workspaceId: workspace.id,
    },
  })

  const featureLabel = await prisma.label.upsert({
    where: { workspaceId_name: { workspaceId: workspace.id, name: 'Feature' } },
    update: {},
    create: {
      name: 'Feature',
      color: '#10b981',
      description: 'New feature or enhancement',
      workspaceId: workspace.id,
    },
  })

  const urgentLabel = await prisma.label.upsert({
    where: { workspaceId_name: { workspaceId: workspace.id, name: 'Urgent' } },
    update: {},
    create: {
      name: 'Urgent',
      color: '#f59e0b',
      description: 'Needs immediate attention',
      workspaceId: workspace.id,
    },
  })

  // Create demo projects
  const webProject = await prisma.project.upsert({
    where: { workspaceId_key: { workspaceId: workspace.id, key: 'WEB' } },
    update: {},
    create: {
      name: 'Website Redesign',
      key: 'WEB',
      description: 'Complete redesign of the company website with modern UI/UX',
      status: 'active',
      priority: 'high',
      color: '#3b82f6',
      workspaceId: workspace.id,
      creatorId: john.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
    },
  })

  const mobileProject = await prisma.project.upsert({
    where: { workspaceId_key: { workspaceId: workspace.id, key: 'MOB' } },
    update: {},
    create: {
      name: 'Mobile App',
      key: 'MOB',
      description: 'Native mobile application for iOS and Android',
      status: 'active',
      priority: 'medium',
      color: '#10b981',
      workspaceId: workspace.id,
      creatorId: jane.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
    },
  })

  // Add project members
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: webProject.id,
        userId: john.id,
      },
    },
    update: {},
    create: {
      projectId: webProject.id,
      userId: john.id,
      role: 'lead',
    },
  })

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: webProject.id,
        userId: mike.id,
      },
    },
    update: {},
    create: {
      projectId: webProject.id,
      userId: mike.id,
      role: 'member',
    },
  })

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: mobileProject.id,
        userId: jane.id,
      },
    },
    update: {},
    create: {
      projectId: mobileProject.id,
      userId: jane.id,
      role: 'lead',
    },
  })

  // Create demo milestones
  const milestone1 = await prisma.milestone.create({
    data: {
      name: 'Design Phase',
      description: 'Complete all design mockups and prototypes',
      type: 'milestone',
      status: 'completed',
      projectId: webProject.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-15'),
      progress: 100,
    },
  })

  const milestone2 = await prisma.milestone.create({
    data: {
      name: 'Development Sprint 1',
      description: 'Implement core functionality and basic UI components',
      type: 'sprint',
      status: 'active',
      projectId: webProject.id,
      startDate: new Date('2024-02-16'),
      endDate: new Date('2024-03-15'),
      progress: 65,
      sprintGoal: 'Build foundation for the new website architecture',
      capacity: 40,
    },
  })

  // Get next task numbers for projects
  const webTaskCount = await prisma.task.count({
    where: { projectId: webProject.id },
  })
  const mobTaskCount = await prisma.task.count({
    where: { projectId: mobileProject.id },
  })

  // Create demo tasks
  const tasks = [
    {
      title: 'Create homepage wireframes',
      description: 'Design wireframes for the new homepage layout including hero section, features, and call-to-action areas.',
      status: 'done',
      priority: 'high',
      type: 'task',
      projectId: webProject.id,
      creatorId: john.id,
      assigneeId: mike.id,
      milestoneId: milestone1.id,
      number: webTaskCount + 1,
      storyPoints: 5,
      originalEstimate: 480, // 8 hours
    },
    {
      title: 'Implement responsive navigation',
      description: 'Build a responsive navigation component that works across all device sizes.',
      status: 'in_progress',
      priority: 'high',
      type: 'feature',
      projectId: webProject.id,
      creatorId: john.id,
      assigneeId: jane.id,
      milestoneId: milestone2.id,
      number: webTaskCount + 2,
      storyPoints: 8,
      originalEstimate: 720, // 12 hours
    },
    {
      title: 'Fix mobile menu overlay issue',
      description: 'The mobile menu overlay is not properly covering the content on iOS Safari.',
      status: 'todo',
      priority: 'medium',
      type: 'bug',
      projectId: webProject.id,
      creatorId: mike.id,
      assigneeId: jane.id,
      number: webTaskCount + 3,
      storyPoints: 3,
      originalEstimate: 240, // 4 hours
    },
    {
      title: 'Set up project architecture',
      description: 'Initialize React Native project with proper folder structure and dependencies.',
      status: 'done',
      priority: 'high',
      type: 'task',
      projectId: mobileProject.id,
      creatorId: jane.id,
      assigneeId: jane.id,
      number: mobTaskCount + 1,
      storyPoints: 5,
      originalEstimate: 360, // 6 hours
    },
    {
      title: 'Design app icon and splash screen',
      description: 'Create app icon and splash screen designs for both iOS and Android platforms.',
      status: 'in_review',
      priority: 'medium',
      type: 'task',
      projectId: mobileProject.id,
      creatorId: jane.id,
      assigneeId: mike.id,
      number: mobTaskCount + 2,
      storyPoints: 3,
      originalEstimate: 300, // 5 hours
    },
  ]

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    })
  }

  // Create task labels
  const webTasks = await prisma.task.findMany({
    where: { projectId: webProject.id },
  })

  // Add labels to tasks
  await prisma.taskLabel.create({
    data: {
      taskId: webTasks.find(t => t.type === 'bug')!.id,
      labelId: bugLabel.id,
    },
  })

  await prisma.taskLabel.create({
    data: {
      taskId: webTasks.find(t => t.type === 'feature')!.id,
      labelId: featureLabel.id,
    },
  })

  await prisma.taskLabel.create({
    data: {
      taskId: webTasks.find(t => t.priority === 'high')!.id,
      labelId: urgentLabel.id,
    },
  })

  // Create some comments
  const inProgressTask = webTasks.find(t => t.status === 'in_progress')
  if (inProgressTask) {
    await prisma.comment.create({
      data: {
        content: 'Started working on this. The navigation structure is more complex than initially thought.',
        authorId: jane.id,
        taskId: inProgressTask.id,
      },
    })

    await prisma.comment.create({
      data: {
        content: 'Let me know if you need help with the mobile breakpoints!',
        authorId: mike.id,
        taskId: inProgressTask.id,
      },
    })
  }

  // Create some time entries
  const completedTask = webTasks.find(t => t.status === 'done')
  if (completedTask) {
    await prisma.timeEntry.create({
      data: {
        description: 'Initial wireframe sketches',
        duration: 180, // 3 hours
        date: new Date('2024-01-15'),
        userId: mike.id,
        taskId: completedTask.id,
      },
    })

    await prisma.timeEntry.create({
      data: {
        description: 'Detailed wireframes in Figma',
        duration: 300, // 5 hours
        date: new Date('2024-01-16'),
        userId: mike.id,
        taskId: completedTask.id,
      },
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Demo users created:`)
  console.log(`   - john@example.com (password: password123) - Owner`)
  console.log(`   - jane@example.com (password: password123) - Admin`)
  console.log(`   - mike@example.com (password: password123) - Member`)
  console.log(`🏢 Workspace: acme-corp`)
  console.log(`📁 Projects: ${webProject.name}, ${mobileProject.name}`)
  console.log(`📋 Tasks: ${tasks.length} demo tasks created`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
