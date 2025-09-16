# ==========================
# 1. Build stage
# ==========================
FROM node:20-alpine AS builder

WORKDIR /app

# Nhận biến từ docker-compose build args
ARG NEXT_PUBLIC_MOODLE_TOKEN
ARG NEXT_PUBLIC_MOODLE_URL
ARG NEXT_PUBLIC_DOMAIN_AGENT

# Xuất biến thành ENV để Next.js đọc được khi build
ENV NEXT_PUBLIC_MOODLE_TOKEN=$NEXT_PUBLIC_MOODLE_TOKEN
ENV NEXT_PUBLIC_MOODLE_URL=$NEXT_PUBLIC_MOODLE_URL
ENV NEXT_PUBLIC_DOMAIN_AGENT=$NEXT_PUBLIC_DOMAIN_AGENT

# Copy package và cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Build Next.js (sẽ dùng NEXT_PUBLIC_* ở trên)
RUN npm run build

# ==========================
# 2. Run stage
# ==========================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "start"]
