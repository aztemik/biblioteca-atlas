import { api } from './api.js';
import { ui } from './ui.js';

const authorsTableBody = document.getElementById('authors-table-body');
const authorForm = document.getElementById('authorForm');
const authorModalElement = document.getElementById('authorModal');
const authorModal = new bootstrap.Modal(authorModalElement);
const modalTitle = document.getElementById('authorModalLabel');

let isEditing = false;
let currentAuthorId = null;

/**
 * Carga y muestra la lista de autores
 */
async function loadAuthors() {
    try {
        const authors = await api.getAuthors();
        renderAuthors(authors);
    } catch (error) {
        ui.showAlert('Error al cargar autores: ' + error.message);
        authorsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar datos.</td></tr>`;
    }
}

/**
 * Renderiza los autores en la tabla
 */
function renderAuthors(authors) {
    if (!authors || authors.length === 0) {
        authorsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No hay autores registrados.</td></tr>`;
        return;
    }

    authorsTableBody.innerHTML = authors.map(author => `
        <tr>
            <td class="ps-4 align-middle">${author.id}</td>
            <td class="align-middle fw-bold">${author.name}</td>
            <td class="align-middle">${author.nationality || '-'}</td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-warning me-1 btn-edit" data-id="${author.id}">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${author.id}">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Eventos
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => prepareEditAuthor(btn.dataset.id));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteAuthor(btn.dataset.id));
    });
}

/**
 * Prepara el modal para crear un nuevo autor
 */
function prepareAddAuthor() {
    isEditing = false;
    currentAuthorId = null;
    modalTitle.textContent = 'Nuevo Autor';
    authorForm.reset();
}

/**
 * Prepara el modal para editar un autor
 */
async function prepareEditAuthor(id) {
    try {
        const author = await api.getAuthorById(id);
        isEditing = true;
        currentAuthorId = id;
        modalTitle.textContent = 'Editar Autor';

        // Llenar campos
        document.getElementById('authorName').value = author.name || '';
        document.getElementById('authorNationality').value = author.nationality || '';
        document.getElementById('authorBirthYear').value = author.birthYear || '';
        document.getElementById('authorDeathYear').value = author.deathYear || '';
        document.getElementById('authorBio').value = author.bio || '';
        document.getElementById('authorQuote').value = author.quote || '';
        document.getElementById('authorAwards').value = author.awards ? author.awards.join(', ') : '';

        authorModal.show();
    } catch (error) {
        ui.showAlert('Error al obtener detalles del autor: ' + error.message);
    }
}

/**
 * Maneja el envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(authorForm);
    const authorData = {
        name: formData.get('name'),
        bio: formData.get('bio'),
        nationality: formData.get('nationality'),
        quote: formData.get('quote'),
        birthYear: formData.get('birthYear') ? parseInt(formData.get('birthYear')) : null,
        deathYear: formData.get('deathYear') ? parseInt(formData.get('deathYear')) : null,
        awards: formData.get('awards') ? formData.get('awards').split(',').map(a => a.trim()).filter(a => a !== '') : []
    };

    try {
        if (isEditing) {
            await api.updateAuthor(currentAuthorId, authorData);
            ui.showAlert('Autor actualizado exitosamente', 'success');
        } else {
            await api.createAuthor(authorData);
            ui.showAlert('Autor creado exitosamente', 'success');
        }

        authorModal.hide();
        loadAuthors();
    } catch (error) {
        ui.showAlert('Error al procesar la solicitud: ' + error.message);
    }
}

/**
 * Maneja la eliminación de un autor
 */
async function handleDeleteAuthor(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este autor?')) {
        try {
            await api.deleteAuthor(id);
            ui.showAlert('Autor eliminado exitosamente', 'success');
            loadAuthors();
        } catch (error) {
            ui.showAlert('Error al eliminar el autor: ' + error.message);
        }
    }
}

// Eventos
document.getElementById('btnAddAuthor').addEventListener('click', prepareAddAuthor);
authorForm.addEventListener('submit', handleFormSubmit);

// Carga inicial
document.addEventListener('DOMContentLoaded', loadAuthors);
