import { api } from './api.js';
import { ui } from './ui.js';

async function loadGenres() {
    const container = document.getElementById('genres-container');
    ui.showLoader('genres-container');
    
    try {
        const genres = await api.getGenres();
        container.innerHTML = '';
        
        if (genres && genres.length > 0) {
            genres.forEach(genre => {
                const genreCard = `
                    <article class="col-md-4 col-sm-6">
                        <div class="card h-100 shadow-sm border-0 text-decoration-none genre-card" data-id="${genre.id}" style="cursor: pointer;">
                            <div class="position-relative">
                                <img src="https://placehold.co/600x400?text=${genre.name}" class="card-img-top" alt="Género ${genre.name}">
                                <span class="badge bg-dark position-absolute top-0 end-0 m-2">
                                    <i class="fa fa-book"></i> ${genre.name}
                                </span>
                            </div>
                            <div class="card-footer bg-light text-center small text-muted">
                                <i class="fa fa-arrow-right"></i> Explorar categoría
                            </div>
                        </div>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', genreCard);
            });

            document.querySelectorAll('.genre-card').forEach(card => {
                card.addEventListener('click', () => {
                    window.location.href = `./pages/libros/index.html?genre=${card.dataset.id}`;
                });
            });
        } else {
            container.innerHTML = '<p class="text-center w-100">No se encontraron géneros.</p>';
        }
    } catch (error) {
        ui.showAlert('Error al cargar géneros: ' + error.message);
        container.innerHTML = '<p class="text-center w-100 text-danger">Error al cargar el contenido.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadGenres);
