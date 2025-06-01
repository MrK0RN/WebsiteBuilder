#!/bin/bash

# PlasticDB Deployment Script
# This script automates the deployment process for your host

set -e

echo "🚀 Starting PlasticDB deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Please ensure PostgreSQL is installed."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create necessary directories
mkdir -p logs
mkdir -p ssl

# Set up environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cat > .env << EOL
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/plasticdb
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=plasticdb

# Application Configuration
NODE_ENV=production
PORT=3000

# Session Configuration (CHANGE THIS!)
SESSION_SECRET=$(openssl rand -base64 32)

# Optional: Authentication
# ISSUER_URL=https://replit.com/oidc
# REPL_ID=your-repl-id
# REPLIT_DOMAINS=yourdomain.com
EOL
    echo "✅ Environment file created. Please edit .env with your database credentials."
fi

# Database setup
echo "🗄️  Setting up database..."
if [ -n "$DATABASE_URL" ]; then
    npm run db:push
    echo "✅ Database schema updated"
else
    echo "⚠️  DATABASE_URL not set. Please configure your database connection in .env"
fi

# Check if PM2 is installed for process management
if command -v pm2 &> /dev/null; then
    echo "🔄 Starting application with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    echo "✅ Application started with PM2"
else
    echo "💡 PM2 not found. You can install it with: npm install -g pm2"
    echo "🏃 Starting application in development mode..."
    npm start &
    echo "✅ Application started on port 3000"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Configure your database connection in .env"
echo "2. Set up SSL certificates in the ssl/ directory"
echo "3. Configure your web server (Nginx/Apache) to proxy to port 3000"
echo "4. Update DNS records to point to your server"
echo ""
echo "Your PlasticDB application should be available at http://localhost:3000"