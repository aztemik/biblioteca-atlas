import { api } from './api.js';
import { ui } from './ui.js';

async function loadAuthorDetail() {
    const params = new URLSearchParams(window.location.search);
    const authorId = params.get('id');

    if (!authorId) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('author-detail-content');

    try {
        const author = await api.getAuthorById(authorId);
        document.title = `${author.name} | Biblioteca Atlas`;

        // Intentar obtener libros de este autor filtrando todos los libros
        let booksHtml = '';
        try {
            const allBooks = await api.getAllBooks();
            const authorBooks = allBooks.filter(b => b.authorId == authorId);
            if (authorBooks.length > 0) {
                booksHtml = `
                    <section class="mt-4">
                        <h3><i class="fa fa-bookmark"></i> Libros en el catálogo</h3>
                        <ul class="list-group">
                            ${authorBooks.map(b => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <a href="../libros/detalle.html?id=${b.bookId}" class="text-decoration-none">${b.name}</a>
                                    <span class="badge bg-primary rounded-pill">${b.genreName}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </section>
                `;
            }
        } catch (e) {
            console.warn('No se pudieron cargar los libros del autor');
        }

        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <article class="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                        <header class="bg-dark text-white p-4 text-center">
                            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 100px; height: 100px; font-size: 3rem;">
                                ${author.name.charAt(0)}
                            </div>
                            <h2 class="fw-bold mb-1">
                                <i class="fa fa-user"></i> ${author.name}
                            </h2>
                            <p class="fst-italic mb-0">
                                <i class="fa fa-quote-left"></i>
                                ${author.quote || 'No hay una frase disponible.'}
                                <i class="fa fa-quote-right"></i>
                            </p>
                        </header>

                        <div class="card-body p-4">
                            <div class="row mb-4">
                                <p class="col-md-6 mb-2">
                                    <i class="fa fa-flag text-primary"></i>
                                    <strong>Nacionalidad:</strong> ${author.nationality}
                                </p>
                                <p class="col-md-3 mb-2">
                                    <i class="fa fa-birthday-cake text-primary"></i>
                                    <strong>Nacimiento:</strong> ${author.birthYear}
                                </p>
                                <p class="col-md-3 mb-2">
                                    <i class="fa fa-cross text-primary"></i>
                                    <strong>Fallecimiento:</strong> ${author.deathYear || 'Presente'}
                                </p>
                            </div>

                            <section class="mb-4">
                                <h3><i class="fa fa-book text-primary"></i> Biografía</h3>
                                <p style="text-align: justify; line-height: 1.6;">${author.bio}</p>
                            </section>

                            <section class="mb-4">
                                <h3><i class="fa fa-trophy text-primary"></i> Premios</h3>
                                <div class="d-flex flex-wrap gap-2">
                                    ${author.awards && author.awards.length > 0 
                                        ? author.awards.map(award => `<span class="badge bg-info text-dark">${award}</span>`).join('') 
                                        : '<span class="text-muted">No se registran premios.</span>'}
                                </div>
                            </section>

                            ${booksHtml}
                        </div>
                    </article>
                </div>
            </div>
        `;
    } catch (error) {
        ui.showAlert('Error al cargar detalles del autor: ' + error.message);
        container.innerHTML = '<div class="alert alert-danger text-center">No se pudo cargar la información del autor.</div>';
    }
}

document.addEventListener('DOMContentLoaded', loadAuthorDetail);
