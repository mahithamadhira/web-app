import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Alert,
    Stack,
    Box,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [courses, setCourses] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Step 1 form data
    const [assignmentData, setAssignmentData] = useState({
        courseId: '',
        title: '',
        description: '',
        deadline: '',
        maxScore: '',
        weightage: ''
    });

    // Step 2 form data
    const [rubrics, setRubrics] = useState([]);

    // Fetch courses for the instructor
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                const response = await fetch('http://localhost:9001/api/auth/fetchcoursesbyuserid', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authData.token}`
                    }
                });
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError('Failed to fetch courses');
            }
        };
        fetchCourses();
    }, []);

    // Fetch criteria when course is selected in step 2
    const fetchCriteria = async (courseId) => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const response = await fetch(`http://localhost:9001/api/auth/getCriteriaByCourseId/${courseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authData.token}`
                }
            });
            const data = await response.json();
            setCriteria(data);
        } catch (err) {
            setError('Failed to fetch criteria');
        }
    };

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addExistingCriteria = () => {
        setRubrics([...rubrics, { type: 'existing', criteriaId: '', maxScore: '' }]);
    };

    const addNewCriteria = () => {
        setRubrics([...rubrics, { type: 'new', name: '', description: '', maxScore: '' }]);
    };

    const removeRubric = (index) => {
        const updatedRubrics = [...rubrics];
        updatedRubrics.splice(index, 1);
        setRubrics(updatedRubrics);
    };

    const handleRubricChange = (index, field, value) => {
        const updatedRubrics = [...rubrics];
        updatedRubrics[index][field] = value;
        setRubrics(updatedRubrics);
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!assignmentData.courseId || !assignmentData.title || !assignmentData.deadline) {
                setError('Please fill all required fields');
                return;
            }
            await fetchCriteria(assignmentData.courseId);
            setStep(2);
        } else {
            try {
                setLoading(true);
                setError('');
                setSuccess('');

                const authData = JSON.parse(localStorage.getItem('auth'));
                const payload = {
                    assignment: {
                        courseid: parseInt(assignmentData.courseId),
                        title: assignmentData.title,
                        description: assignmentData.description,
                        deadline: assignmentData.deadline,
                        maxscore: parseInt(assignmentData.maxScore),
                        weightage: parseInt(assignmentData.weightage)
                    },
                    rubrics: rubrics.map(rubric => {
                        if (rubric.type === 'existing') {
                            return { criteriaid: parseInt(rubric.criteriaId) };
                        } else {
                            return {
                                criterianame: rubric.name,
                                description: rubric.description,
                                maxscore: parseInt(rubric.maxScore)
                            };
                        }
                    })
                };

                const response = await fetch('http://localhost:9001/api/auth/createAssignmentWithRubrics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Failed to create assignment');
                }

                setSuccess('Assignment created successfully!');
                setTimeout(() => navigate('/'), 1500);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar showInstructorOptions={user?.role === 'Instructor'} />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Create New Assignment {step === 1 ? '(Basic Details)' : '(Evaluation Rubrics)'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    {step === 1 ? (
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel>Course *</InputLabel>
                                <Select
                                    name="courseId"
                                    value={assignmentData.courseId}
                                    onChange={handleAssignmentChange}
                                    label="Course *"
                                    required
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course.courseid} value={course.courseid}>
                                            {course.coursename}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                required
                                fullWidth
                                label="Assignment Title *"
                                name="title"
                                value={assignmentData.title}
                                onChange={handleAssignmentChange}
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={assignmentData.description}
                                onChange={handleAssignmentChange}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Deadline *"
                                type="date"
                                name="deadline"
                                value={assignmentData.deadline}
                                onChange={handleAssignmentChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Max Score *"
                                type="number"
                                name="maxScore"
                                value={assignmentData.maxScore}
                                onChange={handleAssignmentChange}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Weightage (%) *"
                                type="number"
                                name="weightage"
                                value={assignmentData.weightage}
                                onChange={handleAssignmentChange}
                            />
                        </Stack>
                    ) : (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Peerlearn Evaluation Rubric
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={addExistingCriteria}
                                    variant="outlined"
                                >
                                    Add Existing Criteria
                                </Button>
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={addNewCriteria}
                                    variant="outlined"
                                >
                                    Add New Criteria
                                </Button>
                            </Box>

                            {rubrics.map((rubric, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                                    <IconButton
                                        sx={{ position: 'absolute', right: 8, top: 8 }}
                                        onClick={() => removeRubric(index)}
                                        color="error"
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>

                                    {rubric.type === 'existing' ? (
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel>Select Criteria</InputLabel>
                                            <Select
                                                value={rubric.criteriaId}
                                                onChange={(e) => handleRubricChange(index, 'criteriaId', e.target.value)}
                                                label="Select Criteria"
                                                required
                                            >
                                                {criteria.map((criterion) => (
                                                    <MenuItem key={criterion.criteriaid} value={criterion.criteriaid}>
                                                        {criterion.criterianame}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Stack spacing={2} sx={{ mt: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Criteria Name"
                                                value={rubric.name}
                                                onChange={(e) => handleRubricChange(index, 'name', e.target.value)}
                                                required
                                            />
                                            <TextField
                                                fullWidth
                                                label="Description"
                                                multiline
                                                rows={2}
                                                value={rubric.description}
                                                onChange={(e) => handleRubricChange(index, 'description', e.target.value)}
                                                required
                                            />
                                        </Stack>
                                    )}
                                </Paper>
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => step === 1 ? navigate('/') : setStep(1)}
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? (
                                'Processing...'
                            ) : step === 1 ? (
                                'Next'
                            ) : (
                                'Create Assignment'
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateAssignment;