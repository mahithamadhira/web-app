import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const CreateAssignment = () => {
    const [step, setStep] = useState(1);
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        deadline: '',
        maxscore: 100,
        weightage: 10
    });
    const coursename = location.state;
    const [rubrics, setRubrics] = useState([]);
    const [newRubric, setNewRubric] = useState({ criterianame: '', description: '', maxscore: 100 });
    const [existingRubricId, setExistingRubricId] = useState('');
    const [existingCriteria, setExistingCriteria] = useState([]);
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseId = parseInt(searchParams.get('course'));
    console.log("course: ", coursename);

    useEffect(() => {
        const fetchExistingRubrics = async () => {
            try {
                const res = await fetch(`http://localhost:9001/api/auth/getCriteriaByCourseId/${courseId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await res.json();
                setExistingCriteria(data);
            } catch (err) {
                console.error('❌ Failed to fetch existing criteria:', err);
            }
        };

        fetchExistingRubrics();
    }, [courseId, user.token]);

    const handleAssignmentChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (!assignment.title || !assignment.deadline) return alert('Fill all required fields.');
        setStep(2);
    };

    const addNewRubric = () => {
        if (!newRubric.criterianame) return;
        setRubrics([...rubrics, { ...newRubric }]);
        setNewRubric({ criterianame: '', description: '', maxscore: 100 });
    };

    const addExistingRubric = () => {
        if (!existingRubricId) return;
        setRubrics([...rubrics, { criteriaid: parseInt(existingRubricId) }]);
        setExistingRubricId('');
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:9001/api/auth/createAssignmentWithRubrics', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assignment: { ...assignment, courseid: courseId },
                    rubrics
                })
            });

            if (!res.ok) throw new Error('Failed to create assignment');
            alert('✅ Assignment created successfully!');
            console.log(coursename);
            navigate(`/course/${courseId}`, {
                state: {
                    id: courseId,
                    name: "Web Development",        // or fetch full course info if needed
                    startDate: new Date().toISOString().split('T')[0], // placeholder
                    endDate: new Date().toISOString().split('T')[0],   // placeholder
                    isArchived: false
                }
            });

        } catch (err) {
            console.error('Error:', err);
            alert('❌ Error creating assignment');
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h5" mb={2}>Create Assignment</Typography>

            {step === 1 && (
                <Paper sx={{ p: 3 }}>
                    <TextField fullWidth label="Title" name="title" margin="normal"
                               value={assignment.title} onChange={handleAssignmentChange} />
                    <TextField fullWidth label="Description" name="description" margin="normal"
                               multiline rows={3} value={assignment.description} onChange={handleAssignmentChange} />
                    <TextField fullWidth type="date" label="Deadline" name="deadline" margin="normal"
                               InputLabelProps={{ shrink: true }}
                               value={assignment.deadline} onChange={handleAssignmentChange} />
                    <TextField fullWidth label="Max Score" name="maxscore" margin="normal" type="number"
                               value={assignment.maxscore} onChange={handleAssignmentChange} />
                    <TextField fullWidth label="Weightage (%)" name="weightage" margin="normal" type="number"
                               value={assignment.weightage} onChange={handleAssignmentChange} />

                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
                        Next: Add Rubrics
                    </Button>
                </Paper>
            )}

            {step === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Add Rubrics</Typography>

                    <Box display="flex" gap={2} mb={2}>
                        <TextField label="Criteria Name" value={newRubric.criterianame}
                                   onChange={(e) => setNewRubric({ ...newRubric, criterianame: e.target.value })} />
                        <TextField label="Description" value={newRubric.description}
                                   onChange={(e) => setNewRubric({ ...newRubric, description: e.target.value })} />
                        <TextField label="Max Score" type="number" value={newRubric.maxscore}
                                   onChange={(e) => setNewRubric({ ...newRubric, maxscore: Number(e.target.value) })} />
                        <Button variant="outlined" onClick={addNewRubric}>Add</Button>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Existing Rubric</InputLabel>
                        <Select
                            value={existingRubricId}
                            label="Select Existing Rubric"
                            onChange={(e) => setExistingRubricId(e.target.value)}
                        >
                            {existingCriteria.map((crit) => (
                                <MenuItem key={crit.criteriaid} value={crit.criteriaid}>
                                    {crit.criterianame}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button sx={{ mt: 1 }} onClick={addExistingRubric}>Add Existing</Button>
                    </FormControl>

                    <Box mt={2}>
                        <Typography>Rubrics Added:</Typography>
                        <ul>
                            {rubrics.map((r, i) => (
                                <li key={i}>
                                    {r.criteriaid
                                        ? `Existing Rubric ID: ${r.criteriaid}`
                                        : `${r.criterianame} (Max ${r.maxscore})`}
                                </li>
                            ))}
                        </ul>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button onClick={() => setStep(1)}>← Back</Button>
                        <Button variant="contained" onClick={handleSubmit}>Create Assignment</Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default CreateAssignment;
