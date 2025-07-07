#!/bin/bash

# Production Deployment Script
# AI Doctor & Virtual Hospital System - MVK Solutions

set -e

echo "🚀 Deploying AI Doctor System to Production..."

# Configuration
DEPLOY_ENV=${1:-production}
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo "📋 Deployment Environment: $DEPLOY_ENV"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current deployment
if [ -d "production" ]; then
    echo "💾 Creating backup..."
    cp -r production $BACKUP_DIR/
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Build production images
echo "🔨 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run migrate

# Update production environment
echo "🔄 Updating production environment..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 60

# Health checks
echo "🔍 Running health checks..."
./scripts/health-check.sh

# Cleanup old images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment completed successfully!"
echo "🌐 Production URL: https://aidoctor.mvksolutions.com"
echo "📊 Monitor: https://monitor.mvksolutions.com"