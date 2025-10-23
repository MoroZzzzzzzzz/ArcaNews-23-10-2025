
#!/bin/sh
set -e

echo "🚀 Starting Arcadia News..."

# Wait for database to be ready (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
  echo "⏳ Waiting for database..."
  
  # Extract database host and port from DATABASE_URL
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  
  # Use defaults if extraction failed
  DB_HOST=${DB_HOST:-postgres}
  DB_PORT=${DB_PORT:-5432}
  
  until nc -z -v -w30 $DB_HOST $DB_PORT
  do
    echo "⏳ Waiting for database connection..."
    sleep 2
  done
  echo "✅ Database is ready!"

  # Run Prisma migrations
  echo "🔄 Running database migrations..."
  npx prisma migrate deploy || echo "⚠️  Migration failed or no migrations to apply"

  echo "✅ Database setup complete!"
else
  echo "⚠️  DATABASE_URL not set, skipping database setup"
fi

# Start the application
echo "🚀 Starting Next.js application..."
exec node server.js
