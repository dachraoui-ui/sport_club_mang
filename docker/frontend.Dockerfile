# Frontend Dockerfile for React/Vite
FROM node:20-alpine

# Set work directory
WORKDIR /app

# Install bun for faster builds (optional, can use npm)
RUN npm install -g bun

# Copy package files
COPY Frontend/package.json Frontend/bun.lockb* Frontend/package-lock.json* ./

# Install dependencies
RUN bun install || npm install

# Copy project files
COPY Frontend/ .

# Expose port
EXPOSE 5173

# Start development server with host binding
CMD ["sh", "-c", "bun run dev --host || npm run dev -- --host"]
