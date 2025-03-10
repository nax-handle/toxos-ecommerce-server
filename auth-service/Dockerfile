# Build stage
FROM node:20-alpine AS builder
WORKDIR /src

COPY package*.json ./
RUN npm ci && rm -rf /root/.npm

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && rm -rf /root/.npm

COPY --from=builder /src/dist ./dist

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3001
CMD ["node", "dist/main"]
