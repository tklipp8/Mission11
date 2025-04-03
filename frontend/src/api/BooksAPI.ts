import { Book } from "../types/Book";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
    totalPages: number;
}

const API_URL = "https://mission13-lloyd-backend-gmh5b6aadncpenec.eastus-01.azurewebsites.net/Book";

export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    sortOrder: string,
    selectedCategories: string[],
): Promise<FetchBooksResponse> => {
    try {
        const categoryParams = selectedCategories
            .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
            .join('&');

        const response = await fetch(
            `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`,
            {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch books`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const fetchBookCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/GetBookCategories`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch book categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book categories:', error);
        throw error;
    }
};

export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(newBook),
        });

        if (!response.ok) {
            throw new Error("Failed to add book");
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding book:", error);
        throw error;
    }
};

export const updateBook = async (bookId: number, updatedBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/Update/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(updatedBook),
        });

        if (!response.ok) {
            throw new Error(`Failed to update book: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};

export const deleteBook = async (bookId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/Delete/${bookId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}; 