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

# Start the server with nohup for persistence
nohup python app.py > server.log 2>&1 &