// ✅ src/pages/Instructor/RubricsSetup.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    MenuItem,
    Select,
    TextField,
    Button,
    Chip,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const RubricsSetup = () => {
    const navigate = useNavigate();
    const [availableRubrics, setAvailableRubrics] = useState([
        { id: 1, name: 'Clarity', description: 'Is the answer clearly explained?' },
        { id: 2, name: 'Completeness', description: 'Does the submission address all parts of the question?' },
        { id: 3, name: 'Originality', description: 'Is the work original and free of plagiarism?' }
    ]);

    const [selectedRubrics, setSelectedRubrics] = useState([]);
    const [newCriterion, setNewCriterion] = useState({ name: '', description: '' });
    const [selectedId, setSelectedId] = useState('');
    const [assignmentData, setAssignmentData] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('newAssignment');
        if (stored) setAssignmentData(JSON.parse(stored));
    }, []);

    const handleAddExisting = () => {
        const rubric = availableRubrics.find(r => r.id === parseInt(selectedId));
        if (rubric && !selectedRubrics.find(r => r.id === rubric.id)) {
            setSelectedRubrics([...selectedRubrics, rubric]);
        }
        setSelectedId('');
    };

    const handleAddNew = () => {
        if (newCriterion.name && newCriterion.description) {
            const id = Date.now();
            const newRubric = { ...newCriterion, id };
            setAvailableRubrics([...availableRubrics, newRubric]);
            setSelectedRubrics([...selectedRubrics, newRubric]);
            setNewCriterion({ name: '', description: '' });
        }
    };

    const handleDeleteRubric = (idToRemove) => {
        setSelectedRubrics(selectedRubrics.filter(r => r.id !== idToRemove));
    };

    const handleSubmit = () => {
        const payload = {
            ...assignmentData,
            rubrics: selectedRubrics
        };
        console.log('✅ Final Assignment Payload:', payload);
        alert('Assignment Created Successfully!');
        localStorage.removeItem('newAssignment');
        navigate(`/course/${assignmentData.course}`);
    };

    return (
        <>
            <Navbar />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    Add Rubrics for: {assignmentData?.title}
                </Typography>

                <Card sx={{ maxWidth: 700 }}>
                    <CardContent>
                        <Typography variant="h6">Select Existing Criteria</Typography>
                        <Box display="flex" gap={2} mt={1} mb={2}>
                            <Select
                                fullWidth
                                displayEmpty
                                value={selectedId}
                                onChange={e => setSelectedId(e.target.value)}
                            >
                                <MenuItem value="" disabled>Select Criterion</MenuItem>
                                {availableRubrics.map(r => (
                                    <MenuItem key={r.id} value={r.id}>
                                        {r.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button onClick={handleAddExisting} variant="outlined">Add</Button>
                        </Box>

                        <Typography variant="h6" mt={2}>Or Add New Criterion</Typography>
                        <Box display="flex" flexDirection="column" gap={2} mt={1} mb={2}>
                            <TextField
                                label="Name"
                                name="name"
                                value={newCriterion.name}
                                onChange={e => setNewCriterion({ ...newCriterion, name: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={newCriterion.description}
                                onChange={e => setNewCriterion({ ...newCriterion, description: e.target.value })}
                                multiline
                                rows={3}
                            />
                            <Button onClick={handleAddNew} variant="outlined">Add</Button>
                        </Box>

                        <Typography variant="h6" mt={2}>Selected Rubrics</Typography>
                        <Stack direction="column" gap={1} mt={1}>
                            {selectedRubrics.map(r => (
                                <Chip
                                    key={r.id}
                                    label={`${r.name} – ${r.description}`}
                                    onDelete={() => handleDeleteRubric(r.id)}
                                    sx={{ maxWidth: '100%' }}
                                />
                            ))}
                        </Stack>

                        <Button
                            variant="contained"
                            sx={{ mt: 4 }}
                            fullWidth
                            disabled={selectedRubrics.length === 0}
                            onClick={handleSubmit}
                        >
                            Submit Assignment
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default RubricsSetup;
