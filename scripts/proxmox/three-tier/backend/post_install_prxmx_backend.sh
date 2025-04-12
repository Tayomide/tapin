#!/bin/bash

# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Install python
sudo apt install -y python3 python3-venv python3-pip

# Steps to add NodeJS repository to your Ubuntu Server for Node and NPM installation
# Remove and or replace with your required webserver stack
# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

# Use NPM package manager to install needed dependecies to run our EJS app
# https://github.com/motdotla/dotenv -- create a .env file to pass environment variables
# dotenv mysql2 packages will be installed in the package.json file
sudo npm install -g --save express ejs pm2

# Change directory to the location of your JS code
cd /home/vagrant/spring2025-team05/server

# Setup virtual environment
python3 -m venv venv
# . venv/bin/activate
./venv/bin/pip install -r requirements.txt


cp --update=none .template-env .env

sudo sed -i "s/PORT=/PORT=$PORT/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DATABASE_HOST=/DATABASE_HOST=$DATABASE_HOST/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DATABASE_USER=/DATABASE_USER=$DATABASE_USER/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DATABASE_PASSWORD=/DATABASE_PASSWORD=$DATABASE_PASSWORD/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DATABASE_NAME=/DATABASE_NAME=$DATABASE_NAME/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/OAUTH_CLIENT_ID=/OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/OAUTH_CLIENT_SECRET=/OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET/" /home/vagrant/spring2025-team05/server/.env
ESCAPED_OAUTH_REDIRECT_URI=$(printf '%s\n' "$OAUTH_REDIRECT_URI" | sed 's/[/&|]/\&/g')
sudo sed -i "s/OAUTH_REDIRECT_URI=/OAUTH_REDIRECT_URI=$ESCAPED_OAUTH_REDIRECT_URI/" /home/vagrant/spring2025-team05/server/.env
ESCAPED_SECRET_KEY=$(printf '%s\n' "$SECRET_KEY" | sed 's/[/&|]/\&/g')
sudo sed -i "s/SECRET_KEY=/SECRET_KEY=$ESCAPED_SECRET_KEY/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/EXPIRES_IN=/EXPIRES_IN=$EXPIRES_IN/" /home/vagrant/spring2025-team05/server/.env

sudo -u vagrant pm2 start "./venv/bin/python3 app.py" --name server

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

sudo -u vagrant pm2 save