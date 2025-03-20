# Use Ubuntu as the base image
FROM ubuntu:latest

# Set up environment
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Set working directory
WORKDIR /workspace/client
