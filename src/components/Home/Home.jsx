import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const role = user?.role || 'student';
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sample data for other sections
    const deadlines = [
        { id: 1, title: 'Project 1', course: 'React', dueDate: '2025-04-05' },
        { id: 2, title: 'Quiz 2', course: 'JavaScript', dueDate: '2025-04-07' }
    ];

    const assignmentsToReview = [
        { id: 1, title: 'Project 1', course: 'React', feedback: 'Good work! Needs more comments.' }
    ];

    const assignmentsToGrade = [
        { id: 1, title: 'Project 1', course: 'React', student: 'John Doe' },
        { id: 2, title: 'Quiz 1', course: 'JavaScript', student: 'Jane Smith' }
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const authData = JSON.parse(localStorage.getItem('auth'));
                if (!authData?.token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch('http://localhost:9001/api/auth/fetchcoursesbyuserid', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }

                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar showInstructorOptions={role === 'Instructor'} />

            {/* Main Content */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                p: 3,
                maxWidth: '800px',
                mx: 'auto',
                width: '100%'
            }}>
                {/* Top Section - Courses */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        My Courses
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : courses.length === 0 ? (
                        <Typography>No courses found</Typography>
                    ) : (
                        courses.map((course) => (
                            <Card key={course.courseid} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {course.coursename}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(course.startdate).toLocaleDateString()} - {new Date(course.enddate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Status: {course.isarchived ? 'Archived' : 'Active'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>

                {/* Middle Section - Deadlines */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Upcoming Deadlines
                    </Typography>
                    {deadlines.map((deadline) => (
                        <Paper key={deadline.id} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">
                                {deadline.title}
                            </Typography>
                            <Typography variant="body2">
                                {deadline.course} - Due: {deadline.dueDate}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

                {/* Centered Horizontal Divider */}
                <Divider sx={{
                    my: 4,
                    mx: 'auto',
                    width: '100%',
                    borderBottomWidth: 2
                }} />

                {/* Bottom Section - Role Specific Content */}
                <Box>
                    {/* For Students */}
                    {role === 'student' && (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Assignments to Review
                            </Typography>
                            {assignmentsToReview.map((assignment) => (
                                <Paper key={assignment.id} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="h6">
                                        {assignment.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        Course: {assignment.course}
                                    </Typography>
                                    <Typography variant="body2">
                                        Feedback: {assignment.feedback}
                                    </Typography>
                                </Paper>
                            ))}
                        </>
                    )}

                    {/* For Graders */}
                    {role === 'grader' && (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Assignments to Grade
                            </Typography>
                            {assignmentsToGrade.map((assignment) => (
                                <Paper key={assignment.id} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="h6">
                                        {assignment.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        Course: {assignment.course}
                                    </Typography>
                                    <Typography variant="body2">
                                        Student: {assignment.student}
                                    </Typography>
                                    <Button variant="contained" size="small" sx={{ mt: 1 }}>
                                        Grade Assignment
                                    </Button>
                                </Paper>
                            ))}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Home;