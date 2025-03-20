#!/bin/bash

# Create a directory
mkdir /workspace/ssl

# Change directory
cd /workspace/ssl

# Generate a private key
openssl genrsa -out devcontainer.key 2048

# Generate a certificate signing request (CSR)
openssl req -new -key devcontainer.key -out devcontainer.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Generate the certificate
openssl x509 -req -days 365 -in devcontainer.csr -signkey devcontainer.key -out devcontainer.crt
