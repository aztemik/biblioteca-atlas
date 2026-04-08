import { api } from './api.js';
import { ui } from './ui.js';

const genresTableBody = document.getElementById('genres-table-body');
const genreForm = document.getElementById('genreForm');
const genreNameInput = document.getElementById('genreName');
const genreModalElement = document.getElementById('genreModal');
const genreModal = new bootstrap.Modal(genreModalElement);
const modalTitle = document.getElementById('genreModalLabel');

let isEditing = false;
let currentGenreId = null;

/**
 * Carga y muestra la lista de géneros en la tabla
 */
async function loadGenres() {
    try {
        const genres = await api.getGenres();
        renderGenres(genres);
    } catch (error) {
        ui.showAlert('Error al cargar géneros: ' + error.message);
        genresTableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Error al cargar datos.</td></tr>`;
    }
}

/**
 * Renderiza los géneros en la tabla
 */
function renderGenres(genres) {
    if (!genres || genres.length === 0) {
        genresTableBody.innerHTML = `<tr><td colspan="3" class="text-center">No hay géneros registrados.</td></tr>`;
        return;
    }

    genresTableBody.innerHTML = genres.map(genre => `
        <tr>
            <td class="ps-4 align-middle">${genre.id}</td>
            <td class="align-middle fw-bold">${genre.name}</td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-warning me-1 btn-edit" data-id="${genre.id}" data-name="${genre.name}">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${genre.id}">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Agregar eventos a botones de editar y eliminar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => prepareEditGenre(btn.dataset.id, btn.dataset.name));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteGenre(btn.dataset.id));
    });
}

/**
 * Prepara el modal para crear un nuevo género
 */
function prepareAddGenre() {
    isEditing = false;
    currentGenreId = null;
    modalTitle.textContent = 'Nuevo Género';
    genreForm.reset();
    genreNameInput.classList.remove('is-invalid', 'is-valid');
}

/**
 * Prepara el modal para editar un género existente
 */
function prepareEditGenre(id, name) {
    isEditing = true;
    currentGenreId = id;
    modalTitle.textContent = 'Editar Género';
    genreNameInput.value = name;
    genreNameInput.classList.remove('is-invalid', 'is-valid');
    genreModal.show();
}

/**
 * Maneja el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = genreNameInput.value.trim();

    // Validación básica
    if (name.length < 3 || name.length > 50) {
        genreNameInput.classList.add('is-invalid');
        return;
    }
    genreNameInput.classList.remove('is-invalid');

    try {
        if (isEditing) {
            // Actualizar género
            await api.updateGenre(currentGenreId, { name });
            ui.showAlert('Género actualizado exitosamente', 'success');
        } else {
            // Crear género
            await api.createGenre({ name });
            ui.showAlert('Género creado exitosamente', 'success');
        }

        genreModal.hide();
        loadGenres();
    } catch (error) {
        ui.showAlert('Error al procesar la solicitud: ' + error.message);
    }
}

/**
 * Maneja la eliminación de un género
 */
async function handleDeleteGenre(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este género?')) {
        try {
            await api.deleteGenre(id);
            ui.showAlert('Género eliminado exitosamente', 'success');
            loadGenres();
        } catch (error) {
            ui.showAlert('Error al eliminar el género: ' + error.message);
        }
    }
}

// Eventos
document.getElementById('btnAddGenre').addEventListener('click', prepareAddGenre);
genreForm.addEventListener('submit', handleFormSubmit);

// Carga inicial
document.addEventListener('DOMContentLoaded', loadGenres);
