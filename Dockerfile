FROM node:alpine as base

WORKDIR /app

COPY ./booksapp/package.json /app

RUN npm install

COPY ./booksapp /app

EXPOSE 3001

CMD ["npm", "run", "dev"]