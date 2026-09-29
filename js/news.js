// CARGAR NOTICIAS

async function loadAllNews() {

    try {

        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON.");
        }

        const news = await response.json();

        renderNews(news);

    } catch (error) {

        console.error("Error:", error);

        const container = document.getElementById(
            "news-container"
        );

        if (container) {

            container.innerHTML = `
                <p>
                    No fue posible cargar las noticias.
                </p>
            `;
        }
    }
}


// RENDERIZAR TODAS LAS NOTICIAS

function renderNews(news) {

    const container = document.getElementById(
        "news-container"
    );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    news.forEach(article => {

        const card = document.createElement("article");

        card.classList.add("news-card");

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

                <h3>
                    ${article.title}
                </h3>

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

document.addEventListener("DOMContentLoaded", () => {

    loadAllNews();

});