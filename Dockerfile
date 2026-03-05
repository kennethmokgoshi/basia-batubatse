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

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy build files from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server file
COPY server.mjs ./

EXPOSE 80
CMD ["node", "server.mjs"]
