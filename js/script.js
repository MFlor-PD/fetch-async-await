/* QUE TENGO QUE HACER O QUE TIENE QUE TENER LA PAGINA
- `https://pokeapi.co/api/v2/pokemon`v
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

*/
const baseListURL = 'https://pokeapi.co/api/v2/pokemon?limit=10';
const baseSearchURL = 'https://pokeapi.co/api/v2/pokemon';
const displayPokemon = document.getElementById("app");
const btnNext = document.getElementById("nextBtn");
const btnPrev = document.getElementById("prevBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

let currentPage = 1;
let totalPokemons = 0;

async function fetchPokemons() {
    try {
        const offset = (currentPage - 1) * 10;
        const response = await fetch(`${baseListURL}&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        totalPokemons = data.count;

        const pokemonData = await Promise.all(
            data.results.map(async ({ name, url }) => {
                const response2 = await fetch(url);
                const detailsPok = await response2.json();
                return {
                    name,
                    imageUrl: detailsPok.sprites.other['official-artwork'].front_default,
                };
            })
        );

        let armadoHtml = '';
        pokemonData.forEach(({ name, imageUrl }) => {
            const isFavorite = localStorage.getItem(`poke-fav-${name}`);
            armadoHtml += `
                <div class="pokemon-card">
                    <div class="img"><img src="${imageUrl}" alt="${name}"/></div>
                    <div><h2 class="name">${name}</h2></div>
                    <div>
                        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-name="${name}">
                            ${isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                        </button>
                    </div>
                </div>`;
        });

        displayPokemon.innerHTML = armadoHtml;

        // Event listeners para botones de favoritos
        const favoriteButtons = document.querySelectorAll(".favorite-btn");
        favoriteButtons.forEach(button => {
            button.addEventListener("click", () => {
                const pokemonName = button.dataset.name;
                const isFavorite = localStorage.getItem(`poke-fav-${pokemonName}`);
                if (isFavorite) {
                    localStorage.removeItem(`poke-fav-${pokemonName}`);
                    button.classList.remove('favorited');
                    button.textContent = 'Añadir a favoritos';
                } else {
                    localStorage.setItem(`poke-fav-${pokemonName}`, 'true');
                    button.classList.add('favorited');
                    button.textContent = 'Eliminar de favoritos';
                }
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}
fetchPokemons();

async function searchPokemon(pokemonName) {
    
    try {
        const response = await fetch(`${baseSearchURL}/${pokemonName}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const { name, sprites } = data;
        const imageUrl = sprites.other['official-artwork'].front_default;

        displayPokemon.innerHTML = `
            <div class="pokemon-card">
                <div class="img"><img src="${imageUrl}" alt="${name}"/></div>
                <div><h2 class="name">${name}</h2></div>
                <div>
                    <button class="favorite-btn" data-name="${name}">
                        Añadir a favoritos
                    </button>
                </div>
            </div>
        `;

        // Event listener para el botón de favoritos en la búsqueda
        const favoriteButton = document.querySelector(".favorite-btn");
        favoriteButton.addEventListener("click", () => {
            const pokemonName = favoriteButton.dataset.name;
            const isFavorite = localStorage.getItem(`poke-fav-${pokemonName}`);
            if (isFavorite) {
                localStorage.removeItem(`poke-fav-${pokemonName}`);
                favoriteButton.classList.remove('favorited');
                favoriteButton.textContent = 'Añadir a favoritos';
            } else {
                localStorage.setItem(`poke-fav-${pokemonName}`, 'true');
                favoriteButton.classList.add('favorited');
                favoriteButton.textContent = 'Eliminar de favoritos';
            }
        });
    } catch (error) {
        console.error('Error:', error);
        displayPokemon.innerHTML = 'Pokémon no encontrado';
    }
}

// Event Listeners de navegación y búsqueda
searchBtn.addEventListener("click", () => {
    const pokemonName = searchInput.value.trim().toLowerCase();
    if (pokemonName === '') {
        displayPokemon.innerHTML = 'Escriba un nombre válido';
        return;
    }
    searchPokemon(pokemonName);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const pokemonName = searchInput.value.trim().toLowerCase();
        if (pokemonName === '') {
            displayPokemon.innerHTML = 'Escriba un nombre válido';
            return;
        }
        searchPokemon(pokemonName);
    }
});

btnNext.addEventListener("click", () => {
    const maxPages = Math.ceil(totalPokemons / 10);
    if (currentPage < maxPages) {
        currentPage++;
        fetchPokemons();
    }
});

btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemons();
    }
});

resetBtn.addEventListener("click", () => {
    searchInput.value = '';
    displayPokemon.innerHTML = '';
    fetchPokemons();
});