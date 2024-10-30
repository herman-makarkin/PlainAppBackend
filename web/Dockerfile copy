FROM oven/bun:1.1.33-alpine AS dev
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow
ENV BUN_PATH /opt/server/node_modules

WORKDIR /opt/server/

COPY package*.json ./
RUN bun i

COPY ./prisma prisma
COPY ./src src
RUN apk add openssl1.1-compat
RUN bunx prisma generate

CMD ["bun", "dev"]
