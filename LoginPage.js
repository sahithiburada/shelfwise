import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [authData, setAuthData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(authData.email, authData.password);
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Login failed.');
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
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
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
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </button>
                </p>
                {error && <p className="mt-2 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;