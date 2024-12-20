FROM node:23-bookworm

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build