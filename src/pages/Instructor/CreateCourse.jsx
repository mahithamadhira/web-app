import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateCourse = () => {
    const [form, setForm] = useState({
        courseName: '',
        startDate: '',
        endDate: ''
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.courseName || !form.startDate || !form.endDate) {
            alert('⚠️ Please fill all fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:9001/api/auth/insertCourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}` // ✅ FIXED
                },
                body: JSON.stringify({
                    courseName: form.courseName,
                    instructorID: user.id,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    isArchived: false
                })
            });

            if (!res.ok) throw new Error('Failed to create course');

            alert('✅ Course created successfully!');
            navigate('/instructor');
        } catch (err) {
            console.error('❌ Error creating course:', err);
            alert('Error creating course');
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h5" mb={2}>Create New Course</Typography>
            <Paper sx={{ p: 3, maxWidth: 600 }}>
                <TextField
                    fullWidth label="Course Name" name="courseName"
                    value={form.courseName} onChange={handleChange} margin="normal"
                />
                <TextField
                    fullWidth type="date" name="startDate" label="Start Date"
                    value={form.startDate} onChange={handleChange}
                    margin="normal" InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth type="date" name="endDate" label="End Date"
                    value={form.endDate} onChange={handleChange}
                    margin="normal" InputLabelProps={{ shrink: true }}
                />

                <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                    Create Course
                </Button>
            </Paper>
        </Box>
    );
};

export default CreateCourse;
