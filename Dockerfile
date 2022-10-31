FROM node:19-alpine AS development
WORKDIR /home/anap-screening-server
COPY package.json yarn.lock tsconfig.json nodemon.json jest.config.js ./
RUN npm install -g nodemon
RUN yarn install

FROM development as build
WORKDIR /home/anap-screening-server
COPY src src
COPY tests tests
RUN yarn compile

FROM node:19-alpine as production
COPY --from=build dist dist