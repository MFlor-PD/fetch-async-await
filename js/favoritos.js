const favoritePokemonList = document.getElementById("favorite-list");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

let allFavoritePokemons = [];

async function displayFavoritePokemons(filteredPokemons = null) {
    favoritePokemonList.innerHTML = '';

    const allKeys = Object.keys(localStorage);
    const favoriteKeys = allKeys.filter(key => key.startsWith('poke-fav-'));

    if (favoriteKeys.length === 0) {
        favoritePokemonList.innerHTML = '<p>No hay Pokémon favoritos guardados.</p>';
        return;
    }

    // Si no hay filtro, mostrar todos los favoritos
    const pokemonsToShow = filteredPokemons || favoriteKeys;

    if (pokemonsToShow.length === 0) {
        favoritePokemonList.innerHTML = '<p>No se encontraron Pokémon que coincidan con la búsqueda.</p>';
        return;
    }

    for (const key of pokemonsToShow) {
        const pokemonName = key.replace('poke-fav-', '');

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            const { name, sprites } = data;

            // Usar la misma URL de imagen que en index
            const imageUrl = sprites.other['official-artwork'].front_default;

            const card = document.createElement("div");
            card.classList.add("pokemon-card");
            card.innerHTML = `
                <div class="img"><img src="${imageUrl}" alt="${name}"/></div>
                <div><h2 class="name">${name}</h2></div>
                <div>
                    <button class="remove-btn" data-name="${name}">Eliminar de favoritos</button>
                </div>
            `;
            favoritePokemonList.appendChild(card);

            card.querySelector(".remove-btn").addEventListener("click", () => {
                localStorage.removeItem(`poke-fav-${name}`);
                card.remove();

                // Actualizar la lista después de eliminar
                if (favoritePokemonList.children.length === 0) {
                    favoritePokemonList.innerHTML = '<p>No hay Pokémon favoritos guardados.</p>';
                }
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function searchInFavorites() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayFavoritePokemons();
        return;
    }

    const allKeys = Object.keys(localStorage);
    const favoriteKeys = allKeys.filter(key => key.startsWith('poke-fav-'));
    
    const filteredKeys = favoriteKeys.filter(key => {
        const pokemonName = key.replace('poke-fav-', '');
        return pokemonName.toLowerCase().includes(searchTerm);
    });

    displayFavoritePokemons(filteredKeys);
}

function resetSearch() {
    searchInput.value = '';
    displayFavoritePokemons();
}

// Event Listeners
searchBtn.addEventListener("click", searchInFavorites);

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchInFavorites();
    }
});

resetBtn.addEventListener("click", resetSearch);

// Cargar favoritos al cargar la página
document.addEventListener("DOMContentLoaded", displayFavoritePokemons);
