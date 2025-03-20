# Use Ubuntu as the base image
FROM ubuntu:latest

# Set up environment
ENV DEBIAN_FRONTEND=noninteractive

# Install Python and dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

# Set working directory
WORKDIR /workspace/server

# Create env file in script if it doesn't exist