# Build stage
FROM node:20 AS builder
WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /src/dist ./dist

ENV PORT=3002
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD=
ENV REDIS_DB=0
ENV PRODUCT_SERVICE_URL=product-service:3001
ENV CART_EXPIRATION=3600

EXPOSE 3002
CMD ["node", "dist/main"] 