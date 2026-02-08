
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# Ensure .env is present before build (Vite reads .env at build time only)
COPY . .
RUN ls -l .env # Debug: list .env to confirm it's present
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 9500
CMD ["serve", "-s", "dist", "-l", "9500"]
