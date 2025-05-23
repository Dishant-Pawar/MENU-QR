FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN apk add --no-cache git python3 make g++ openssl1.1-compat
RUN npm install -g pnpm
RUN pnpm install --ignore-scripts
COPY prisma .
RUN pnpm exec prisma generate

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]