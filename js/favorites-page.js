// Cargar las noticias favoritas
async function loadFavorites() {

    const container =
        document.getElementById("favorites-container");


    try {

        // Obtener todas las noticias
        const response =
            await fetch("data/news.json");


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar el archivo de noticias"
            );
        }


        const news =
            await response.json();


        // Obtener los IDs guardados
        const favoriteIds =
            getFavorites();


        // Filtrar solamente las noticias favoritas
        const favoriteNews =
            news.filter(article =>
                favoriteIds.includes(
                    Number(article.id)
                )
            );


        // Si no hay favoritos
        if (favoriteNews.length === 0) {

            container.innerHTML = `
                <div class="empty-favorites">

                    <h2>
                        Aún no tienes favoritos
                    </h2>

                    <p>
                        Explora nuestras noticias y
                        guarda las que quieras consultar
                        más adelante.
                    </p>

                    <a
                        href="news.html"
                        class="btn"
                    >
                        Explorar noticias
                    </a>

                </div>
            `;

            return;
        }


        // Mostrar las noticias
        renderFavorites(
            favoriteNews,
            container
        );


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        container.innerHTML = `
            <div class="article-not-found">

                <h2>
                    Error al cargar favoritos
                </h2>

                <p>
                    No fue posible cargar tus noticias
                    favoritas.
                </p>

            </div>
        `;
    }
}

// CREAR LAS TARJETAS

function renderFavorites(
    articles,
    container
) {

    container.innerHTML = "";


    articles.forEach(article => {

        const card =
            document.createElement("article");


        card.className =
            "news-card";


        card.innerHTML = `

            <img
                src="${article.image}"
                alt="${article.title}"
                class="news-card-image"
            >

            <div class="news-card-content">

                <span class="news-card-category">
                    ${article.category}
                </span>

                <h2>
                    ${article.title}
                </h2>

                <p>
                    ${article.excerpt}
                </p>

                <a
                    href="article.html?id=${article.id}"
                    class="news-card-link"
                >
                    Ver más →
                </a>

            </div>

        `;


        container.appendChild(card);

    });
}



// INICIAR

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFavorites();

    }
);