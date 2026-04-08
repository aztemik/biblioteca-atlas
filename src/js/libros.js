import { api } from './api.js';
import { ui } from './ui.js';

let currentPage = 1;
let totalPages = 1;
const pageSize = 9;

async function loadBooks(page = 1) {
    const container = document.getElementById('books-container');
    const paginationContainer = document.getElementById('pagination-container');
    const params = new URLSearchParams(window.location.search);
    const genreId = params.get('genre');
    
    ui.showLoader('books-container');
    
    try {
        let books = [];
        if (genreId) {
            books = await api.getBooksByGenre(genreId);
            paginationContainer.style.display = 'none'; // Ocultar paginación al filtrar
            if (books.length > 0) {
                document.title = `Libros de ${books[0].genreName} | Biblioteca Atlas`;
            }
        } else {
            const response = await api.getBooks(page, pageSize);
            books = response.items || response.data || [];
            totalPages = response.totalPages || 1;
            currentPage = response.pageNumber || page;
            paginationContainer.style.display = 'block';
        }

        ui.hideLoader('books-container');
        
        if (books && books.length > 0) {
            books.forEach(book => {
                const bookCard = `
                    <article class="col-md-4 col-sm-6">
                        <div class="card border-0 shadow-sm h-100 book-card" data-id="${book.bookId}" style="cursor: pointer;">
                            <div class="card-img-container">
                                <span class="badge genre-badge">${book.genreName}</span>
                                <span class="rating-badge"><i class="fa fa-star text-dark me-1"></i>${book.rating || 'N/A'}</span>
                                <img src="${book.imgUrl || 'https://placehold.co/400x600'}" class="card-img-top" alt="${book.name}">
                            </div>
                            <div class="card-body bg-white text-center border-top">
                                <h2 class="h6 card-title fw-bold mb-1 text-truncate">${book.name}</h2>
                                <p class="small mb-0 text-muted fst-italic">${book.authorName}</p>
                                <div class="mt-2 text-primary small fw-semibold">
                                    Ver detalles <i class="fa fa-chevron-right ms-1" style="font-size: 0.7rem;"></i>
                                </div>
                            </div>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', bookCard);
            });

            // Add event listeners for redirect
            document.querySelectorAll('.book-card').forEach(card => {
                card.addEventListener('click', () => {
                    window.location.href = `detalle.html?id=${card.dataset.id}`;
                });
            });

            if (!genreId) {
                renderPagination();
            }
        } else {
            container.innerHTML = '<p class="text-center w-100">No se encontraron libros.</p>';
        }
    } catch (error) {
        ui.showAlert('Error al cargar libros: ' + error.message);
        container.innerHTML = '<p class="text-center w-100 text-danger">Error al cargar el contenido.</p>';
    }
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = `
        <nav aria-label="Navegación de libros">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <button class="page-link" onclick="window.changePage(${currentPage - 1})">Anterior</button>
                </li>
                <li class="page-item disabled">
                    <span class="page-link text-dark">Página ${currentPage} de ${totalPages}</span>
                </li>
                <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
                    <button class="page-link" onclick="window.changePage(${currentPage + 1})">Siguiente</button>
                </li>
            </ul>
        </nav>
    `;
}

window.changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadBooks(currentPage);
});
