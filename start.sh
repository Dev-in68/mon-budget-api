#!/bin/sh
echo "Starting application..."
if [ "$DATABASE_URL" ]; then
  echo "Generating Prisma client..."
  npx prisma generate || echo "Prisma generate failed, continuing..."
fi
node dist/src/main.js