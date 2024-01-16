##### DEPENDENCIES
FROM node:20-alpine3.17
RUN apk add --no-cache libc6-compat openssl1.1-compat
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY prisma ./
COPY package*.json ./
RUN npm ci
