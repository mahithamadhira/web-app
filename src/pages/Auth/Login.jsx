import React, { useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Paper,
    Box,
    Link,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await login(form); // this includes token + role

            console.log('Logged in user:', user);

            if (user.role === 'Instructor') {
                navigate('/instructor');
            } else if (user.role === 'Student') {
                navigate('/student');
            } else if (user.role === 'Grader') {
                navigate('/grader');
            } else {
                navigate('/home');
            }

            setError('');
        } catch (err) {
            console.error('Login failed:', err.message);
            setError(err.message);
        }
    };


    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f7f9fb',
            }}
        >
            <Paper elevation={3} sx={{ width: 400, p: 4 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>

                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                        LOGIN
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Don’t have an account?{' '}
                        <Link href="/signup" underline="hover">Sign up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
