FROM node:latest AS builder 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]

EXPOSE 3000