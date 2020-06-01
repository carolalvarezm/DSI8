FROM node:12.2.0
COPY data.json .
COPY package.json .
COPY server.js .
RUN npm install
CMD ["node", "server.js"]