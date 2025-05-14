import axios from 'axios';

   export const API_URL = 'http://localhost/shelfwise/server/api/books/';

   export const createBook = async (bookData) => {
       const response = await axios.post(`${API_URL}create.php`, bookData);
       return response.data;
   };

   export const getBooks = async (userId, page, perPage, sortBy, sortOrder) => {
       const response = await axios.get(`${API_URL}read.php`, {
           params: { user_id: userId, page, per_page: perPage, sort_by: sortBy, sort_order: sortOrder }
       });
       return response.data;
   };

   export const getAllBooks = async (page, perPage, sortBy, sortOrder) => {
       const response = await axios.get(`${API_URL}read.php`, {
           params: { page, per_page: perPage, sort_by: sortBy, sort_order: sortOrder }
       });
       return response.data;
   };

   export const updateBook = async (bookData) => {
       const response = await axios.post(`${API_URL}update.php`, bookData);
       return response.data;
   };

   export const deleteBook = async (bookId, userId) => {
       const response = await axios.post(`${API_URL}delete.php`, { id: bookId, user_id: userId });
       return response.data;
   };