#!/bin/bash
echo "Starting MariaDB initialization..."

# Enabling MariaDB Service
service mariadb start

echo "MariaDB initialization complete!"

# Execute your SQL scripts
# -u root -p"${MARIADB_ROOT_PASSWORD}" -e

mysql < ./create-database.sql
mysql < ./create-table.sql
envsubst < ./create-user-with-permissions.sql | mysql
mysql < ./insert-records.sql

echo "SQL scripts executed!"

# # Keep the container running
# tail -f /dev/null