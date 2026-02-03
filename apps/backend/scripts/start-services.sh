#!/bin/bash

# Start PostgreSQL if not running
if ! pg_isready -q 2>/dev/null; then
  echo "Starting PostgreSQL..."
  sudo service postgresql start
else
  echo "PostgreSQL is already running"
fi

# Start Redis if not running
if ! redis-cli ping > /dev/null 2>&1; then
  echo "Starting Redis..."
  sudo service redis-server start
else
  echo "Redis is already running"
fi

echo "Services ready!"
