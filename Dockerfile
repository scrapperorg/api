FROM node:19-alpine AS base
WORKDIR /home/anap-screening-server

FROM base as dependencies
COPY package.json yarn.lock tsconfig.json nodemon.json jest.config.js .eslintrc .eslintignore ./
RUN npm install -g nodemon
RUN yarn install --frozen-lockfile --production && \
    cp yarn.lock prod_yarn.lock && \
    cp -R node_modules prod_node_modules && \
    yarn install && \
    yarn cache clean

FROM dependencies as build
COPY src ./src
COPY tests ./tests
RUN yarn compile

FROM build as dev
RUN yarn start

FROM base as production
COPY --from=dependencies /home/anap-screening-server/prod_node_modules ./node_modules
COPY --from=dependencies /home/anap-screening-server/package.json ./package.json
COPY --from=dependencies /home/anap-screening-server/prod_yarn.lock ./yarn.lock
COPY --from=build /home/anap-screening-server/dist ./dist

EXPOSE 3000
CMD yarn start