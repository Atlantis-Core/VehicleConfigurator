# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /backend/src

# Install deps
COPY package*.json ./
RUN npm ci

# Copy all source (including prisma)
COPY . .

# Generate Prisma client during build
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ---- Run stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy built app (standalone output)
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

# Copy Prisma schema + migrations + generated client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

# Run migrations then start
CMD npx prisma migrate deploy --schema=./prisma/schema.prisma && node server.js