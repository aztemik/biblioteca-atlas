import { api } from './api.js';
import { ui } from './ui.js';

async function loadAuthors() {
    const container = document.getElementById('authors-container');
    ui.showLoader('authors-container');
    
    try {
        const authors = await api.getAuthors();
        container.innerHTML = '';
        
        if (authors && authors.length > 0) {
            authors.forEach(author => {
                const authorCard = `
                    <article class="col-md-4 col-sm-6">
                        <div class="card border-0 shadow-sm h-100 author-card" data-id="${author.id}" style="cursor: pointer;">
                            <div class="card-body text-center">
                                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                                    ${author.name.charAt(0)}
                                </div>
                                <h2 class="h5 card-title mb-1">${author.name}</h2>
                                <p class="small text-muted mb-0">${author.nationality}</p>
                            </div>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', authorCard);
            });

            document.querySelectorAll('.author-card').forEach(card => {
                card.addEventListener('click', () => {
                    window.location.href = `detalle.html?id=${card.dataset.id}`;
                });
            });
        } else {
            container.innerHTML = '<p class="text-center w-100">No se encontraron autores.</p>';
        }
    } catch (error) {
        ui.showAlert('Error al cargar autores: ' + error.message);
        container.innerHTML = '<p class="text-center w-100 text-danger">Error al cargar el contenido.</p>';
    }
}

async function showAuthorDetails(id) {
    try {
        const author = await api.getAuthorById(id);
        const modalHtml = `
            <div class="modal fade" id="authorDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${author.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <p><strong>Nacionalidad:</strong> ${author.nationality}</p>
                                    <p><strong>Años:</strong> ${author.birthYear} - ${author.deathYear || 'Presente'}</p>
                                    <p><strong>Premios:</strong> ${author.awards.join(', ') || 'Ninguno'}</p>
                                    <blockquote class="blockquote mt-3">
                                        <p class="mb-0 italic">"${author.quote}"</p>
                                    </blockquote>
                                    <hr>
                                    <h5>Biografía</h5>
                                    <p>${author.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('authorDetailModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('authorDetailModal'));
        modal.show();
    } catch (error) {
        ui.showAlert('Error al cargar detalles del autor: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadAuthors);
