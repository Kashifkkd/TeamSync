# TeamSync - Next-Generation Project Management Platform

A comprehensive project management platform built with Next.js 15, featuring real-time collaboration, AI-powered insights, and advanced team management capabilities.

## 🚀 Features

### Core Functionality
- **Multi-tenant Workspaces** - Organize teams and projects with role-based access control
- **Advanced Task Management** - Kanban boards, list views, filters, and custom fields
- **Milestone & Sprint Tracking** - Visual progress tracking and sprint planning
- **Real-time Collaboration** - Live updates, comments, and @mentions
- **Time Tracking** - Built-in time logging and reporting
- **Team Management** - User roles, permissions, and team analytics

### Technical Highlights
- **Next.js 15** with App Router and React 19
- **TypeScript** throughout for type safety
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js** for authentication (OAuth + credentials)
- **shadcn/ui** components with Tailwind CSS
- **Real-time updates** with WebSockets/Pusher
- **Advanced validation** with Zod schemas
- **Responsive design** optimized for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Pusher (WebSockets)
- **File Uploads**: Cloudinary (optional)
- **Email**: Nodemailer
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── workspace/         # Workspace-specific pages
│   └── onboarding/        # User onboarding
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── auth-utils.ts     # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
└── hooks/                # Custom React hooks

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm

### 1. Clone and Install
```bash
git clone <repository-url>
cd team-sync
npm install
```

### 2. Environment Setup
Copy `env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/teamsync"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data (optional)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following key entities:

- **Users & Authentication** - User accounts, sessions, OAuth providers
- **Workspaces** - Multi-tenant workspace management
- **Projects** - Project organization with team assignments
- **Tasks** - Advanced task management with hierarchy support
- **Milestones** - Sprint and milestone tracking
- **Comments** - Threaded discussions and mentions
- **Time Tracking** - Time entries and reporting
- **Custom Fields** - Flexible metadata system
- **Activity Logs** - Audit trail and notifications

## 🔐 Authentication

TeamSync supports multiple authentication methods:

1. **Email/Password** - Traditional credentials with secure password hashing
2. **Google OAuth** - Sign in with Google account
3. **GitHub OAuth** - Sign in with GitHub account

### Demo Accounts (if seeded)
- **john@example.com** / password123 (Owner)
- **jane@example.com** / password123 (Admin)
- **mike@example.com** / password123 (Member)

## 📱 Key Features Deep Dive

### Workspace Management
- Create unlimited workspaces
- Role-based access control (Owner, Admin, Member, Viewer)
- Team member management and invitations
- Workspace-level settings and customization

### Project Organization
- Project creation with custom keys (e.g., PROJ-123)
- Color-coded organization
- Team member assignments with roles
- Progress tracking and analytics

### Advanced Task System
- Hierarchical tasks (epics, stories, tasks, subtasks)
- Multiple view modes (Kanban, List, Calendar)
- Custom fields and labels
- Advanced filtering and search
- Drag-and-drop task management

### Real-time Collaboration
- Live updates across all users
- Real-time commenting system
- @mentions and notifications
- Activity feeds and audit logs

### Time Tracking & Analytics
- Built-in time tracking
- Project and task-level reporting
- Team productivity analytics
- Burndown charts and velocity tracking

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface built with shadcn/ui
- **Dark/Light Mode** - System preference detection and manual toggle
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power user shortcuts for common actions
- **Accessibility** - WCAG 2.1 compliant with screen reader support

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production
```bash
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
# ... other OAuth and service credentials
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with demo data
```

### Adding New Features
1. Update Prisma schema if needed
2. Create/update API routes
3. Add validation schemas
4. Build UI components
5. Add tests and documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: [Coming soon]
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@teamsync.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core workspace and project management
- ✅ Task management with Kanban boards
- ✅ Team collaboration features
- ✅ Time tracking and basic analytics

### Phase 2 (Next)
- 🔄 Real-time collaboration with WebSockets
- 🔄 Advanced analytics and reporting
- 🔄 Mobile app (React Native)
- 🔄 API documentation and public API

### Phase 3 (Future)
- 📋 AI-powered task suggestions
- 📋 Advanced workflow automation
- 📋 Integrations (Slack, GitHub, etc.)
- 📋 White-label solutions

---

Built with ❤️ by the TeamSync team. Making project management simple and powerful for teams of all sizes.