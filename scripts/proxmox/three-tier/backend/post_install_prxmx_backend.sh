#!/bin/bash

# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Install python
sudo apt install python3

# Change directory to the location of your JS code
cd /home/vagrant/spring2025-team05/server

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# TODO: Add environment variables to .env file
# cp .template-env .env
# sed...

# Start the server
uvicorn app:app --host 0.0.0.0 --port 8000