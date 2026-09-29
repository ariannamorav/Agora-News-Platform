// Obtener el ID de la noticia desde la URL
function getArticleId() {

    const params = new URLSearchParams(
        window.location.search
    );

    return Number(params.get("id"));
}


// Cargar la noticia
async function loadArticle() {

    try {

        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo de noticias");
        }

        const news = await response.json();

        const articleId = getArticleId();

        const article = news.find(
            item => item.id === articleId
        );

        if (!article) {

            showArticleNotFound();

            return;
        }

        renderArticle(article);

    } catch (error) {

        console.error("Error:", error);

        const container = document.getElementById(
            "article-container"
        );

        container.innerHTML = `
            <div class="article-not-found">
                <h2>Error al cargar la noticia</h2>
                <p>
                    No fue posible cargar la información.
                </p>
            </div>
        `;
    }
}


// Mostrar la noticia
function renderArticle(article) {

    const container = document.getElementById(
        "article-container"
    );

    container.innerHTML = `
        <div class="article-detail">

            <span class="article-category">
                ${article.category}
            </span>

            <h1>
                ${article.title}
            </h1>

            <div class="article-meta">
                ${article.date} · ${article.author}
            </div>

            <img
                src="${article.image}"
                alt="${article.title}"
                class="article-image"
            >

            <p class="article-excerpt">
                ${article.excerpt}
            </p>

            <div class="article-content">
                ${article.content}
            </div>

            <div class="article-actions">

                <button
                    type="button"
                    class="btn favorite-btn"
                    data-id="${article.id}"
                >
                    ♡ Agregar a favoritos
                </button>

                <a
                    href="news.html"
                    class="secondary-btn"
                >
                    ← Volver a noticias
                </a>

            </div>

        </div>
    `;


    const favoriteButton =
        container.querySelector(".favorite-btn");

    if (favoriteButton) {

        updateFavoriteButton(
            favoriteButton,
            article.id
        );
    }
}


// Actualizar el texto del botón
function updateFavoriteButton(button, id) {

    if (isFavorite(id)) {

        button.textContent =
            "♥ Quitar de favoritos";

    } else {

        button.textContent =
            "♡ Agregar a favoritos";
    }
}


// Mostrar mensaje cuando no existe la noticia
function showArticleNotFound() {

    const container = document.getElementById(
        "article-container"
    );

    container.innerHTML = `
        <div class="article-not-found">

            <h2>
                Noticia no encontrada
            </h2>

            <p>
                La noticia que buscas no existe.
            </p>

            <a
                href="news.html"
                class="secondary-btn"
            >
                ← Volver a noticias
            </a>

        </div>
    `;
}


// EVENTOS

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Cargar la noticia
        loadArticle();


        // Escuchar clics en el botón de favoritos
        document.addEventListener(
            "click",
            event => {

                if (
                    event.target.classList.contains(
                        "favorite-btn"
                    )
                ) {

                    const id = Number(
                        event.target.dataset.id
                    );


                    // Agregar o quitar favorito
                    const favorites =
                        toggleFavorite(id);


                    // Actualizar el botón
                    updateFavoriteButton(
                        event.target,
                        id
                    );


                    // Mostrar en consola
                    console.log(
                        "Favoritos actuales:",
                        favorites
                    );
                }
            }
        );
    }
);