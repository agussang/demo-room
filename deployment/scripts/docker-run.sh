#!/bin/bash

# Stop and remove any existing container with the same name
docker stop mice-id-inventory 2>/dev/null || true
docker rm mice-id-inventory 2>/dev/null || true

# Build the Docker image
echo "Building Docker image..."
docker build -t mice-id-inventory .

# Run the Docker container
echo "Starting Docker container..."
docker run -d --name mice-id-inventory -p 3000:3000 mice-id-inventory

# Show container status
echo "Container status:"
docker ps | grep mice-id-inventory

echo -e "\nApplication should be running at http://localhost:3000"
echo "To check container logs, run: docker logs -f mice-id-inventory"