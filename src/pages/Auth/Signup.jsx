import React, { useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Paper,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signupUser } from '../../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await signupUser(form); // sends POST to backend

            // Decode JWT payload
            const payload = JSON.parse(atob(data.token.split('.')[1]));

            // Store token and login
            localStorage.setItem('token', data.token);
            login({ email: payload.email, role: payload.role });

            setError('');
            navigate('/home');
        } catch (err) {
            console.error('Signup failed:', err.message);
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
                <Typography variant="h5" gutterBottom>Sign Up</Typography>

                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
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
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={form.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Grader">Grader</MenuItem>
                            <MenuItem value="Instructor">Instructor</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                        REGISTER
                    </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{' '}
                    <Link href="/" underline="hover">
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Signup;
