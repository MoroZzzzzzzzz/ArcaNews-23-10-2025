
#!/bin/bash

# Скрипт для первоначальной настройки VPS
# Использование: sudo ./scripts/setup-vps.sh

set -e

echo "🚀 Setting up VPS for Arcadia News..."

# Обновление системы
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Установка Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Добавление текущего пользователя в группу docker
    usermod -aG docker ${SUDO_USER:-$USER}
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Установка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Установка дополнительных утилит
echo "📦 Installing additional utilities..."
apt install -y git curl wget nano htop ncdu ufw netcat-openbsd

# Настройка Firewall
echo "🔒 Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
echo "✅ Firewall configured"

# Создание директории для проекта
PROJECT_DIR="/opt/arcadia_news"
if [ ! -d "${PROJECT_DIR}" ]; then
    echo "📁 Creating project directory..."
    mkdir -p "${PROJECT_DIR}"
    chown ${SUDO_USER:-$USER}:${SUDO_USER:-$USER} "${PROJECT_DIR}"
fi

# Настройка автоматических обновлений безопасности
echo "🔒 Setting up automatic security updates..."
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Настройка swap (если меньше 4GB RAM)
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
if [ ${TOTAL_MEM} -lt 4096 ] && [ ! -f /swapfile ]; then
    echo "💾 Creating swap file (2GB)..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    echo "✅ Swap file created"
fi

echo ""
echo "✨ VPS setup completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Clone your project: cd ${PROJECT_DIR} && git clone <your-repo>"
echo "   2. Copy .env.example to .env and configure it"
echo "   3. Run: docker-compose up -d"
echo ""
echo "⚠️  Important: Logout and login again for Docker group changes to take effect"
