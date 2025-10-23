
#!/bin/bash

# Скрипт для резервного копирования базы данных
# Использование: ./scripts/backup-db.sh

set -e

# Конфигурация
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/arcadia_news_backup_${DATE}.sql"

# Загрузка переменных окружения
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Создание директории для бэкапов
mkdir -p "${BACKUP_DIR}"

echo "🔄 Starting database backup..."
echo "📁 Backup file: ${BACKUP_FILE}"

# Создание бэкапа
docker-compose exec -T postgres pg_dump \
    -U ${POSTGRES_USER:-arcadia} \
    ${POSTGRES_DB:-arcadia_news} > "${BACKUP_FILE}"

# Сжатие бэкапа
gzip "${BACKUP_FILE}"

echo "✅ Backup completed: ${BACKUP_FILE}.gz"

# Удаление старых бэкапов (старше 30 дней)
find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +30 -delete
echo "🧹 Old backups cleaned up"

echo "✨ Backup process finished!"
