#!/bin/bash

# Backup Script for AI Doctor System
# MVK Solutions

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$BACKUP_DATE"

echo "💾 Creating backup: $BACKUP_DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
echo "📊 Backing up MongoDB..."
docker exec ai-doctor-mongodb mongodump --out /tmp/backup
docker cp ai-doctor-mongodb:/tmp/backup $BACKUP_DIR/mongodb

# Backup uploaded files
echo "📁 Backing up uploaded files..."
cp -r uploads $BACKUP_DIR/

# Backup configuration
echo "⚙️ Backing up configuration..."
cp -r server/.env $BACKUP_DIR/
cp -r nginx $BACKUP_DIR/

# Create archive
echo "📦 Creating archive..."
tar -czf "backup_$BACKUP_DATE.tar.gz" -C backups $BACKUP_DATE

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find backups -name "backup_*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed: backup_$BACKUP_DATE.tar.gz"