
# 🐳 Arcadia News - Docker Deployment Guide

Руководство по развертыванию проекта Arcadia News в Docker-контейнерах на VPS.

## 📋 Предварительные требования

- Docker версии 20.10 или выше
- Docker Compose версии 2.0 или выше
- VPS с минимум 2GB RAM и 20GB свободного места
- Открытые порты: 80, 443, 3000 (опционально), 5432 (опционально)

## 🚀 Быстрый старт

### 1. Клонирование проекта на VPS

```bash
cd /opt
git clone <your-repo-url> arcadia_news
cd arcadia_news
```

### 2. Настройка переменных окружения

Скопируйте файл примера и отредактируйте его:

```bash
cp .env.example .env
nano .env
```

**Обязательно измените следующие параметры:**

```env
# Безопасный пароль для PostgreSQL
POSTGRES_PASSWORD=your_very_secure_password_here

# NextAuth секрет (минимум 32 символа, сгенерируйте случайную строку)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# URL вашего приложения (замените на ваш домен)
NEXTAUTH_URL=https://your-domain.com
```

### 3. Подготовка Next.js для production

Обновите `nextjs_space/next.config.js`:

```bash
nano nextjs_space/next.config.js
```

Добавьте настройку для standalone режима:

```javascript
module.exports = {
  output: 'standalone',
  // ... остальные настройки
}
```

### 4. Запуск контейнеров

#### Базовый режим (без Nginx):

```bash
docker-compose up -d postgres nextjs
```

#### Production режим (с Nginx):

```bash
docker-compose --profile production up -d
```

### 5. Инициализация базы данных

После запуска контейнеров, выполните миграции Prisma:

```bash
docker-compose exec nextjs npx prisma migrate deploy
```

Если у вас есть seed-скрипт:

```bash
docker-compose exec nextjs npx prisma db seed
```

### 6. Проверка статуса

```bash
docker-compose ps
```

Все сервисы должны быть в статусе "Up (healthy)".

## 🔧 Управление контейнерами

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только Next.js
docker-compose logs -f nextjs

# Только PostgreSQL
docker-compose logs -f postgres
```

### Перезапуск сервисов

```bash
# Перезапустить все
docker-compose restart

# Перезапустить только Next.js
docker-compose restart nextjs
```

### Остановка и удаление контейнеров

```bash
# Остановить
docker-compose stop

# Остановить и удалить контейнеры (данные в volumes сохранятся)
docker-compose down

# Удалить контейнеры И volumes (ВНИМАНИЕ: удалит базу данных!)
docker-compose down -v
```

### Обновление приложения

```bash
# 1. Получить новый код
git pull

# 2. Пересобрать образы
docker-compose build nextjs

# 3. Перезапустить с новым образом
docker-compose up -d nextjs

# 4. Применить миграции БД (если есть)
docker-compose exec nextjs npx prisma migrate deploy
```

## 🌐 Настройка Nginx и SSL

### Вариант 1: Let's Encrypt с Certbot

1. Установите Certbot на хост-машине:

```bash
apt install certbot
```

2. Получите сертификат:

```bash
certbot certonly --standalone -d your-domain.com
```

3. Скопируйте сертификаты в проект:

```bash
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

4. Раскомментируйте HTTPS блок в `nginx/nginx.conf`

5. Перезапустите Nginx:

```bash
docker-compose restart nginx
```

### Вариант 2: Без Nginx (прямой доступ к Next.js)

Если не используете Nginx, откройте порт 3000:

```bash
# В .env установите
APP_PORT=3000

# Запустите без nginx
docker-compose up -d postgres nextjs
```

## 📊 Мониторинг и производительность

### Использование ресурсов

```bash
docker stats
```

### Проверка здоровья контейнеров

```bash
docker-compose ps
docker inspect arcadia_nextjs --format='{{json .State.Health}}'
```

### Резервное копирование базы данных

```bash
# Создать backup
docker-compose exec postgres pg_dump -U arcadia arcadia_news > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из backup
docker-compose exec -T postgres psql -U arcadia arcadia_news < backup.sql
```

## 🔒 Безопасность

### Рекомендации:

1. **Измените все пароли по умолчанию** в `.env`
2. **Используйте сильный NEXTAUTH_SECRET** (минимум 32 символа)
3. **Настройте firewall** на VPS:
   ```bash
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```
4. **Не открывайте порт PostgreSQL (5432)** наружу
5. **Используйте SSL/HTTPS** в production
6. **Регулярно обновляйте** Docker образы
7. **Настройте автоматические бэкапы** базы данных

## 🐛 Решение проблем

### Контейнер Next.js не запускается

```bash
# Проверьте логи
docker-compose logs nextjs

# Проверьте переменные окружения
docker-compose exec nextjs env | grep DATABASE_URL
```

### Ошибка подключения к БД

```bash
# Проверьте, что PostgreSQL запущен
docker-compose ps postgres

# Проверьте подключение
docker-compose exec nextjs nc -zv postgres 5432
```

### Нехватка памяти

```bash
# Увеличьте память для Docker
# В /etc/docker/daemon.json добавьте:
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  }
}
```

### Очистка неиспользуемых ресурсов

```bash
docker system prune -a --volumes
```

## 📝 Примеры команд

### Доступ к shell контейнера

```bash
# Next.js контейнер
docker-compose exec nextjs sh

# PostgreSQL контейнер
docker-compose exec postgres bash
```

### Выполнение команд Prisma

```bash
# Генерация Prisma Client
docker-compose exec nextjs npx prisma generate

# Создание миграции
docker-compose exec nextjs npx prisma migrate dev --name init

# Применение миграций
docker-compose exec nextjs npx prisma migrate deploy

# Prisma Studio (GUI для БД)
docker-compose exec nextjs npx prisma studio
```

## 🎯 Production Checklist

- [ ] Все пароли изменены на безопасные
- [ ] `NEXTAUTH_SECRET` сгенерирован и установлен
- [ ] `NEXTAUTH_URL` указывает на ваш домен
- [ ] SSL сертификаты установлены
- [ ] Nginx настроен и запущен
- [ ] Firewall настроен
- [ ] Миграции БД применены
- [ ] Резервное копирование настроено
- [ ] Логи проверены на ошибки
- [ ] Healthcheck'и проходят успешно

## 📞 Поддержка

При возникновении проблем проверьте:
1. Логи контейнеров: `docker-compose logs -f`
2. Статус контейнеров: `docker-compose ps`
3. Использование ресурсов: `docker stats`

---

**Версия:** 1.0  
**Последнее обновление:** 2025-10-23
