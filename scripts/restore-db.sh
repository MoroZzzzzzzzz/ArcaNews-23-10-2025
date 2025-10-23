
#!/bin/bash

# Скрипт для восстановления базы данных из резервной копии
# Использование: ./scripts/restore-db.sh <backup_file.sql>

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Backup file not specified"
    echo "Usage: ./scripts/restore-db.sh <backup_file.sql>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

# Загрузка переменных окружения
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🔄 Starting database restore..."
echo "📁 Backup file: ${BACKUP_FILE}"

# Если файл сжат, распаковываем
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo "📦 Decompressing backup..."
    gunzip -k "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Восстановление из бэкапа
echo "🔄 Restoring database..."
docker-compose exec -T postgres psql \
    -U ${POSTGRES_USER:-arcadia} \
    ${POSTGRES_DB:-arcadia_news} < "${BACKUP_FILE}"

echo "✅ Database restored successfully!"
echo "✨ Restore process finished!"
