#!/bin/bash

# TeamSync Setup Script
# This script helps you set up the TeamSync project management platform

set -e

echo "🚀 Welcome to TeamSync Setup!"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION is installed"
        
        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Please upgrade."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
}

# Check if PostgreSQL is installed
check_postgres() {
    if command -v psql &> /dev/null; then
        POSTGRES_VERSION=$(psql --version | awk '{print $3}')
        print_success "PostgreSQL $POSTGRES_VERSION is installed"
    else
        print_warning "PostgreSQL not found. Please install PostgreSQL or use a hosted solution."
        echo "  - macOS: brew install postgresql"
        echo "  - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        echo "  - Or use a hosted service like Supabase, Railway, or Neon"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Setup environment file
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        cp env.example .env.local
        print_success "Created .env.local from template"
        print_warning "Please edit .env.local with your actual configuration values"
    else
        print_warning ".env.local already exists, skipping..."
    fi
}

# Generate NextAuth secret
generate_secret() {
    if command -v openssl &> /dev/null; then
        SECRET=$(openssl rand -base64 32)
        print_status "Generated NextAuth secret: $SECRET"
        print_warning "Add this to your .env.local file: NEXTAUTH_SECRET=\"$SECRET\""
    else
        print_warning "OpenSSL not found. Please generate a random secret for NEXTAUTH_SECRET"
        print_warning "You can use: https://generate-secret.vercel.app/32"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env.local; then
        print_status "Generating Prisma client..."
        npx prisma generate
        
        print_status "Pushing database schema..."
        npx prisma db push --accept-data-loss
        
        print_success "Database schema created successfully"
        
        # Ask if user wants to seed data
        echo
        read -p "Do you want to seed the database with demo data? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Seeding database with demo data..."
            npm run db:seed
            print_success "Database seeded successfully"
            echo
            print_success "Demo accounts created:"
            echo "  - john@example.com (Owner) - password: password123"
            echo "  - jane@example.com (Admin) - password: password123" 
            echo "  - mike@example.com (Member) - password: password123"
        fi
    else
        print_warning "DATABASE_URL not configured in .env.local"
        print_warning "Please add your PostgreSQL connection string and run:"
        print_warning "  npm run db:push"
        print_warning "  npm run db:seed (optional)"
    fi
}

# Main setup function
main() {
    echo
    print_status "Starting TeamSync setup process..."
    echo
    
    # Run checks
    check_node
    check_postgres
    echo
    
    # Setup project
    install_dependencies
    echo
    
    setup_env
    echo
    
    generate_secret
    echo
    
    setup_database
    echo
    
    print_success "🎉 TeamSync setup completed!"
    echo
    echo "Next steps:"
    echo "1. Edit .env.local with your configuration"
    echo "2. Start the development server: npm run dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo
    echo "Documentation: https://github.com/your-repo/teamsync"
    echo "Issues: https://github.com/your-repo/teamsync/issues"
    echo
    print_success "Happy project managing! 🚀"
}

# Run main function
main
