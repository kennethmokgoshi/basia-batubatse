# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
