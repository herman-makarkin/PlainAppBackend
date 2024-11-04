FROM oven/bun:1.1.34-alpine AS dev
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow
ENV BUN_PATH /opt/server/node_modules

WORKDIR /opt/server/

COPY package*.json ./
RUN bun i

COPY ./src src
COPY ./drizzle.config.ts drizzle.config.ts
RUN apk add nodejs npm
# RUN npx drizzle-kit generate
#RUN npx drizzle-kit migrate

CMD ["bun", "dev"]
