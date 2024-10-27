FROM oven/bun:1.1.33-alpine
WORKDIR /usr/scr/app
COPY . .
RUN bun install
EXPOSE 3000
CMD ["bun", "src/index.ts"]
