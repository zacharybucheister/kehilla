FROM node:20-alpine

WORKDIR /app

# Install root deps (concurrently)
COPY package*.json ./
RUN npm install

# Install and build client
COPY client/package*.json ./client/
RUN npm install --prefix client
COPY client/ ./client/
RUN npm run build --prefix client

# Install server deps
COPY server/package*.json ./server/
RUN npm install --prefix server
COPY server/ ./server/

# Copy built client into server static folder
RUN mkdir -p server/public && cp -r client/dist/. server/public/

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server/src/index.js"]
