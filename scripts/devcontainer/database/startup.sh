#!/bin/bash
echo "Starting MariaDB initialization..."

sed -i 's/^bind-address\s*=.*$/bind-address = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf

# Enabling MariaDB Service
service mariadb start

echo "MariaDB initialization complete!"

# Execute your SQL scripts
# -u root -p"${MARIADB_ROOT_PASSWORD}" -e

envsubst < ./create-database.sql | mysql
envsubst < ./create-table.sql | mysql
envsubst < ./create-user-with-permissions.sql | mysql
envsubst < ./insert-records.sql | mysql

echo "SQL scripts executed!"

# # Keep the container running
# tail -f /dev/null