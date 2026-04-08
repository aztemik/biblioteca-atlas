import { api } from './api.js';
import { ui } from './ui.js';

let currentPage = 1;
let totalPages = 1;
const pageSize = 5;

async function loadAuthors(page = 1) {
    const container = document.getElementById('authors-container');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    ui.showLoader('authors-container');
    
    try {
        const response = await api.getAuthorsPaged(page, pageSize);
        const { items: authors, pageNumber } = response;
        totalPages = response.totalPages;
        
        container.innerHTML = '';
        currentPage = pageNumber;
        
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

        // Update pagination UI
        if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', currentPage <= 1);
        }
        
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', currentPage >= totalPages);
        }

    } catch (error) {
        ui.showAlert('Error al cargar autores: ' + error.message);
        container.innerHTML = '<p class="text-center w-100 text-danger">Error al cargar el contenido.</p>';
    }
}

function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                loadAuthors(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                loadAuthors(currentPage + 1);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAuthors(currentPage);
    setupPagination();
});
