FROM node:20-alpine AS build
WORKDIR /src
COPY package*.json /src
COPY .husky /src/.husky
RUN npm install
COPY . /src
RUN npm run build

FROM node:20-alpine AS app
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=build /src/dist /app/dist
COPY --from=build /src/package*.json /app/
COPY --from=build /src/.husky /app/.husky
COPY --from=build /src/prisma /app/prisma
RUN npm install --omit=dev
CMD npx prisma generate && npx prisma migrate deploy && node dist/deployCommands.js && npm run start
