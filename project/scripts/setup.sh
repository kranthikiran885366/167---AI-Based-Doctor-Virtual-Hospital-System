#!/bin/bash

# AI Doctor & Virtual Hospital Setup Script
# MVK Solutions

echo "🏥 Setting up AI Doctor & Virtual Hospital System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p ai-services/models
mkdir -p ai-services/uploads
mkdir -p server/uploads
mkdir -p nginx/ssl

# Copy environment file
if [ ! -f server/.env ]; then
    echo "📝 Creating environment file..."
    cp server/.env.example server/.env
    echo "⚠️  Please update server/.env with your configuration"
fi

# Set permissions
echo "🔐 Setting permissions..."
chmod +x scripts/*.sh
chmod 755 uploads
chmod 755 logs

# Build and start services
echo "🚀 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Display access information
echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   AI Services: http://localhost:8000"
echo "   MongoDB: mongodb://localhost:27017"
echo ""
echo "📚 Default credentials:"
echo "   Email: test@mvksolutions.com"
echo "   Password: test123"
echo ""
echo "📖 Documentation:"
echo "   API Docs: http://localhost:8000/docs"
echo "   Health Check: http://localhost:5000/api/health"
echo ""
echo "🛠️  Management commands:"
echo "   Stop services: docker-compose down"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo ""
echo "🏥 MVK Solutions - AI Doctor System is ready!"