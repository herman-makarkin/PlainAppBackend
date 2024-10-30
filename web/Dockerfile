FROM oven/bun:1.1.33-alpine AS dev
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow
ENV BUN_PATH /opt/server/node_modules

WORKDIR /opt/server/

COPY . .
RUN bun i

CMD ["bun", "dev"]
