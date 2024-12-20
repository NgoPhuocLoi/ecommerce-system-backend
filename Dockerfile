FROM --platform=linux/amd64 node:22-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

EXPOSE 8888

CMD [ "node", "server.js" ]
