import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CourseDetailPage = () => {
    const { courseid } = useParams();
    const { user: contextUser } = useAuth();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [courseAssignments, setCourseAssignments] = useState([]);
    const [peerReviews, setPeerReviews] = useState([]);
    const [grades, setGrades] = useState([]);

    // ✅ Load user from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('peerlearnUser');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, [contextUser]);

    // ✅ Fetch course info
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`http://localhost:9001/api/auth/course/${courseid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                });

                const text = await res.text();
                if (!text) throw new Error('Empty response');
                const data = JSON.parse(text);
                setCourse(data);
            } catch (err) {
                console.error('❌ Error fetching course:', err.message);
            }
        };

        if (user?.token) fetchCourse();
    }, [courseid, user]);

    // ✅ Fetch assignments and filter by courseid
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!user?.token) return;

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

                const filtered = data.filter(a => a.course_id.toString() === courseid.toString());

                const formatted = filtered.map((a) => ({
                    assignmentId: a.assignment_id,
                    title: a.assignment_name,
                    dueDate: new Date(a.due_date).toISOString().split('T')[0],
                    submitted: a.submitted,
                    submissionId: a.submission_id
                }));

                setCourseAssignments(formatted);
            } catch (err) {
                console.error('❌ Error fetching assignments:', err.message);
            }
        };

        fetchAssignments();
    }, [courseid, user]);

    // ✅ Fetch peer reviews and filter by course assignments
    useEffect(() => {
        const fetchPeerReviews = async () => {
            if (!user?.token || courseAssignments.length === 0) return;

            try {
                const res = await fetch('http://localhost:9001/api/auth/fetchAssignmentsToPeerReviewByUserId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch peer reviews');
                const data = await res.json();

                const assignmentIds = courseAssignments.map(a => a.assignmentId);

                const filtered = data
                    .filter(r => assignmentIds.includes(r.assign_id))
                    .map((r) => ({
                        reviewId: r.reviewid,
                        assignmentTitle: r.assignment_title,
                        dueDate: new Date(r.deadline).toISOString().split('T')[0],
                        revieweeName: r.reviewee_name,
                        assignId: r.assign_id,
                        submissionId: r.submissionid
                    }));

                setPeerReviews(filtered);
            } catch (err) {
                console.error('❌ Error fetching peer reviews:', err.message);
            }
        };

        fetchPeerReviews();
    }, [user, courseAssignments]);

    // ✅ Dummy grades
    useEffect(() => {
        const studentGrades = [
            { title: 'To-Do List App', type: 'Assignment', score: 92 }
        ];
        setGrades(studentGrades);
    }, [courseid]);

    if (!course) return <Typography p={4}>📭 Loading course details...</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                📘 {course.coursename}
            </Typography>

            {/* Assignments */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6">📚 Assignments</Typography>
                    <Divider sx={{ my: 2 }} />
                    {courseAssignments.length === 0 ? (
                        <Typography color="text.secondary">No assignments found.</Typography>
                    ) : (
                        <List>
                            {courseAssignments.map((a) => (
                                <ListItem key={a.assignmentId}>
                                    <ListItemText
                                        primary={a.title}
                                        secondary={`Due: ${a.dueDate}`}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(`/assignment/${a.assignmentId}/student`, {
                                                state: {
                                                    assignmentId: a.assignmentId,
                                                    submissionId: a.submissionId
                                                }
                                            })
                                        }
                                    >
                                        {a.submitted ? 'View' : 'Submit'}
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Peer Reviews */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6">🧪 Assigned Peer Reviews</Typography>
                    <Divider sx={{ my: 2 }} />
                    {peerReviews.length === 0 ? (
                        <Typography color="text.secondary">No peer reviews assigned.</Typography>
                    ) : (
                        <List>
                            {peerReviews.map((r) => (
                                <ListItem key={r.reviewId}>
                                    <ListItemText
                                        primary={r.assignmentTitle}
                                        secondary={`Reviewee: ${r.revieweeName} | Due: ${r.dueDate}`}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/peer-review/${r.reviewId}`)}
                                    >
                                        Review
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Grades */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6">📊 Your Grades</Typography>
                    <Divider sx={{ my: 2 }} />
                    {grades.length === 0 ? (
                        <Typography color="text.secondary">No grades available yet.</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {grades.map((g, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{g.title}</TableCell>
                                        <TableCell>{g.type}</TableCell>
                                        <TableCell>{g.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Button sx={{ mt: 4 }} variant="outlined" onClick={() => navigate('/student')}>
                ⬅ Back to Home
            </Button>
        </Box>
    );
};

export default CourseDetailPage;
