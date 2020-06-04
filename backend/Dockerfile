FROM node:12.12.0-buster-slim
WORKDIR /app
COPY data.json .
COPY package.json .
COPY server.js .
RUN npm install
CMD ["node", "server.js"]