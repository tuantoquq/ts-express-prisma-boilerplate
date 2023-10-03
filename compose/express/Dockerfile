FROM node:alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --pure-lockfile

COPY . .

RUN yarn global add prisma

RUN yarn prisma generate

FROM builder as development

CMD [ "sh", "run.sh", "development" ]

FROM builder as prod_builder

RUN yarn build 

FROM node:alpine as production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=prod_builder /app/node_modules /app/node_modules

COPY --from=prod_builder /app/dist /app/dist

COPY --from=prod_builder /app/prisma /app/prisma

COPY --from=prod_builder /app/run.sh /app/run.sh

RUN yarn global add prisma

CMD [ "sh", "run.sh", "production" ]