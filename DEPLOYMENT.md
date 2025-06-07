# Deployment Guide for MICE ID Inventory

This document outlines how to deploy the MICE ID Inventory application to a production server using Docker.

## Prerequisites

- Docker installed on your server
- Docker Compose installed on your server
- Git (optional, for cloning the repository)

## Deployment Steps

### 1. Get the Application Code

Either clone the repository or copy the application files to your server:

```bash
git clone https://your-repository-url/mice-id-inventory.git
cd mice-id-inventory
```

### 2. Build and Start the Docker Container

The simplest way to deploy is using Docker Compose:

```bash
docker-compose up -d
```

This command:
- Builds the Docker image as defined in the Dockerfile
- Starts the container in detached mode (-d)
- Maps port 3000 from the container to port 3000 on your host

### 3. Verify Deployment

Check if the container is running:

```bash
docker-compose ps
```

You should see the `mice-id-inventory` container listed as running.

You can also check the logs:

```bash
docker-compose logs -f
```

### 4. Access the Application

The application should now be accessible at:

```
http://your-server-ip:3000
```

## Managing the Deployment

### Stopping the Application

```bash
docker-compose down
```

### Restarting the Application

```bash
docker-compose restart
```

### Updating the Application

When you have updates to deploy:

1. Get the latest code
2. Rebuild and restart the containers:

```bash
docker-compose down
docker-compose up -d --build
```

## Configuring for Production

### Custom Domain and HTTPS

For a production environment, you should:

1. Set up a reverse proxy (like Nginx) in front of the application
2. Configure your domain to point to the server
3. Set up SSL/TLS certificates (e.g., using Let's Encrypt)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    
    # Proxy to the Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Container Won't Start

Check the logs for errors:

```bash
docker-compose logs
```

### Application Not Accessible

Make sure:
1. The container is running
2. Port 3000 is open in your firewall
3. Your server's security group/network allows traffic on port 3000

### For Other Issues

Check the container logs for detailed error messages:

```bash
docker-compose logs -f
```