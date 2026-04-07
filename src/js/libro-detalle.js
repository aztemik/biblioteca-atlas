import { api } from './api.js';
import { ui } from './ui.js';

async function loadBookDetail() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('book-detail-content');

    try {
        const book = await api.getBookById(bookId);
        document.title = `${book.name} | Biblioteca Atlas`;

        container.innerHTML = `
            <article class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="row g-0">
                            <figure class="col-md-4 text-center p-4 bg-light">
                                <img src="${book.imgUrl || 'https://placehold.co/400x600'}" class="img-fluid rounded shadow mb-3" alt="${book.name}">
                                <figcaption>
                                    <span class="badge bg-primary">${book.genreName}</span>
                                    <span class="badge bg-warning text-dark ms-1">${book.year}</span>
                                </figcaption>
                            </figure>

                            <div class="col-md-8">
                                <div class="card-body p-4">
                                    <h2 class="fw-bold mb-2">
                                        <i class="fa fa-book text-primary"></i>
                                        ${book.name}
                                    </h2>

                                    <p>
                                        <i class="fa fa-user"></i> Autor:
                                        <a href="/pages/autores/detalle.html?id=${book.authorId}">${book.authorName}</a>
                                    </p>

                                    <p><i class="fa fa-building"></i> Editorial: ${book.publisher}</p>
                                    <p><i class="fa fa-star"></i> Rating: ${book.rating} / 5</p>
                                    <p><i class="fa fa-barcode"></i> SKU: ${book.sku}</p>

                                    <div class="mb-3">
                                        ${book.tags.map(tag => `<span class="badge bg-light text-dark border me-1">${tag}</span>`).join('')}
                                    </div>

                                    <p class="text-muted fst-italic">
                                        ${book.description}
                                    </p>

                                    <section>
                                        <h3 class="fw-bold">
                                            <i class="fa fa-file-text"></i> Sinopsis
                                        </h3>
                                        <p>${book.sinopsis || book.description}</p>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
    } catch (error) {
        ui.showAlert('Error al cargar el libro: ' + error.message);
        container.innerHTML = '<div class="alert alert-danger text-center">No se pudo cargar la información del libro.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadBookDetail);
