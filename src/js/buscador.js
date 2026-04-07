import { api } from './api.js';

let searchData = [];

function getRelativeRoot() {
    const path = window.location.pathname;
    if (path.includes('/pages/autores/') || path.includes('/pages/libros/') || path.includes('/pages/generos/')) {
        return '../../';
    } else if (path.includes('/pages/')) {
        return '../';
    }
    return './';
}

async function prepareSearchData() {
    try {
        const [booksData, authorsData, genresData] = await Promise.all([
            api.getAllBooks(),
            api.getAuthors(),
            api.getGenres()
        ]);

        const books = Array.isArray(booksData) ? booksData : (booksData?.items || booksData?.data || []);
        const authors = Array.isArray(authorsData) ? authorsData : (authorsData?.items || authorsData?.data || []);
        const genres = Array.isArray(genresData) ? genresData : (genresData?.items || genresData?.data || []);

        const root = getRelativeRoot();

        searchData = [
            ...books.map(b => ({ type: 'Libro', title: b.name, url: `${root}pages/libros/detalle.html?id=${b.bookId}`, extra: b.authorName })),
            ...authors.map(a => ({ type: 'Autor', title: a.name, url: `${root}pages/autores/detalle.html?id=${a.id}`, extra: a.nationality })),
            ...genres.map(g => ({ type: 'Género', title: g.name, url: `${root}pages/libros/index.html?genre=${g.id}`, extra: 'Ver libros de este género' }))
        ];
    } catch (error) {
        console.error('Error preparing search data:', error);
    }
}


function normalizar(txt) {
    return (txt || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function filtrar(query) {
    const q = normalizar(query);
    if (!q) return [];
    return searchData.filter(item => {
        const text = normalizar(`${item.type} ${item.title} ${item.extra}`);
        return text.includes(q);
    });
}

function mostrarResultados(items, query) {
    const box = document.getElementById("searchResults");
    if (!box) return;

    if (!query.trim()) {
        box.innerHTML = '';
        return;
    }

    if (items.length === 0) {
        box.innerHTML = `<div class="alert alert-warning">No se encontraron resultados para "<strong>${query}</strong>"</div>`;
        return;
    }

    const html = items.map(item => `
        <a href="${item.url}" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${item.title}</h6>
                <small class="badge bg-secondary">${item.type}</small>
            </div>
            <p class="mb-1 small text-muted">${item.extra}</p>
        </a>
    `).join('');

    box.innerHTML = `
        <div class="card shadow-sm border-0">
            <div class="list-group list-group-flush">
                ${html}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await prepareSearchData();

    const input = document.getElementById("search");
    const form = document.getElementById("searchForm");

    if (input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value;
            const resultados = filtrar(query);
            mostrarResultados(resultados, query);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = input.value;
            const resultados = filtrar(query);
            mostrarResultados(resultados, query);
        });
    }
});
