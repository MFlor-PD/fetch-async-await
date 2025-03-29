const favoritePokemonList = document.getElementById("favorite-list");

function displayFavoritePokemons() {
    const favoritePokemons = Object.keys(localStorage);
    if (favoritePokemons.length === 0) {
        favoritePokemonList.innerHTML = '<p>No hay Pokémon favoritos guardados.</p>';
        return;
    }

    favoritePokemons.forEach(async pokemonName => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            const { name, sprites } = data;

            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <h2>${name}</h2>
                    <img src="${sprites.front_default}" alt="${name}">
                </div>
            `;
            favoritePokemonList.appendChild(li);
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

displayFavoritePokemons();