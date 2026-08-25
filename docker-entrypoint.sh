#!/bin/sh
set -e

echo "Running migrations..."
npm run migration:prod

echo "Starting application..."
exec node dist/src/main.js