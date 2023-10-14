# || #### BASE ##### ||
FROM node:18-alpine as base

# Directory
WORKDIR /usr/src/app

# Setup yarn
RUN corepack enable yarn
RUN corepack prepare yarn@3.3.0 --activate


# Setup general monorepo enviroment
COPY package.json package.json
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock

COPY turbo.json turbo.json

# Copy apps code
COPY apps apps

RUN yarn install


# || #### sender-dev ##### ||
FROM base as sender-dev

RUN yarn turbo run build --filter="sender"
CMD yarn sender

# || #### consumer-dev ##### ||
FROM base as consumer-dev

RUN yarn turbo run build --filter="consumer"
CMD yarn consumer
