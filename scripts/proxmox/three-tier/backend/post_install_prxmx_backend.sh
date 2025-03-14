#!/bin/bash

# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Install python
sudo apt install -y python3 python3-venv python3-pip

# Change directory to the location of your JS code
cd /home/vagrant/spring2025-team05/server

# Setup virtual environment
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt

# Add environment variables to .env file
cp .template-env .env

sudo sed -i "s/NODE_ENV=/NODE_ENV=production/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/FQDN=/FQDN=$FQDN/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DBUSER=/DBUSER=$DBUSER/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DBPASS=/DBPASS=$DBPASS/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/DATABASE=/DATABASE=$DATABASE/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/OAUTH_CLIENT_ID=/OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID/" /home/vagrant/spring2025-team05/server/.env
sudo sed -i "s/OAUTH_CLIENT_SECRET=/OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET/" /home/vagrant/spring2025-team05/server/.env

# Start the server with nohup for persistence
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > server.log 2>&1 &