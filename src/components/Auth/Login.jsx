import React from 'react';
import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:9001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            login(data.token); // Store the token
            navigate('/home'); // Redirect to home page
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="PeerLearn">
            <Stack
                component="form"
                spacing={2}
                sx={{ mt: 3 }}
                onSubmit={handleSubmit}
            >
                <Divider />

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    Don't have an account?
                    <Button
                        variant="text"
                        onClick={() => navigate('/signup')}
                    >
                        Create an account
                    </Button>
                </Typography>
            </Stack>
        </AuthLayout>
    );
};

export default Login;