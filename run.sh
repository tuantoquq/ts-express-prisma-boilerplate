#!/bin/bash

# if run with production mode
if [ "${1}" = "production" ]; then
  echo "Starting in production mode"

  prisma migrate deploy

  node dist/index.js
fi

# if run with
# development mode
if [ "${1}" = "development" ]; then
  echo "Starting in development mode"

  yarn prisma migrate dev

  yarn start:dev
fi
