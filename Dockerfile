# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies & openssl for prisma engine
RUN apk add --no-cache openssl libc6-compat python3 make g++

COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js production bundle
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:/app/prisma/examforge.db"

RUN apk add --no-cache openssl libc6-compat sqlite

# Copy built application and runtime dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Create directory structure for persistent volume data
RUN mkdir -p /app/prisma/backups /app/public/uploads /app/public/images/diagrams

EXPOSE 3000

CMD ["npm", "start"]
