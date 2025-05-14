
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.first_name || formData.first_name.length < 3) {
            return 'First name must be at least 3 characters.';
        }
        if (!formData.last_name || formData.last_name.length < 3) {
            return 'Last name must be at least 3 characters.';
        }
        if (!formData.email || !formData.email.endsWith('@gmail.com')) {
            return 'Email must be a valid Gmail address.';
        }
        if (!formData.phone || !/^\+[0-9]{1,4}[0-9]{6,14}$/.test(formData.phone)) {
            return 'Phone must include country code (e.g., +1234567890).';
        }
        if (!formData.password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.{8,})/.test(formData.password)) {
            return 'Password must be 8+ characters with 1 uppercase, 1 number, 1 special character.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData); // Debug log

        // Client-side validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost/shelfwise/server/api/auth/register.php', formData);
            console.log('Registration response:', response.data); // Debug log
            setMessage(response.data.message);
            setFormData({ first_name: '', last_name: '', email: '', phone: '', password: '' });
        } catch (err) {
            console.error('Registration error:', err.response?.data || err); // Debug log
            setError(err.response?.data?.message || 'Registration failed. Please check your input.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email (Gmail only):</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Phone (e.g., +1234567890):</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password (8+ chars, 1 upper, 1 number, 1 special):</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Register
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default Register;