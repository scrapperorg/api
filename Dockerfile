FROM node:19-alpine AS development
WORKDIR /home/anap-screening-server
COPY package.json yarn.lock tsconfig.json nodemon.json ./
RUN npm install -g nodemon jest
RUN yarn install

FROM development as testing
COPY src src
COPY tests tests

FROM tester AS compiling
RUN yarn compile

FROM node:19-alpine as production
COPY --from=builder dist ./dist