# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . . 

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=46.137.195.183

COPY public ./public

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["node", "src/app.js"]
