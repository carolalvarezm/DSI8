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
```
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
![Run.sh]()
![Aplicación node]()
## Dockerizando la aplicación node
Para dockerizar la aplicación node lo primero que hacemos es hacer en nuestra carpeta de backend un Dockerfile, el mio quedaría así:
```dockerfile
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
 
![Run.sh]()
![/api]()

## Creando la web frontend
* Para el fronend utilizaremos parcel para construir los archivos de producción y después utilizaremos nginx para desplegarla.
### index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dsi-p8-docker-alu0100944723</title>
    <link rel="stylesheet" href="./css/index.css" />
    <script defer src="./js/index.js"></script>
</head>

<body>
    <div class="container">
    </div>
</body>

</html>
```
En el html lo único que hacemos es linkear el css y el js y un div con clase *container*.
### index.js
* En el index.js lo primero que hacemos un fetch a nuestra aplicación de node para que nos devuelva el data.json con información sobre los personajes y cuando nos haya respondido utilizaremos la función *create_personaje* para cada personaje:
```javascript
const datos = fetch('/api/')
datos.then(function(response) {
    return response.json();
}).then(personajes => personajes.forEach(personaje => {
    create_personaje(personaje)
}));
```
* En esta función lo primero que hacemos es crear los elementos que vamos a utilizar. También añadimos las clases elemento, shadow y round a un div.
* Después añadimos la propiedad css *--color* con el color del personaje.
* A continuación añadimos el nombre del personaje a uno de los parrafos e introducimos unos listeners de eventos para cuando pasemos el ratón por encima se muestre el resto de información del personaje y cuando lo quitemos vuelva a verse sólo el nombre.
* Finalmente añadimos los elementos al elemento con clase container de nuestra página.

```javascript
function create_personaje(personaje) {
    const container = document.querySelector(".container");
    const div = document.createElement("div");
    const character = document.createElement("p");
    const name = document.createElemejavascripteElement("p");


    div.classList.add("elemento");
    div.classList.add("shadow");
    div.classList.add("round");
    div.style.setProperty("--color", `${personaje.color}`);


    character.textContent = personaje.character;


    var click = 0
    div.addEventListener("mouseover", function() {
        name.textContent = personaje.name;
        level.textContent = personaje.level;
        genre.textContent = personaje.genre;
        specie.textContent = personaje.specie;
    });
    div.addEventListener("mouseout", function() {
        name.textContent = '';
        level.textContent = '';
        genre.textContent = '';
        specie.textContent = '';
    });

    div.appendChild(character);
    div.appendChild(name);
    div.appendChild(level);
    div.appendChild(genre);
    div.appendChild(specie);
    container.appendChild(div);
}
```
### index.css
* Los estilos que he definido para esta página son los siguientes:
```css
body {
    display: flex;
    justify-content: center;
}

.container {
    display: grid;
    grid-template-columns: repeat(8, 200px);
    grid-template-rows: repeat(2, 450px);
    grid-gap: 10px 10px;
}

.round {
    border-radius: 5%;
}

.shadow {
    box-shadow: 5px 5px 10px 4px gray;
}

.elemento {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-image: linear-gradient(180deg, white 15%, var(--color));
    text-align: center;
}

p {
    text-transform: capitjavascript Dockerfile multi-stage para construir los archivos de producción con parcel y después copiarlos al contenedor de nginx para desplegarlo:
 ```dockerfile
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
 ```
* Primero utilizamos una imagen de node, copiamos la carpeta src que contiene nuestro código fuente e instalamos parcel con npm. Después hacemos un *parcel build src/index.html -d dist*.
* Finalmente utilizamos una imagen de nginx para crear un contenedor en el que copiaremos los archivos finales de nuetsro código fuente que hemos creado en el anterior contenedor y copiaremos también la configuración para nginx. Además desplegaremos la página con *nginx -g daemon off*.

## Configurando nginx
* El fichero de configuración del paso anterior contiene lo siguiente:
```
server {
listen 8081;docker-compose up --build
root /usr/share/nginx/html;
index index.html index.htm;
}
location /api/ {
proxy_pass http://node:8081/api/;
}
location /api/version/ {
proxy_pass http://node:8081/;
}
}

```
 * Lo primero que indicamos es el puerto en el que estará escuchando que en nuestro caso será el 8081 del contenedor.
 * Le ponemos como server_name localhost para que escuche en el local.
 * Después tenemos donde se guardarán los logs.
 * Finalmente definimos que nos devolverá cuando entremos en las siguientes rutas:
    * */* nos llevará a nuestra página principal.
    * */api/* se lo pasará a node que a su vez devolverá el data.json.
    * */api/version* se lo pasará también a nuestro backend que delvolverá la versión.
* Una vez hecho esto ya tenemos nuestro servidor nginx configurado.

## Uniendo backend y frontend con docker-compose
* Lo primero para poder utilizarlo es instalarlo para ello hacemos:
 ```bash
    $ sudo curl -L
    "https://github.com/docker/compose/releases/downlo
    ad/1.25.0/docker-compose-$(uname -s)-$(uname -m)"
    -o /usr/local/bin/docker-compose
    $ sudo chmod +x /usr/local/bin/docker-compose
    $ docker-compose --version
    
 ```
 ![docker-compose version]()
 * Después tenemos que definir un archivo *docker-compose.yml*:
 ```yml
 version: '3.7'
services:
  nginx:
    build: ./frontend
    container_name: "app_nginx"
    ports:
      - "80:8081"
    networks:
      - backend

  node:
    build: ./backend
    container_name: "app_node"
    networks:
      - backend
networks:
  backend:
    name: app_backend
 ```
* Lo primero que tenemos es la versión de docker-compose que utilizaremos en este caso la 3.7.
* Después tenemos la definición de los dos servicios:
    * nginx que contendrá la parte del frontend:
        * Primero le indicamos en qué carpeta está el Dockerfile para contruir el contenedor.
        * Después le ponemos un nombre.
        * A continuación le indicamos que nos redirija lo que saque en el puerto 8081 del contenedor al 80 de nuestra máquina.
        * Finalmente incluimos la network po la que se conectara con nuestro backend.
    * node contenedor que contendrá nuestro backend:    
        * Primero le indicamos en qué carpeta está el Dockerfile para contruir el contenedor como el anterior.
        * Después le ponemos un nombre.
        * Y finalmente añadimos la network.
* Por último tenemos la definición de la red a la que le pondremos un nombre.
 
* Para crear todo lo anterior utilizamos:
```bash
$docker-compose up --build
```
![Docker-compose up]()
![Resultado final]()