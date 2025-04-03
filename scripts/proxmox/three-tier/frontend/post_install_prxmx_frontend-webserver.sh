#!/bin/bash

# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Steps to add NodeJS repository to your Ubuntu Server for Node and NPM installation
# Remove and or replace with your required webserver stack
# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

# Change directory to the location of your JS code
cd /home/vagrant/spring2025-team05/client/

# Use NPM package manager to install needed dependecies to run our EJS app
# https://github.com/motdotla/dotenv -- create a .env file to pass environment variables
# dotenv mysql2 packages will be installed in the package.json file
sudo npm install -g --save express ejs pm2

# pm2.io is an applcation service manager for Javascript applications
# Using pm2 start the express js application as the user vagrant
sudo -u vagrant pm2 start index.js

# This creates your javascript application service file
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

# This saves which files we have already started -- so pm2 will 
# restart them at boot
sudo -u vagrant pm2 save

cp --update=none .template-env .env

sudo sed -i "s/OAUTH_CLIENT_ID=/OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/OAUTH_CLIENT_SECRET=/OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET/" /home/vagrant/spring2025-team05/server/.env
ESCAPED_OAUTH_REDIRECT_URI=$(printf '%s\n' "$OAUTH_REDIRECT_URI" | sed 's/[/&|]/\&/g')
sudo sed -i "s/OAUTH_REDIRECT_URI=/OAUTH_REDIRECT_URI=$ESCAPED_OAUTH_REDIRECT_URI/" /home/vagrant/spring2025-team05/server/.env
ESCAPED_BACKEND_HOST=$(printf '%s\n' "$BACKEND_HOST" | sed 's/[/&|]/\&/g')
sudo sed -i "s/BACKEND_HOST=/BACKEND_HOST=$ESCAPED_BACKEND_HOST/" /home/vagrant/spring2025-team05/server/.env