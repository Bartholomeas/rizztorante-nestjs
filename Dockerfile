FROM node:22-alpine AS base

# Add build dependencies for bcrypt
RUN apk add --no-cache python3 make g++ build-base
RUN npm install -g pnpm

# Single stage build to avoid module copying issues
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and force rebuild bcrypt
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "dist/src/main.js"]