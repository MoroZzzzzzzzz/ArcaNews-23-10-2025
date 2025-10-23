
#!/bin/bash

# Скрипт для быстрого деплоя на VPS
# Использование: ./scripts/quick-deploy.sh

set -e

echo "🚀 Quick Deploy Script for Arcadia News"
echo "========================================="
echo ""

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "Please run: sudo ./scripts/setup-vps.sh"
    exit 1
fi

# Загрузка переменных окружения
export $(grep -v '^#' .env | xargs)

# Проверка критичных переменных
if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" == "your_nextauth_secret_here_min_32_characters" ]; then
    echo "❌ Error: NEXTAUTH_SECRET is not configured!"
    echo "Generate one with: openssl rand -base64 32"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Остановка старых контейнеров
echo "🛑 Stopping old containers..."
docker-compose down || true

# Очистка старых образов (опционально)
read -p "🧹 Clean old Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -af --volumes
fi

# Сборка новых образов
echo "🔨 Building Docker images..."
docker-compose build --no-cache

# Запуск контейнеров
echo "🚀 Starting containers..."
docker-compose up -d

# Ожидание готовности базы данных
echo "⏳ Waiting for database to be ready..."
sleep 10

# Проверка статуса
echo "📊 Checking container status..."
docker-compose ps

# Просмотр логов
echo ""
echo "📋 Recent logs:"
docker-compose logs --tail=50

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Check logs: docker-compose logs -f"
echo "   2. Access your app: http://$(hostname -I | awk '{print $1}'):${APP_PORT:-3000}"
echo "   3. Monitor health: docker-compose ps"
echo ""
