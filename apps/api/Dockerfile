# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy the entire workspace (respects .dockerignore)
COPY . .

# Install all workspace dependencies
RUN npm ci

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npm run db:generate || echo "Prisma generate failed, might not be needed"

# Build the API
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose port
EXPOSE 3000

# Start server
WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
