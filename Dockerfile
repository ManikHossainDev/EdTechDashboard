# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install serve globally with specific version for security
RUN npm install -g serve@14.2.3

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port (internal only)
EXPOSE 9500

# Health check endpoint - serve has built-in health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9500/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start serve with security options
# --no-clipboard: Disable clipboard (security)
# -s: Single page app mode
# -l: Listen port
# --cors: Allow CORS for API calls from main domain
CMD ["serve", "-s", "dist", "-l", "9500", "--no-clipboard", "--cors"]
