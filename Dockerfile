
# Stage 1: Build and test the application
FROM node:22-alpine AS test

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application and test files
COPY . .

# Execute automated tests
RUN npm test


# Stage 2: Create production image
FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source files
COPY --chown=node:node app.js index.js ./

# Run as non-root user
USER node

EXPOSE 8080

# Check application health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "index.js"]
