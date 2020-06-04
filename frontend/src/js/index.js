const datos = fetch('/api/')
datos.then(function(response) {
    return response.json();
}).then(personajes => personajes.forEach(personaje => {
    create_personaje(personaje)
}));


function create_personaje(personaje) {
    const container = document.querySelector(".container");
    const div = document.createElement("div");
    const character = document.createElement("p");
    const name = document.createElement("p");
    const level = document.createElement("p");
    const genre = document.createElement("p");
    const specie = document.createElement("p");


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