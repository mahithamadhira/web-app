import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import Navbar from '../../components/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const InstructorCourseDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const course = location.state;

    const [assignments, setAssignments] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user?.token || !course?.id) return;

            try {
                const res = await fetch('http://localhost:9001/api/auth/fetchAssignmentsByUserId', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch assignments');
                const data = await res.json();

                const filtered = data.filter(
                    (a) => a.course_id === course.id
                );

                const formatted = filtered.map((a) => ({
                    id: a.assignment_id,
                    title: a.assignment_name,
                    dueDate: new Date(a.due_date).toISOString().split('T')[0]
                }));

                setAssignments(formatted);
            } catch (err) {
                console.error('❌ Error fetching assignments:', err.message);
            }
        };

        fetchAssignments();
    }, [user, course]);

    const handleArchive = async () => {
        if (!user?.token || !course?.id) return;

        try {
            const res = await fetch('http://localhost:9001/api/auth/archiveCourse', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    courseid: course.id,
                    status: true
                })
            });

            if (!res.ok) throw new Error('Failed to archive course');

            setConfirmOpen(false);
            navigate('/home');
        } catch (err) {
            console.error('❌ Archive failed:', err.message);
            alert('Failed to archive course.');
        }
    };

    return (
        <>
            <Navbar />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    {course?.name}
                </Typography>

                <Typography variant="body1" mt={1}>
                    <strong>Start Date:</strong> {course?.startDate}
                </Typography>
                <Typography variant="body1" mb={2}>
                    <strong>End Date:</strong> {course?.endDate}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Assignments
                </Typography>

                <Card>
                    <CardContent>
                        {assignments.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Due Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignments.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                navigate(`/course/${course.id}/assignment/${item.id}`, {
                                                    state: { courseId: course.id, assignId: item.id }
                                                })
                                            }
                                        >
                                            <TableCell sx={{ color: 'primary.main' }}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell>{item.dueDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography color="text.secondary">
                                No assignments yet.
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                <Box mt={3}>
                    <Button
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={() => navigate(`/create-assignment?course=${course.id}`, {
                            state: {
                                courseName: course.name,
                            }
                        })}
                    >
                        Create Assignment
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{ mr: 2 }}
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Archive Course
                    </Button>
                </Box>
            </Box>

            {/* Archive Confirmation Modal */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Archive Course</DialogTitle>
                <DialogContent>
                    Are you sure you want to archive <strong>{course.name}</strong>? It will be moved
                    to Archived Courses on your homepage.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleArchive} color="error" variant="contained">
                        Archive
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InstructorCourseDetail;
