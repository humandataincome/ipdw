#!/bin/sh
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up --remove-orphans -d
