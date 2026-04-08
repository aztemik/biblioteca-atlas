const BASE_URL = 'http://localhost:5145/api/v1';

export const api = {
    async getBooksByGenre(genreId) {
        const response = await fetch(`${BASE_URL}/Books/searchBooksByGenre/${genreId}`);
        if (!response.ok) throw new Error('Error al obtener libros por género');
        return await response.json();
    },

    async getBooksByAuthor(authorId) {
        const response = await fetch(`${BASE_URL}/Books/searchBooksByAuthor/${authorId}`);
        if (!response.ok) throw new Error('Error al obtener libros por autor');
        return await response.json();
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

    async createBook(bookFormData) {
        const response = await fetch(`${BASE_URL}/Books`, {
            method: 'POST',
            body: bookFormData
            // No establecemos Content-Type; el navegador lo hará automáticamente con el boundary para multipart/form-data
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear el libro');
        }
        return await response.json();
    },

    async updateBook(id, bookFormData) {
        const response = await fetch(`${BASE_URL}/Books/${id}`, {
            method: 'PUT',
            body: bookFormData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar el libro');
        }
        if (response.status === 204) return null;
        return await response.json();
    },

    async deleteBook(id) {
        const response = await fetch(`${BASE_URL}/Books/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar el libro');
        }
        return true;
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

    async createAuthor(authorData) {
        const response = await fetch(`${BASE_URL}/Authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authorData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear el autor');
        }
        return await response.json();
    },

    async updateAuthor(id, authorData) {
        const response = await fetch(`${BASE_URL}/Authors/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authorData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar el autor');
        }
        if (response.status === 204) return null;
        return await response.json();
    },

    async deleteAuthor(id) {
        const response = await fetch(`${BASE_URL}/Authors/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar el autor');
        }
        return true;
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

    async createGenre(genreData) {
        const response = await fetch(`${BASE_URL}/Genres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(genreData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al crear el género');
        }
        return await response.json();
    },

    async updateGenre(id, genreData) {
        const response = await fetch(`${BASE_URL}/Genres/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(genreData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar el género');
        }
        // Dependiendo de la API, PATCH podría devolver 204 No Content o el objeto actualizado
        if (response.status === 204) return null;
        return await response.json();
    },

    async deleteGenre(id) {
        const response = await fetch(`${BASE_URL}/Genres/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar el género');
        }
        return true;
    }
};
