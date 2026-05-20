FROM node:20-alpine

WORKDIR /app

# Copy metadata first for better caching
COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

RUN npm install
RUN npm --prefix client install
RUN npm --prefix server install

COPY . .

RUN npm --prefix client run build

EXPOSE 5050

ENV NODE_ENV=production
ENV PORT=5050

CMD ["npm", "run", "start"]
