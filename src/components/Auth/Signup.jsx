import React from 'react';
import {
    Button,
    Divider,
    Stack,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { ArrowDropDown } from "@mui/icons-material";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:9001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role === 'parent' ? 'Student' :
                        formData.role === 'teacher' ? 'Teacher' :
                            formData.role === 'student' ? 'Grader' : ''
                })
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            console.log('Signup successful:', data);
            navigate('/login'); // Redirect to login after successful signup
        } catch (error) {
            console.error('Signup error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout title="Create an account">
            <Stack
                component="form"
                spacing={2}
                sx={{ mt: 3 }}
                onSubmit={handleSubmit}
            >
                <Divider />

                <TextField
                    label="Full Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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

                <FormControl fullWidth variant="outlined">
                    <InputLabel>Role</InputLabel>
                    <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                        IconComponent={ArrowDropDown}
                        required
                    >
                        <MenuItem value="parent">Student</MenuItem>
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="student">Grader</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    Already have an account?
                    <Button
                        variant="text"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                </Typography>
            </Stack>
        </AuthLayout>
    );
};

export default Signup;