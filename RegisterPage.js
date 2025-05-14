import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [authData, setAuthData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await register(
                authData.first_name,
                authData.last_name,
                authData.email,
                authData.phone,
                authData.password
            );
            setSuccess(response.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Registration failed.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">ShelfWise</h1>
                    <p className="text-sm text-gray-600">Manage your personal book collection.</p>
                </div>
            </div>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={authData.first_name}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={authData.last_name}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (Gmail only)</label>
                        <input
                            type="email"
                            name="email"
                            value={authData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone (e.g., +1234567890)</label>
                        <input
                            type="text"
                            name="phone"
                            value={authData.phone}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={authData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </button>
                </p>
                {success && <p className="mt-2 text-green-600">{success}</p>}
                {error && <p className="mt-2 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;