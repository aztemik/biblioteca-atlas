import { api } from './api.js';
import { ui } from './ui.js';

let currentPage = 1;
const pageSize = 9;

async function loadBooks(page = 1) {
    const container = document.getElementById('books-container');
    const paginationContainer = document.getElementById('pagination-container');
    const params = new URLSearchParams(window.location.search);
    const genreId = params.get('genre');
    
    ui.showLoader('books-container');
    
    try {
        let data;
        if (genreId) {
            data = await api.getBooksByGenre(genreId);
            paginationContainer.style.display = 'none'; // Ocultar paginación al filtrar
            if (data.length > 0) {
                document.title = `Libros de ${data[0].genreName} | Biblioteca Atlas`;
            }
        } else {
            data = await api.getBooks(page, pageSize);
            paginationContainer.style.display = 'block';
        }

        container.innerHTML = '';
        
        if (data && data.length > 0) {
            data.forEach(book => {
                const bookCard = `
                    <article class="col-md-4 col-sm-6">
                        <div class="card border-0 shadow-sm h-100 book-card" data-id="${book.bookId}" style="cursor: pointer;">
                            <img src="${book.imgUrl || 'https://placehold.co/400x600'}" class="card-img-top" alt="${book.name}">
                            <div class="card-body bg-dark text-white text-center">
                                <h2 class="h5 card-title mb-1 text-truncate">${book.name}</h2>
                                <p class="small mb-0 text-muted">${book.genreName}</p>
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

            renderPagination(page, data.length === pageSize);
        } else {
            container.innerHTML = '<p class="text-center w-100">No se encontraron libros.</p>';
        }
    } catch (error) {
        ui.showAlert('Error al cargar libros: ' + error.message);
        container.innerHTML = '<p class="text-center w-100 text-danger">Error al cargar el contenido.</p>';
    }
}

function renderPagination(page, hasMore) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = `
        <nav aria-label="Navegación de libros">
            <ul class="pagination justify-content-center">
                <li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <button class="page-link" onclick="window.changePage(${page - 1})">Anterior</button>
                </li>
                <li class="page-item active">
                    <span class="page-link">${page}</span>
                </li>
                <li class="page-item ${!hasMore ? 'disabled' : ''}">
                    <button class="page-link" onclick="window.changePage(${page + 1})">Siguiente</button>
                </li>
            </ul>
        </nav>
    `;
}

window.changePage = (page) => {
    currentPage = page;
    loadBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

async function showBookDetails(id) {
    try {
        const book = await api.getBookById(id);
        const modalHtml = `
            <div class="modal fade" id="bookDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${book.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${book.imgUrl || 'https://placehold.co/400x600'}" class="img-fluid rounded shadow-sm" alt="${book.name}">
                                </div>
                                <div class="col-md-8">
                                    <p><strong>Autor:</strong> ${book.authorName}</p>
                                    <p><strong>Género:</strong> ${book.genreName}</p>
                                    <p><strong>Año:</strong> ${book.year}</p>
                                    <p><strong>Precio:</strong> $${book.price}</p>
                                    <p><strong>SKU:</strong> ${book.sku}</p>
                                    <div class="mb-3">
                                        ${book.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                                    </div>
                                    <hr>
                                    <h5>Sinopsis</h5>
                                    <p>${book.sinopsis || book.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('bookDetailModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('bookDetailModal'));
        modal.show();
    } catch (error) {
        ui.showAlert('Error al cargar detalles: ' + error.message);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadBooks(currentPage);
});
