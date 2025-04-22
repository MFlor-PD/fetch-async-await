const favoritePokemonList = document.getElementById("favorite-list");

async function displayFavoritePokemons() {
    favoritePokemonList.innerHTML = '';
    
    const allKeys = Object.keys(localStorage);
    const favoriteKeys = allKeys.filter(key => key.startsWith('poke-fav-'));
    
    if (favoriteKeys.length === 0) {
        favoritePokemonList.innerHTML = '<p>No hay Pokémon favoritos guardados.</p>';
        return;
    }

    for (const key of favoriteKeys) {
        const pokemonName = key.replace('poke-fav-', '');

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            const { name, sprites } = data;

            const card = document.createElement("div");
            card.classList.add("pokemon-card");
            card.innerHTML = `
                <div class="img"><img src="${sprites.front_default}" alt="${name}"/></div>
                <div><h2 class="name">${name}</h2></div>
                <div>
                    <button class="remove-btn" data-name="${name}">Eliminar de favoritos</button>
                </div>
            `;
            favoritePokemonList.appendChild(card);

            card.querySelector(".remove-btn").addEventListener("click", () => {
                localStorage.removeItem(`poke-fav-${name}`);
                card.remove();
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

document.addEventListener("DOMContentLoaded", displayFavoritePokemons);