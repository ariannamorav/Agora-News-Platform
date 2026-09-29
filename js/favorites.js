// Obtener los favoritos guardados
function getFavorites() {
    const favorites = localStorage.getItem("agoraFavorites");

    if (favorites) {
        return JSON.parse(favorites);
    }

    return [];
}


// Guardar favoritos
function saveFavorites(favorites) {
    localStorage.setItem(
        "agoraFavorites",
        JSON.stringify(favorites)
    );
}


// Comprobar si una noticia es favorita
function isFavorite(id) {
    const favorites = getFavorites();

    return favorites.includes(Number(id));
}


// Agregar o quitar una noticia de favoritos
function toggleFavorite(id) {

    id = Number(id);

    const favorites = getFavorites();

    const index = favorites.indexOf(id);

    // Si no está en favoritos, agregarla
    if (index === -1) {

        favorites.push(id);

    } else {

        // Si ya está, quitarla
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);

    return favorites;
}