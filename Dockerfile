FROM node:19-alpine AS base
WORKDIR /app

FROM base as dependencies
COPY package.json yarn.lock tsconfig.json nodemon.json jest.config.js .eslintrc .eslintignore ./
RUN npm install -g nodemon
RUN yarn install --frozen-lockfile --production && \
    cp yarn.lock prod_yarn.lock && \
    cp -R node_modules prod_node_modules && \
    yarn install && \
    yarn cache clean

FROM dependencies as build
RUN rm -rf prod_node_modules
RUN rm prod_yarn.lock
COPY src ./src
COPY tests ./tests
RUN yarn compile

FROM base as production
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/prod_yarn.lock ./yarn.lock
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD yarn start