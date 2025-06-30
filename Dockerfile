FROM node:18-slim

# Install system dependencies required for Playwright browsers
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxss1 \
    libgconf-2-4 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first (for better Docker caching)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs

# Expose port for health check
EXPOSE 3000

# Set environment variables for Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false

# Start the application
CMD ["npm", "start"]
