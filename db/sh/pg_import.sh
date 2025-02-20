#!/usr/bin/env sh

# Load variables from .env file.
# shellcheck disable=SC2046
# shellcheck disable=SC2002
export $(cat ../../.env | grep -v ^# | xargs) >/dev/null

# drop and create schema
PGPASSWORD="${DB_PASSWORD}" psql -U $DB_USER -h localhost -d $DB_NAME -c 'DROP SCHEMA public CASCADE;CREATE SCHEMA public;'
# import from ${db_name}.sql
PGPASSWORD="${DB_PASSWORD}" psql -U $DB_USER -h localhost $DB_NAME < "${DB_NAME}.sql"
