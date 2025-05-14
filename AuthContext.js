import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedSession = localStorage.getItem('session_id');
        if (storedUser && storedSession) {
            setUser(JSON.parse(storedUser));
            setSessionId(storedSession);
            navigate('/home');
        }
        setLoading(false);
    }, [navigate]);

    const register = async (firstName, lastName, email, phone, password) => {
        try {
            const response = await axios.post('http://localhost/shelfwise/server/api/auth/register.php', {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Register API error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to register.');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost/shelfwise/server/api/auth/login.php', {
                email,
                password
            });
            const { user, session_id } = response.data;
            setUser(user);
            setSessionId(session_id);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('session_id', session_id);
            navigate('/home');
            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Failed to login.');
        }
    };

    const logout = () => {
        setUser(null);
        setSessionId(null);
        localStorage.removeItem('user');
        localStorage.removeItem('session_id');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, sessionId, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};