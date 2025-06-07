FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including serve globally
RUN npm install && \
    npm install -g serve

# Copy all project files
COPY . .

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 && \
    chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Start the application directly with serve, ensuring it binds to all interfaces
CMD ["serve", ".", "--listen", "tcp://0.0.0.0:3000", "--no-clipboard"]