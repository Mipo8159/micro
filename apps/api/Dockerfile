FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./ 

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist 

CMD [ "node", 'dist/apps/api/main' ]