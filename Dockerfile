FROM node:20-slim

RUN apt-get update -y \
&& apt-get install -y openssl

WORKDIR /app

COPY package*.json /app
COPY .husky /app/.husky

RUN npm install

COPY . /app

RUN npm run build

CMD npx prisma generate && npx prisma migrate deploy && node dist/deployCommands.js && npm run start
