FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install --production --silent && mv node_modules ../
RUN npm i -g sequelize-cli
COPY . .
CMD ["node", "index.js"]
