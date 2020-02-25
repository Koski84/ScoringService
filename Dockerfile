FROM node:12.16.1-stretch

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . /app

EXPOSE 9010

CMD [ "node", "index.js" ]sudo