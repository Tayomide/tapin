#!/bin/bash

# Create and activate virtual environment
python3 -m venv /workspace/.venv

# Check platform and activate virtual environment accordingly
if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
  # For Linux or Mac
  source /workspace/.venv/bin/activate
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # For Windows
  source /workspace/.venv/Scripts/activate
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

# Install dependencies
pip install -r requirements-dev.txt

# Get the directory of the current script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create certificates using an absolute path
source "${SCRIPT_DIR}/../create_ssl_cert.sh"

# cd back to home dir
cd /workspace/server

# Create environment variables
cp --update=none .template-env .env

# Start server
python app.py