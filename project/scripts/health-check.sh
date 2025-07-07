#!/bin/bash

# Health Check Script
# AI Doctor & Virtual Hospital System

echo "🔍 Running health checks..."

# Check frontend
echo "Checking frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

# Check backend API
echo "Checking backend API..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend API is healthy"
else
    echo "❌ Backend API is not responding"
    exit 1
fi

# Check AI services
echo "Checking AI services..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ AI services are healthy"
else
    echo "❌ AI services are not responding"
    exit 1
fi

# Check MongoDB
echo "Checking MongoDB..."
if docker exec ai-doctor-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is healthy"
else
    echo "❌ MongoDB is not responding"
    exit 1
fi

# Check Redis
echo "Checking Redis..."
if docker exec ai-doctor-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis is not responding"
    exit 1
fi

echo "🎉 All services are healthy!"