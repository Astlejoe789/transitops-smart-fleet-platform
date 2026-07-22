# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy the entire workspace (respects .dockerignore)
COPY . .

# Install dependencies
RUN npm ci

# Build the Web app
WORKDIR /app/apps/web
# Setup dummy env vars for build process
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Production NGINX
FROM nginx:alpine AS production

# Copy custom nginx configuration if needed (or just use default with single-page app fallback)
# For SPA routing, we need a custom conf to fallback to index.html
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://api:3000/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
