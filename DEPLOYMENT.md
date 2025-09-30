# TeamSync Deployment Guide

This guide covers deploying TeamSync to various platforms and environments.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/teamsync)

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-username/teamsync)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/teamsync)

## 📋 Prerequisites

- Node.js 18+ runtime
- PostgreSQL database (hosted or self-managed)
- Domain name (optional, for custom domains)

## 🔧 Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-32-character-secret-key"

# OAuth Providers (at least one recommended)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Optional Variables
```bash
# Email notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Real-time features
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"

# File uploads
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

## 🌐 Platform-Specific Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login and deploy
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables
   - Redeploy the application

3. **Database Setup**
   ```bash
   # Generate Prisma client for production
   npx prisma generate

   # Push schema to production database
   npx prisma db push
   ```

### Railway Deployment

1. **Connect Repository**
   - Visit [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your TeamSync repository

2. **Add PostgreSQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Copy the connection string

3. **Configure Environment Variables**
   - Go to your service settings
   - Add environment variables under "Variables"
   - Set `DATABASE_URL` to your PostgreSQL connection string

4. **Deploy**
   - Railway will automatically deploy on git push
   - Monitor deployment in the dashboard

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   # Build image
   docker build -t teamsync .

   # Run container
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e NEXTAUTH_SECRET="your-secret" \
     teamsync
   ```

### Self-Hosted (VPS/Server)

1. **Server Requirements**
   - Ubuntu 20.04+ or similar Linux distribution
   - Node.js 18+
   - PostgreSQL 12+
   - Nginx (for reverse proxy)
   - SSL certificate (Let's Encrypt recommended)

2. **Setup Process**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/teamsync.git
   cd teamsync

   # Install dependencies
   npm install

   # Setup environment
   cp env.example .env.local
   # Edit .env.local with your configuration

   # Setup database
   npm run db:push
   npm run db:seed  # Optional

   # Build application
   npm run build

   # Start with PM2
   npm install -g pm2
   pm2 start npm --name "teamsync" -- start
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🗄️ Database Providers

### Supabase (Recommended)
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Copy PostgreSQL connection string
4. Add to `DATABASE_URL` environment variable

### Railway PostgreSQL
1. In Railway project, add PostgreSQL database
2. Copy connection string from database settings
3. Use as `DATABASE_URL`

### Neon
1. Create account at [Neon](https://neon.tech)
2. Create database
3. Copy connection string
4. Use as `DATABASE_URL`

### PlanetScale (MySQL)
Note: Requires schema modifications for MySQL compatibility
1. Create account at [PlanetScale](https://planetscale.com)
2. Create database
3. Modify Prisma schema for MySQL
4. Use connection string as `DATABASE_URL`

## 🔒 Security Checklist

### Before Production
- [ ] Change default `NEXTAUTH_SECRET` to a secure random value
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for database connections
- [ ] Configure CORS properly
- [ ] Set up proper backup strategy
- [ ] Enable monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up error reporting (Sentry, Bugsnag)

### OAuth Setup
- [ ] Configure OAuth redirect URLs for production domain
- [ ] Restrict OAuth app permissions to minimum required
- [ ] Use environment-specific OAuth apps (dev/staging/prod)

### Database Security
- [ ] Use connection pooling
- [ ] Enable database SSL
- [ ] Regular database backups
- [ ] Monitor database performance
- [ ] Set up database access logs

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Add to your deployment
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### Database Monitoring
- Enable slow query logging
- Set up connection pool monitoring
- Monitor database size and growth
- Set up automated backups

### Performance Monitoring
- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Set up uptime monitoring
- Configure error alerting

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Test database connection
   npx prisma db pull
   
   # Check connection string format
   # postgresql://user:password@host:port/database?sslmode=require
   ```

2. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Regenerate Prisma client
   npx prisma generate
   
   # Rebuild
   npm run build
   ```

3. **Environment Variables Not Loading**
   - Ensure `.env.local` is not in `.gitignore` for local development
   - For production, set variables in deployment platform
   - Restart application after changing variables

4. **OAuth Issues**
   - Verify redirect URLs match exactly
   - Check OAuth app configuration
   - Ensure `NEXTAUTH_URL` is set correctly

### Getting Help

- **Documentation**: [TeamSync Docs](https://teamsync-docs.vercel.app)
- **GitHub Issues**: [Report Issues](https://github.com/your-username/teamsync/issues)
- **Community**: [Discord Server](https://discord.gg/teamsync)
- **Email Support**: support@teamsync.com

---

## 📈 Scaling Considerations

### Database Scaling
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Database partitioning for large datasets
- Regular maintenance and optimization

### Application Scaling
- Horizontal scaling with load balancers
- CDN for static assets
- Redis for session storage and caching
- Background job processing (Bull Queue)

### Monitoring at Scale
- Application Performance Monitoring (APM)
- Log aggregation (ELK Stack, Datadog)
- Real-time alerting
- Capacity planning and forecasting

Happy deploying! 🚀
