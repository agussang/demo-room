FROM php:8.0-cli

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    unzip \
    libicu-dev \
    && docker-php-ext-install \
    pdo_mysql \
    intl

# Copy the application code
COPY . /app

# Make the start-dev script executable
RUN chmod +x /app/start-dev.sh

# Expose port 8000
EXPOSE 8000

# Run the start-dev.sh script
CMD ["/app/start-dev.sh"]