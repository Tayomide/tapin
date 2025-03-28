#!/bin/bash
echo "Starting MariaDB initialization..."

sed -i 's/^bind-address\s*=.*$/bind-address = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf

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