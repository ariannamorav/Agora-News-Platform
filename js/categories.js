// Variable para guardar todas las noticias
let allNews = [];


// CARGAR NOTICIAS

async function loadCategories() {

    const container =
        document.getElementById(
            "categories-container"
        );


    try {

        const response =
            await fetch("data/news.json");


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar el archivo de noticias"
            );
        }


        allNews = await response.json();


        // Mostrar todas las noticias inicialmente
        renderCategoryNews(
            allNews,
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
                    Error al cargar las noticias
                </h2>

                <p>
                    No fue posible cargar las noticias.
                </p>

            </div>
        `;
    }
}


// FILTRAR NOTICIAS

function filterByCategory(category) {

    const container =
        document.getElementById(
            "categories-container"
        );


    let filteredNews;


    // Si seleccionamos "Todas"
    if (category === "Todas") {

        filteredNews = allNews;

    } else {

        // Filtrar por categoría
        filteredNews = allNews.filter(
            article =>
                article.category === category
        );
    }


    renderCategoryNews(
        filteredNews,
        container
    );
}

// MOSTRAR NOTICIAS

function renderCategoryNews(
    articles,
    container
) {

    container.innerHTML = "";


    // Si no existen noticias
    if (articles.length === 0) {

        container.innerHTML = `
            <div class="article-not-found">

                <h2>
                    No hay noticias
                </h2>

                <p>
                    No encontramos noticias en esta categoría.
                </p>

            </div>
        `;

        return;
    }


    // Crear las tarjetas
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


// EVENTOS

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Cargar las noticias
        loadCategories();


        // Obtener botones
        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );


        // Agregar evento a cada botón
        categoryButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    // Quitar active de todos
                    categoryButtons.forEach(
                        btn => {
                            btn.classList.remove(
                                "active"
                            );
                        }
                    );


                    // Activar el seleccionado
                    button.classList.add(
                        "active"
                    );


                    // Obtener categoría
                    const category =
                        button.dataset.category;


                    // Filtrar
                    filterByCategory(
                        category
                    );

                }
            );

        });

    }
);