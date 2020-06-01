FROM node:12.2.0 as build
WORKDIR /app
COPY package.json .
COPY src/ src/
RUN npm install -g parcel-bundler
RUN parcel build src/index.html -d dist

FROM nginx:1.17.6
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]