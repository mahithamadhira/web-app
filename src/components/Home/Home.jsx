import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Card,
    CardContent,
    Button
} from '@mui/material';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const role = user?.role || 'student';

    // Sample data
    const courses = [
        { id: 1, title: 'Introduction to React', description: 'Learn React fundamentals' },
        { id: 2, title: 'Advanced JavaScript', description: 'Master modern JS patterns' }
    ];

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar showInstructorOptions={role === 'instructor'} />

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
                    {courses.map((course) => (
                        <Card key={course.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
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