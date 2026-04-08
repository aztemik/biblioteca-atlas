const BASE_URL = 'http://localhost:5145/api/v1';

export const api = {
    async getBooksByGenre(genreId) {
        const response = await fetch(`${BASE_URL}/Books`);
        if (!response.ok) throw new Error('Error al obtener libros por género');
        const books = await response.json();
        return books.filter(b => b.genreId == genreId);
    },

    async getAllBooks() {
        const response = await fetch(`${BASE_URL}/Books`);
        if (!response.ok) throw new Error('Error al obtener todos los libros');
        return await response.json();
    },

    async getBooks(pageNumber = 1, pageSize = 9) {

        const response = await fetch(`${BASE_URL}/Books/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error('Error al obtener libros');
        return await response.json();
    },

    async getBookById(id) {
        const response = await fetch(`${BASE_URL}/Books/${id}`);
        if (!response.ok) throw new Error('Error al obtener el libro');
        return await response.json();
    },

    async getAuthors() {
        const response = await fetch(`${BASE_URL}/Authors`);
        if (!response.ok) throw new Error('Error al obtener autores');
        return await response.json();
    },

    async getAuthorsPaged(pageNumber = 1, pageSize = 5) {
        const response = await fetch(`${BASE_URL}/Authors/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error('Error al obtener autores paginados');
        return await response.json();
    },

    async getAuthorById(id) {
        const response = await fetch(`${BASE_URL}/Authors/${id}`);
        if (!response.ok) throw new Error('Error al obtener el autor');
        return await response.json();
    },

    async getGenres() {
        const response = await fetch(`${BASE_URL}/Genres`);
        if (!response.ok) throw new Error('Error al obtener géneros');
        return await response.json();
    },

    async getGenreById(id) {
        const response = await fetch(`${BASE_URL}/Genres/${id}`);
        if (!response.ok) throw new Error('Error al obtener el género');
        return await response.json();
    },

    async getTags() {
        const response = await fetch(`${BASE_URL}/Tags`);
        if (!response.ok) throw new Error('Error al obtener etiquetas');
        return await response.json();
    }
};
