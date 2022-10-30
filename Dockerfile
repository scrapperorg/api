FROM node:19-alpine AS development
WORKDIR /home/anap-screening-server
COPY package.json yarn.lock tsconfig.json nodemon.json ./
RUN npm install -g nodemon
RUN yarn install

FROM development AS builder
COPY src src
RUN yarn compile

FROM node:19-alpine as production
COPY --from=builder dist ./dist