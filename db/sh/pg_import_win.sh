@echo off
setlocal enabledelayedexpansion

:: Загружаем переменные из .env
for /f "tokens=1,2 delims==" %%A in ('findstr /v "^#" ..\..\..\.env') do (
    set %%A=%%B
)

:: remove and recreate public shema in PostgreSQL
set PGPASSWORD=%DB_PASSWORD%
psql -U %DB_USER% -h localhost -d %DB_NAME% -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

:: import dump database
psql -U %DB_USER% -h localhost -d %DB_NAME% -f "%DB_NAME%.sql"

endlocal
