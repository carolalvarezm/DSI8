FROM node:12.12.0-buster-slim as build
WORKDIR /app
COPY package.json .
RUN npm install -g parcel-bundler
COPY src/ src/
RUN parcel build src/index.html -d dist

FROM nginx:1.17.6
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]