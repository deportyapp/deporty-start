#!/bin/bash
# Quick Commands - Deporty App

echo "🚀 Deporty Quick Start Guide"
echo "=============================="
echo ""

# Desarrollo
echo "📦 Development"
echo "  npm run dev              # Start dev server"
echo "  npm run dev:docker       # Start with Docker Compose"
echo "  docker-compose up        # Same as above"
echo ""

# Testing
echo "🧪 Testing"
echo "  npm run test             # Run all tests"
echo "  npm run test:watch       # Watch mode"
echo "  npm run test -- --coverage  # With coverage report"
echo ""

# Linting
echo "🔍 Code Quality"
echo "  npm run lint             # Lint check"
echo "  npm run format           # Auto-format code"
echo "  npm run check            # Type check"
echo "  npm run check:watch      # Type check watch"
echo ""

# Build & Preview
echo "🏗️  Build & Production"
echo "  npm run build            # Build for production"
echo "  npm run preview          # Preview production build"
echo ""

# Docker
echo "🐳 Docker"
echo "  docker build -t deporty:1.0.0 ."
echo "  docker run -p 3000:3000 -e PUBLIC_SUPABASE_URL=... deporty:1.0.0"
echo ""

# Health Check
echo "🏥 Health Check"
echo "  curl http://localhost:3000/api/health"
echo ""

# Environment
echo "⚙️  Environment Setup"
echo "  1. Copy .env.example to .env.local"
echo "  2. Add your Supabase credentials"
echo "  3. npm install (if needed)"
echo "  4. npm run dev"
echo ""

# Useful patterns
echo "💡 Code Patterns"
echo ""
echo "Logger:"
echo "  import { createLogger } from '\$lib/server/logger';"
echo "  const logger = createLogger('MyComponent');"
echo "  logger.info('Message', { context: 'data' });"
echo ""

echo "Error Handling:"
echo "  import { errors, handleError } from '\$lib/server/errors';"
echo "  throw errors.validationError('Invalid input', { field: 'email' });"
echo ""

echo "Stores:"
echo "  import { user, loading, addNotification } from '\$lib/stores';"
echo "  addNotification('Success!', 'success');"
echo ""

echo "=============================="
echo "For more info, see IMPROVEMENTS.md and SETUP_COMPLETE.md"
