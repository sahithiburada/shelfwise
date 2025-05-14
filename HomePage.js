import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createBook, getBooks, getAllBooks, updateBook, deleteBook, API_URL } from '../services/book.service';

const HomePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [book, setBook] = useState({
        id: null,
        title: '',
        author_name: '', 
        genre: 'Fiction',
        description: ''
    });
    const [myBooks, setMyBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [myPage, setMyPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('ASC');
    const [totalPages, setTotalPages] = useState(1);

    const [allPage, setAllPage] = useState(1);
    const [allTotalPages, setAllTotalPages] = useState(1);

    const loadMyBooks = useCallback(async () => {
        if (!user?.id) {
            setErrorMsg('User not logged in.');
            return;
        }
        try {
            console.log('Fetching my books URL:', `${API_URL}read.php?user_id=${user.id}&page=${myPage}&per_page=${itemsPerPage}&sort_by=${sortField}&sort_order=${sortOrder}`);
            const data = await getBooks(user.id, myPage, itemsPerPage, sortField, sortOrder);
            console.log('My books response:', data);
            setMyBooks(data.records || []);
            setTotalPages(data.pagination?.total_pages || 1);
        } catch (err) {
            console.error('Load my books error:', err.message, err.response?.data, err.response?.status);
            setErrorMsg('Failed to load your books.');
        }
    }, [user, myPage, itemsPerPage, sortField, sortOrder]);

    const loadAllBooks = useCallback(async () => {
        try {
            console.log('Fetching all books URL:', `${API_URL}read.php?page=${allPage}&per_page=${itemsPerPage}&sort_by=${sortField}&sort_order=${sortOrder}`);
            const data = await getAllBooks(allPage, itemsPerPage, sortField, sortOrder);
            console.log('All books response:', data);
            setAllBooks(data.records || []);
            setAllTotalPages(data.pagination?.total_pages || 1);
        } catch (err) {
            console.error('Load all books error:', err.message, err.response?.data, err.response?.status);
            setErrorMsg('Failed to load all books.');
        }
    }, [allPage, itemsPerPage, sortField, sortOrder]);

    useEffect(() => {
        if (user) {
            console.log('Current user:', user);
            loadMyBooks();
            loadAllBooks();
        }
    }, [user, myPage, sortField, sortOrder, allPage, loadMyBooks, loadAllBooks]);

    const checkBook = () => {
        const validGenres = ['Fiction', 'Science Fiction', 'Romance', 'Fantasy', 'Self Help'];
        if (!book.title || book.title.length < 2) {
            return 'Title must be at least 2 characters.';
        }
        if (!book.author_name || book.author_name.length < 2) {
            return 'Author name must be at least 2 characters.';
        }
        if (!book.genre || !validGenres.includes(book.genre)) {
            return 'Please select a valid genre.';
        }
        return '';
    };

    const onBookChange = (e) => {
        console.log('Field changed:', e.target.name, 'Value:', e.target.value);
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const saveBook = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const validationError = checkBook();
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        try {
            const bookData = {
                id: book.id,
                user_id: user?.id || null,
                title: book.title,
                author_name: book.author_name,
                genre: book.genre,
                description: book.description || ''
            };
            console.log('Sending book data:', bookData);
            if (book.id) {
                const response = await updateBook(bookData);
                console.log('Update book response:', response);
                setSuccessMsg(response.message);
            } else {
                const response = await createBook(bookData);
                console.log('Create book response:', response);
                setSuccessMsg(response.message);
            }
            setBook({ id: null, title: '', author_name: '', genre: 'Fiction', description: '' }); 
            loadMyBooks();
            loadAllBooks();
        } catch (err) {
            console.error('Book submission error:', err.message, err.response?.data, err.response?.status);
            setErrorMsg(err.response?.data?.message || 'Failed to save book.');
        }
    };

    const editBook = (book) => {
        setBook({
            id: book.id,
            title: book.title,
            author_name: book.author_name || '', 
            genre: book.genre,
            description: book.description || ''
        });
    };

    const removeBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await deleteBook(bookId, user?.id);
                setSuccessMsg(response.message);
                loadMyBooks();
                loadAllBooks();
            } catch (err) {
                setErrorMsg(err.response?.data?.message || 'Failed to delete book.');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">ShelfWise</h1>
                    <p className="text-sm text-gray-600">Manage your personal book collection.</p>
                </div>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">{book.id ? 'Edit Book' : 'Add New Book'}</h2>
                    <p className="text-sm text-gray-600 mb-4">Manage your book collection.</p>
                    <form onSubmit={saveBook} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={book.title}
                                onChange={onBookChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                type="text"
                                name="author_name"
                                value={book.author_name}
                                onChange={onBookChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Genre</label>
                            <select
                                name="genre"
                                value={book.genre}
                                onChange={onBookChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            >
                                <option value="Fiction">Fiction</option>
                                <option value="Science Fiction">Science Fiction</option>
                                <option value="Romance">Romance</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Self Help">Self Help</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={book.description}
                                onChange={onBookChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
                        >
                            {book.id ? 'Update Book' : 'Add Book'}
                        </button>
                        {book.id && (
                            <button
                                type="button"
                                onClick={() => setBook({ id: null, title: '', author_name: '', genre: 'Fiction', description: '' })}
                                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 mt-2"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                    {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
                    {errorMsg && <p className="mt-2 text-red-600">{errorMsg}</p>}
                </div>
                <div className="w-full md:w-2/3 p-4 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Your Books</h2>
                    <p className="text-sm text-gray-600 mb-4">Browse, sort, and manage your books.</p>
                    <div className="mb-4 flex space-x-4">
                        <select
                            value={sortField}
                            onChange={(e) => { setSortField(e.target.value); setMyPage(1); }}
                            className="p-2 border rounded-md"
                        >
                            <option value="title">Sort by Title</option>
                            <option value="author_name">Sort by Author</option>
                            <option value="genre">Sort by Genre</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => { setSortOrder(e.target.value); setMyPage(1); }}
                            className="p-2 border rounded-md"
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Title</th>
                                <th className="p-2 border">Author</th>
                                <th className="p-2 border">Genre</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBooks.map((book) => (
                                <tr key={book.id} className="border-t">
                                    <td className="p-2">{book.title}</td>
                                    <td className="p-2">{book.author_name}</td>
                                    <td className="p-2">{book.genre}</td>
                                    <td className="p-2">
                                        <button onClick={() => editBook(book)} className="text-blue-500 mr-2">✎</button>
                                        <button onClick={() => removeBook(book.id)} className="text-red-500">🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {myBooks.length === 0 && <p className="mt-2 text-gray-600">No books found.</p>}
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => setMyPage((prev) => Math.max(prev - 1, 1))}
                            disabled={myPage === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {myPage} of {totalPages}</span>
                        <button
                            onClick={() => setMyPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={myPage === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Browse All Books</h2>
                <p className="text-sm text-gray-600 mb-4">View books added by all users.</p>
                <div className="mb-4 flex space-x-4">
                    <select
                        value={sortField}
                        onChange={(e) => { setSortField(e.target.value); setAllPage(1); }}
                        className="p-2 border rounded-md"
                    >
                        <option value="title">Sort by Title</option>
                        <option value="author_name">Sort by Author</option>
                        <option value="genre">Sort by Genre</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => { setSortOrder(e.target.value); setAllPage(1); }}
                        className="p-2 border rounded-md"
                    >
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </select>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Author</th>
                            <th className="p-2 border">Genre</th>
                            <th className="p-2 border">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBooks.map((book) => (
                            <tr key={book.id} className="border-t">
                                <td className="p-2">{book.title}</td>
                                <td className="p-2">{book.author_name}</td>
                                <td className="p-2">{book.genre}</td>
                                <td className="p-2">{book.description || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allBooks.length === 0 && <p className="mt-2 text-gray-600">No books found.</p>}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setAllPage((prev) => Math.max(prev - 1, 1))}
                        disabled={allPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {allPage} of {allTotalPages}</span>
                    <button
                        onClick={() => setAllPage((prev) => Math.min(prev + 1, allTotalPages))}
                        disabled={allPage === allTotalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;