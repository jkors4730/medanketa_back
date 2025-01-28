#!/usr/bin/env sh

# Load variables from .env file.
export $(cat ../../.env | grep -v ^# | xargs) >/dev/null

# pg_dump > ${db_name}.sql
PGPASSWORD="${DB_PASSWORD}" pg_dump -U $DB_USER -h localhost $DB_NAME > "${DB_NAME}.sql"