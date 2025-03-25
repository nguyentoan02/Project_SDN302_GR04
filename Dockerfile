# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./ 
RUN npm ci --only=production
COPY . . 

COPY public ./public

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/app.js"]
