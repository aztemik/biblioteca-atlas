import { api } from './api.js';
import { ui } from './ui.js';

const booksTableBody = document.getElementById('books-table-body');
const bookForm = document.getElementById('bookForm');
const bookModalElement = document.getElementById('bookModal');
const bookModal = new bootstrap.Modal(bookModalElement);
const modalTitle = document.getElementById('bookModalLabel');

const genreSelect = document.getElementById('bookGenre');
const authorSelect = document.getElementById('bookAuthor');

let isEditing = false;
let currentBookId = null;

/**
 * Carga inicial de datos
 */
async function init() {
    await Promise.all([
        loadGenresAndAuthors(),
        loadBooks()
    ]);
}

/**
 * Carga géneros y autores para los selects
 */
async function loadGenresAndAuthors() {
    try {
        const [genres, authors] = await Promise.all([
            api.getGenres(),
            api.getAuthors()
        ]);

        genreSelect.innerHTML = '<option value="">Seleccione...</option>' + 
            genres.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        
        authorSelect.innerHTML = '<option value="">Seleccione...</option>' + 
            authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

    } catch (error) {
        ui.showAlert('Error al cargar dependencias: ' + error.message);
    }
}

/**
 * Carga y muestra la lista de libros
 */
async function loadBooks() {
    try {
        const books = await api.getAllBooks();
        renderBooks(books);
    } catch (error) {
        ui.showAlert('Error al cargar libros: ' + error.message);
        booksTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar datos.</td></tr>`;
    }
}

/**
 * Renderiza los libros en la tabla
 */
function renderBooks(books) {
    if (!books || books.length === 0) {
        booksTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No hay libros registrados.</td></tr>`;
        return;
    }

    booksTableBody.innerHTML = books.map(book => `
        <tr>
            <td class="ps-4 align-middle">${book.bookId}</td>
            <td class="align-middle fw-bold">${book.name}</td>
            <td class="align-middle">${book.stock ?? 0}</td>
            <td class="align-middle">$${book.price ?? '0.00'}</td>
            <td class="text-end pe-4">
                <button class="btn btn-sm btn-outline-warning me-1 btn-edit" data-id="${book.bookId}">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${book.bookId}">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => prepareEditBook(btn.dataset.id));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteBook(btn.dataset.id));
    });
}

/**
 * Prepara el modal para crear un nuevo libro
 */
function prepareAddBook() {
    isEditing = false;
    currentBookId = null;
    modalTitle.textContent = 'Nuevo Libro';
    bookForm.reset();
}

/**
 * Prepara el modal para editar un libro
 */
async function prepareEditBook(id) {
    try {
        const book = await api.getBookById(id);
        isEditing = true;
        currentBookId = id;
        modalTitle.textContent = 'Editar Libro';

        document.getElementById('bookName').value = book.name || '';
        document.getElementById('bookGenre').value = book.genreId || '';
        document.getElementById('bookAuthor').value = book.authorId || '';
        document.getElementById('bookYear').value = book.year || '';
        document.getElementById('bookRating').value = book.rating || '';
        document.getElementById('bookPrice').value = book.price || '';
        document.getElementById('bookStock').value = book.stock || '';
        document.getElementById('bookPublisher').value = book.publisher || '';
        document.getElementById('bookSku').value = book.sku || '';
        document.getElementById('bookDescription').value = book.description || '';
        document.getElementById('bookSinopsis').value = book.sinopsis || '';
        document.getElementById('bookTags').value = book.tags ? book.tags.join(', ') : '';

        // El campo file no se puede llenar por seguridad

        bookModal.show();
    } catch (error) {
        ui.showAlert('Error al obtener detalles del libro: ' + error.message);
    }
}

/**
 * Maneja el envío del formulario con FormData
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(bookForm);
    
    // Procesar tags si existen
    const tagsValue = formData.get('tags');
    if (tagsValue) {
        const tagsArray = tagsValue.split(',').map(t => t.trim()).filter(t => t !== '');
        formData.delete('tags');
        tagsArray.forEach(tag => formData.append('tags', tag));
    }

    try {
        if (isEditing) {
            await api.updateBook(currentBookId, formData);
            ui.showAlert('Libro actualizado exitosamente', 'success');
        } else {
            await api.createBook(formData);
            ui.showAlert('Libro creado exitosamente', 'success');
        }

        bookModal.hide();
        loadBooks();
    } catch (error) {
        ui.showAlert('Error al procesar la solicitud: ' + error.message);
    }
}

/**
 * Maneja la eliminación de un libro
 */
async function handleDeleteBook(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        try {
            await api.deleteBook(id);
            ui.showAlert('Libro eliminado exitosamente', 'success');
            loadBooks();
        } catch (error) {
            ui.showAlert('Error al eliminar el libro: ' + error.message);
        }
    }
}

// Eventos
document.getElementById('btnAddBook').addEventListener('click', prepareAddBook);
bookForm.addEventListener('submit', handleFormSubmit);

// Carga inicial
document.addEventListener('DOMContentLoaded', init);
