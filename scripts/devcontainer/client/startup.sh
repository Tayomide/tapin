# run the npm install command to retrieve required express dependencies
npm install

# Get the directory of the current script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create certificates using an absolute path
source "${SCRIPT_DIR}/../create_ssl_cert.sh"

# cd back to home dir
cd /workspace/client

# Startup server
npm run dev