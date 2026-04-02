FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Install Node.js (v20)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Install playwright browsers
RUN npx playwright install chromium

# Start the background worker
CMD ["npm", "run", "worker"]
