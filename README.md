# Práctica 13 - Docker
## Instalando Docker
* Para instalarlo lo primero que hacemos es desinstalar las versiones antiguas que podríamos tener en nuestra máquina:
```bash
$ sudo apt-get remove docker docker-engine docker.io containerd runc
```
* Después de actualizamos los repositorios de apt-get:
```bash
$ sudo apt-get update

$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```
* Añadimos los repositorios para instalar docker:
```bash
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
* Actualizamos los repositorios e instalamos:
```bash
$ sudo apt-get update
$ sudo apt-get install docker-ce \
    docker-ce-cli \
    containerd.io
```s
* Añadimos nuestro usuario al grupo docker:
```bash
$ sudo usermod -aG docker $USER
```
* Comprobamos la versión para ver si se ha instalado correctamente:
![Version del Docker]()

## Creando la aplicación de Node
### server.js
* Nuestro archivo server.js se ocupará de escuchar en el puerto 8081 y devolver la versión cuando se pide la ruta "/" y devuelve un json cuando se pide "/api/":
```javascript
const PORT = 8081;
const HOST = "0.0.0.0";
const VERSION = "1.0";

const app = require("express")();

app.get("/", (req, res) => {
  res.send(`API VERSION ${VERSION}`);
});

app.get("/api/", (req, res) => {
    const data = require('./data.json')
    res.json(data);
  });

app.listen(PORT, HOST);
console.log(`Running NODE on http://localhost:${PORT} (private)`);
```
* Lo primero que hacemos es definir unas variables con el puerto, el host y la versión:
```javascript
const PORT = 8081;
const HOST = "0.0.0.0";
const VERSION = "1.0";
```
* Después cargarmos el módulo "express" que hemos instalado anteriormente con '''npm install express```:
```javascript
const app = require("express")();
```
* A continuación definimos que pasará cuando nos hagan peticiones a "/" y "/api/" en el primer caso devolvemos la versión y en el segundo cargamos data.json y es el que devolvemos:
```javascript
app.get("/", (req, res) => {
  res.send(`API VERSION ${VERSION}`);
});

app.get("/api/", (req, res) => {
    const data = require('./data.json')
    res.json(data);
  });

```
* Finalmente ponemos un listener a escuchar las peticiones en el puerto y host que hemos definido arriba:
```javascript
app.listen(PORT, HOST);
console.log(`Running NODE on http://localhost:${PORT} (private)`);
```
![Aplicación node]()
## Dockerizando la aplicación node
Para dockerizar la aplicación node lo primero que hacemos es hacer en nuestra carpeta de backend un Dockerfile, el mio quedaría así:
```javascript
FROM node:12.12.0-buster-slim
WORKDIR /app
COPY data.json .
COPY package.json .
COPY server.js .
RUN npm install
CMD ["node", "server.js"]
```
* En el from ponemos la imagen que queremos utilizar, en mi caso la versión de node "12.12.0 slim" debido a que no tengo demasiado espacio libre en el disco.
* También definimos el directorio de trabajo con "WORKDIR  /app"
* A continuación copiamos los archivos necesarios a ese directorio.
* Después hacemos un *npm install* para instalar todas las dependencias necesarias.
* Finalmente usamos como comando el node server.js para correr nuestra aplicación.

