# 🌍 Arcadia News - Multilingual Global News Platform

Многоязычная новостная платформа, охватывающая глобальные события из 21 страны с системой вовлечения на основе блокчейна.

## 🚀 Возможности

- **21 страна** - Новости из США, России, Китая, Германии, Франции, Великобритании, Индии, Турции, Японии, Южной Кореи, Бразилии, Канады, Австралии, Италии, Испании, Нидерландов, Швеции, Швейцарии, Сингапура, ОАЭ, Саудовской Аравии
- **Многоязычность** - Поддержка английского, русского, китайского, немецкого, французского и многих других языков
- **Система ACD-токенов** - Внутренняя криптовалюта для взаимодействия с контентом
- **Категории новостей** - Политика, Экономика, Технологии, Спорт, Культура, Здоровье
- **Аутентификация** - Безопасная регистрация и вход пользователей
- **Создание статей** - Пользователи могут публиковать свои статьи
- **Система лайков** - Взаимодействие с контентом через лайки

## 🛠 Технологический стек

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **База данных**: PostgreSQL + Prisma ORM
- **Деплой**: Docker, Docker Compose
- **UI Components**: Radix UI, shadcn/ui

## 📦 Установка и запуск

### Локальная разработка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/MoroZzzzzzzzz/ArcaNews-23-10-2025.git
cd ArcaNews-23-10-2025
```

2. **Настройте переменные окружения**
```bash
cd nextjs_space
cp .env.example .env
# Отредактируйте .env и добавьте свои значения
```

3. **Установите зависимости**
```bash
yarn install
```

4. **Настройте базу данных**
```bash
yarn prisma generate
yarn prisma db push
```

5. **Запустите сервер разработки**
```bash
yarn dev
```

Приложение будет доступно на `http://localhost:3000`

### Docker деплой (Production)

1. **Подготовьте сервер**
```bash
chmod +x scripts/setup-vps.sh
./scripts/setup-vps.sh
```

2. **Запустите приложение**
```bash
docker-compose up -d
```

3. **Настройте Nginx и SSL (опционально)**
```bash
# См. инструкции в README_DOCKER.md
```

## 📁 Структура проекта

```
arcadia_news/
├── nextjs_space/          # Next.js приложение
│   ├── app/               # App Router pages
│   ├── components/        # React компоненты
│   ├── lib/               # Утилиты и конфигурация
│   ├── prisma/            # Схема базы данных
│   └── public/            # Статические файлы
├── nginx/                 # Конфигурация Nginx
├── scripts/               # Скрипты деплоя и бэкапа
└── docker-compose.yml     # Docker конфигурация
```

## 🔐 Переменные окружения

```env
# База данных
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# PostgreSQL
POSTGRES_USER="arcadia"
POSTGRES_PASSWORD="your-password"
POSTGRES_DB="arcadia_news"
```

## 🌐 Демо

Приложение развернуто на: [newsarca.abacusai.app](https://newsarca.abacusai.app)

## 📝 Учетные данные для тестирования

```
Email: test@arcadia.news
Password: test123456
```

## 🎨 Основные изменения

### Последние обновления:
- ✅ Удалена функция дизлайков
- ✅ Обновлено изображение ACD-монеты (обрезано по контуру)
- ✅ Категории новостей преобразованы в горизонтальный список
- ✅ Увеличен размер флагов в 2 раза
- ✅ Флаги отображаются в естественном контуре без рамок

## 📚 Дополнительная документация

- [Docker деплой](README_DOCKER.md) - Полное руководство по развертыванию
- [Prisma схема](nextjs_space/prisma/schema.prisma) - Структура базы данных

## 🤝 Вклад

Приветствуются pull request'ы! Для значительных изменений сначала откройте issue для обсуждения.

## 📄 Лицензия

MIT

## 👨‍💻 Автор

MoroZzzzzzzzz

---

**Arcadia News** - Ваш надежный источник глобальных новостей! 🌍📰
