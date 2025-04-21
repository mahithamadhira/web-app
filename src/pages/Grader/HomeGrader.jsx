import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const HomeGrader = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const name = user?.name || 'Grader';

    const [courses, setCourses] = useState([]);
    const [peerReviewAssignments, setPeerReviewAssignments] = useState([]);
    const [gradingAssignments, setGradingAssignments] = useState([]);
    const [personalAssignments, setPersonalAssignments] = useState([]);

    useEffect(() => {
        // Registered Courses
        const storedCourses = JSON.parse(localStorage.getItem('graderCourses'));
        const defaultCourses = [
            { name: 'DBMS', startDate: '2025-03-01', endDate: '2025-05-15' },
            { name: 'Cryptography', startDate: '2025-03-05', endDate: '2025-05-20' }
        ];
        const courses = storedCourses?.length ? storedCourses : defaultCourses;
        if (!storedCourses) {
            localStorage.setItem('graderCourses', JSON.stringify(defaultCourses));
        }
        setCourses(courses);

        // Peer Review Tasks
        const storedPeerReviews = JSON.parse(localStorage.getItem('assignedPeerReviews'));
        const defaultPeerReviews = [
            {
                reviewId: 101,
                title: 'DBMS Assignment 1',
                course: 'DBMS',
                dueDate: '2025-04-22',
                reviewer: name,
                target: 'alice', // ✅ Add this
                feedback: '',
                score: '',
            }
        ];

        const peerReviews = storedPeerReviews?.length ? storedPeerReviews : defaultPeerReviews;
        if (!storedPeerReviews) {
            localStorage.setItem('assignedPeerReviews', JSON.stringify(defaultPeerReviews));
        }
        setPeerReviewAssignments(peerReviews.filter(r => r.reviewer === name));

        // Grading Tasks
        const storedGrading = JSON.parse(localStorage.getItem('assignedGradingTasks'));
        const defaultGrading = [
            {
                assignmentId: 3,
                title: 'To-Do List App',
                course: 'Web Development',
                submissions: [

                ],
            }
        ];
        const grading = storedGrading?.length ? storedGrading : defaultGrading;
        if (!storedGrading) {
            localStorage.setItem('assignedGradingTasks', JSON.stringify(defaultGrading));
        }
        setGradingAssignments(grading);

        // Assignments for registered courses
        const storedAssignments = JSON.parse(localStorage.getItem('assignments'));
        const defaultAssignments = [
            {
                id: 301,
                title: 'DBMS Quiz',
                course: 'DBMS',
                dueDate: '2025-04-28'
            },
            {
                id: 302,
                title: 'Crypto Assignment',
                course: 'Cryptography',
                dueDate: '2025-05-01'
            }
        ];
        const assignments = storedAssignments?.length ? storedAssignments : defaultAssignments;
        if (!storedAssignments) {
            localStorage.setItem('assignments', JSON.stringify(defaultAssignments));
        }
        const personal = assignments.filter(a => courses.map(c => c.name).includes(a.course));
        setPersonalAssignments(personal);
    }, [name]);



    return (
        <>
            <Navbar />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {name}
                </Typography>

                {/* Registered Courses */}
                <Typography variant="h6" mt={4}>📚 Registered Courses</Typography>
                {courses.length === 0 ? (
                    <Typography color="text.secondary">No courses registered.</Typography>
                ) : (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <List>
                                {courses.map((c, i) => (
                                    <ListItem
                                        key={i}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (user?.role === 'Instructor') {
                                                navigate(`/course/${c.name}`);
                                            } else {
                                                navigate(`/student/course/${c.name}`);
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={c.name}
                                            secondary={`Start: ${c.startDate} | End: ${c.endDate}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}

                {/* Assigned Peer Reviews */}
                <Typography variant="h6" mt={5}>🧪 Assigned Peer Reviews</Typography>
                {peerReviewAssignments.length === 0 ? (
                    <Typography color="text.secondary">No peer reviews assigned.</Typography>
                ) : (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <List>
                                {peerReviewAssignments.map((pr, i) => (
                                    <ListItem
                                        key={i}
                                        secondaryAction={
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/peer-review/${pr.reviewId}`)} // ✅ updated to match student flow
                                            >
                                                Review
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={pr.title || pr.assignmentTitle || 'Untitled Assignment'}
                                            secondary={`Student: ${pr.reviewee || pr.revieweeName || 'N/A'}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}

                {/* Assignments to Grade */}
                <Typography variant="h6" mt={5}>📥 Assignments to Grade</Typography>
                {gradingAssignments.length === 0 ? (
                    <Typography color="text.secondary">No grading tasks assigned.</Typography>
                ) : (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <List>
                                {gradingAssignments.map((a, i) => (
                                    <ListItem
                                        key={i}
                                        secondaryAction={
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/grader/assignment/${a.assignmentId}`)}
                                            >
                                                View
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={a.title}
                                            secondary={`Course: ${a.course}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}

                {/* Assignments to Submit (like student) */}
                <Typography variant="h6" mt={5}>📅 Your Assignment Deadlines</Typography>
                {personalAssignments.length === 0 ? (
                    <Typography color="text.secondary">No personal assignments.</Typography>
                ) : (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <List>
                                {personalAssignments.map((a, i) => (
                                    <ListItem
                                        key={i}
                                        secondaryAction={
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate(`/assignment/deadline/${a.title}`)}
                                            >
                                                Open
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={a.title}
                                            secondary={`Course: ${a.course} | Due: ${a.deadline}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>
    );
};

export default HomeGrader;
