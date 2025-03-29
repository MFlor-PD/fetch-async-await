/* QUE TENGO QUE HACER O QUE TIENE QUE TENER LA PAGINA
- `https://pokeapi.co/api/v2/pokemon`
- v Gestiona la paginación para mostrar diferentes conjuntos de Pokémon. De 10 en 10. añadir esto a la url más otras cosas puede limitar la cantidad `?limit=`
- v Permite la búsqueda de Pokémon por nombre. Si no exite deberá aparecer un mensaje de "pokemon no encontrado"
- v Maneja eventos de botones y actualiza dinámicamente la interfaz.

// COMO LO VOY A HACER - PASOS:
// fetch v
// mapear por nombre e  img v
// config paginacion (10x pag)( `?limit=` ) v
// buscar pokemon por nombre => rtdo el pokemon o no encontrado v NO FUNCIONA
// guardar en favoritos en localstorage: crear boton de guardado de favoritos (addeventlistener y localstorage y desclikearlo para borrarlo)v
// crear seccion de pokemones favoritos en pagina a parte (no tengo idea como)v
// Puedes usar un script nuevo que solo traiga esos pokemon de favoritos(no se como relacionarlo pero ya vere).v


const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
const displayPokemon = document.getElementById("app");
const btnNext = document.getElementById("nextBtn");
const btnPrev = document.getElementById("prevBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

let currentPage = 1;
let totalPokemons = 0;
async function fetchPokemons(url, page = currentPage) {             //async function fetchPokemons(url, page = 1) { try { const limit = 10; const offset = (page - 1) * limit;
try {
    const offset = (page - 1) * 10;// este 10 es el limite establecido en la url
    const response = await fetch(`${url}&offset=${offset}`); //agregar el offset a la URL
    if(!response.ok) {
        throw new Error (`Error: ${response.status}`);
    }
    const data = await response.json();
    totalPokemons = data.count;
    const pokemonData = await Promise.all(
     data.results.map(async({name, url}) => {
      const response2 = await fetch(url);
      const detailsPok = await response2.json();
      return {
        name,
        imageUrl: detailsPok.sprites.front_default,  
     };
    })
); 
    let armadoHtml = '';
    pokemonData.forEach(({name, imageUrl }) => {
        const isFavorite = localStorage.getItem(name);
        armadoHtml +=
        `<div class="pokemon-card">
        <div class="img"><img src=${imageUrl} alt=${name}/></div>
        <div><h2 class="name">${name}</h2></div>
        <div><button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-name="${name}">
                                         ${isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                                                                                                       </button></div>
        </div>`;
    });
    displayPokemon.innerHTML = armadoHtml;
    // Agregar event listeners a los botones de favoritos
    const favoriteButtons = document.querySelectorAll(".favorite-btn");
        favoriteButtons.forEach(button => {
            button.addEventListener("click", () => {
                const pokemonName = button.dataset.name;
                const isFavorite = localStorage.getItem(pokemonName);
                if (isFavorite) {
                    localStorage.removeItem(pokemonName);
                    button.classList.remove('favorited');
                    button.textContent = 'Añadir a favoritos';
                } else {
                    localStorage.setItem(pokemonName, 'true');
                    button.classList.add('favorited');
                    button.textContent = 'Eliminar de favoritos';
                }
            });
        });
}    
catch(error) {
    console.error('Eror:', error);
}
}
async function searchPokemon(pokemonName) {     //MENOS COMPLEJA PORQUE ACCEDE A LOS DATOS DE 1 POKEMON ESPECIFICO Y EN PARTICULAR.
    try {
        const response = await fetch(`${url}/${pokemonName}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const { name, sprites/*, types, height, weight*/} = data;
        //const pokemonTypes = types.map((type) => type.type.name).join(', ');
    displayPokemon.innerHTML = `
            <div>
                <h2>${name}</h2>
                <img src="${sprites.front_default}" alt="${name}">
            </div>
        `;                                                                      //<p>Tipos: ${pokemonTypes}</p> <p>Altura: ${height}</p> <p>Peso: ${weight}</p>
    } catch (error) {
        console.error('Error:', error);
        displayPokemon.innerHTML = 'Pokémon no encontrado';
    }
}
//BOTONES Y EVENTOS
searchBtn.addEventListener("click", () => {
    const pokemonName = searchInput.value.toLowerCase();
    searchPokemon(pokemonName);
});
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const pokemonName = searchInput.value.toLowerCase();
        if (pokemonName.trim() === '') {
            displayPokemon.innerHTML = 'Escriba un nombre válido';
            return;
        }
        searchPokemon(pokemonName);
    }
});
btnNext.addEventListener("click", () => {
    // Calcular el número máximo de páginas
    const maxPages = Math.ceil(totalPokemons / 10);
    if (currentPage < maxPages) {
        currentPage++;
        fetchPokemons(url, currentPage);
    }
});

btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemons(url, currentPage);
    }
});

resetBtn.addEventListener("click", () => {
    searchInput.value = ''; // Borrar el texto del input
    displayPokemon.innerHTML = ''; // Borrar los resultados de la búsqueda
    fetchPokemons(url, currentPage); // Volver a mostrar la lista de Pokémon
});
fetchPokemons(url, currentPage); // FUNCION MAS COMPLEJA PORQUE PIDE LISTADO DE POKEMONS
