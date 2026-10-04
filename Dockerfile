# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for prisma engine
RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js production bundle
RUN npx next build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache openssl libc6-compat

# Copy built application
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
