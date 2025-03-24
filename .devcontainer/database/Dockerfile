# Use Ubuntu as the base image
FROM ubuntu:latest

# Set up environment
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and dependencies
RUN apt-get update && \
    apt-get install -y mariadb-server && \
    apt-get install -y gettext && \
    apt-get clean

# Set working directory
WORKDIR /workspace/database

# Create env file in script if it doesn't exist