# ShelfWise Book Management System

ShelfWise is a full-stack web application designed to help users manage their personal book collections efficiently. Built with a React frontend and PHP backend, it provides a seamless experience for adding, editing, viewing, and deleting books, along with secure user authentication using JWT. The app is styled with Tailwind CSS for a responsive and modern UI, and it leverages MySQL for data persistence.

## Features
- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens).
- **Book Management**:
  - Create, read, update, and delete (CRUD) books.
  - View a paginated and sortable list of books.
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly and modern interface.
- **RESTful API**: Backend provides API endpoints for seamless frontend-backend communication.

## Tech Stack
- **Frontend**:
  - React: For building dynamic UI components.
  - react-router-dom: For client-side routing.
  - react-hook-form: For form handling and validation.
  - Tailwind CSS: For styling and responsive design.
- **Backend**:
  - PHP: For server-side logic and API endpoints.
  - MySQL: For storing user and book data.
  - firebase/php-jwt: For JWT-based authentication.
  - PHPMailer: For sending emails.
- **Tools**:
  - XAMPP: Local development server.
  - Composer: PHP dependency management.
  - Git: Version control.

## Setup Instructions
Follow these steps to set up ShelfWise locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sahithiburada/shelfwise.git
   cd shelfwise
