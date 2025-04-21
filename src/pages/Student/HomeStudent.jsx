import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress
} from '@mui/material';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomeStudent = () => {
    const { user: contextUser } = useAuth();
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [peerReviews, setPeerReviews] = useState([]);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    // ✅ Load user from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('peerlearnUser');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, [contextUser]);

    // ✅ Fetch registered courses
    const fetchCourses = async () => {
        if (!user?.token) return;

        try {
            const res = await fetch('http://localhost:9001/api/auth/fetchcoursesbyuserid', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (!res.ok) throw new Error('Failed to fetch courses');

            const data = await res.json();
            const formatted = data.map((course) => ({
                courseid: course.courseid,
                name: course.coursename,
                startDate: new Date(course.startdate).toISOString().split('T')[0],
                endDate: new Date(course.enddate).toISOString().split('T')[0]
            }));

            setCourses(formatted);
        } catch (err) {
            console.error('❌ Error fetching courses:', err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [user]);

    // ✅ Fetch assignments/submissions
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

            const formattedSubmissions = data.map((a) => ({
                assignmentId: a.assignment_id,
                title: a.assignment_name,
                course: a.course_name || 'Unknown',
                dueDate: new Date(a.due_date).toISOString().split('T')[0],
                submissionId: a.submission_id,
                submitted: a.submitted,
                submittedOn: a.submitted_on
            }));

            setSubmissions(formattedSubmissions);
        } catch (err) {
            console.error('❌ Error fetching assignments:', err.message);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [user]);

    // ✅ Fetch peer reviews
    useEffect(() => {
        const fetchPeerReviews = async () => {
            if (!user?.token) return;

            try {
                const res = await fetch('http://localhost:9001/api/auth/fetchAssignmentsToPeerReviewByUserId', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch peer review assignments');

                const data = await res.json();

                const formattedReviews = data.map((r) => ({
                    reviewId: r.reviewid,
                    assignmentTitle: r.assignment_title,
                    deadline: new Date(r.deadline).toISOString().split('T')[0],
                    revieweeName: r.reviewee_name,
                    assignId: r.assign_id,
                    submissionId: r.submissionid
                }));

                setPeerReviews(formattedReviews);
            } catch (err) {
                console.error('❌ Error fetching peer reviews:', err.message);
            }
        };

        fetchPeerReviews();
    }, [user]);

    if (!user) return (
        <>
            <Navbar />
            <Box p={4} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Loading student dashboard...</Typography>
            </Box>
        </>
    );

    return (
        <>
            <Navbar
                onCourseRegister={fetchCourses}
                onAssignmentRefresh={fetchAssignments}
            />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.email?.split('@')[0] || 'Student'}
                </Typography>

                {/* Submissions */}
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6">📚 Assignments / Submissions</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {submissions.length === 0 ? (
                                <Typography>No assignments available.</Typography>
                            ) : (
                                submissions.map((assignment) => (
                                    <ListItem
                                        key={assignment.assignmentId}
                                        alignItems="flex-start"
                                        sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                    >
                                        <ListItemText
                                            primary={`${assignment.title} – ${assignment.course}`}
                                            secondary={`Due: ${assignment.dueDate}`}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() =>
                                                navigate(`/assignment/${assignment.assignmentId}/student`, {
                                                    state: {
                                                        submissionId: assignment.submissionId,
                                                        assignmentId: assignment.assignmentId
                                                    }
                                                })
                                            }
                                        >
                                            View / Upload
                                        </Button>
                                        {assignment.submitted ? (
                                            <Typography variant="body2" color="green" sx={{ mt: 1 }}>
                                                ✅ Submitted on{' '}
                                                {assignment.submittedOn
                                                    ? new Date(assignment.submittedOn).toLocaleDateString()
                                                    : 'N/A'}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" color="orange" sx={{ mt: 1 }}>
                                                ⏳ Not Submitted
                                            </Typography>
                                        )}
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </CardContent>
                </Card>

                {/* Peer Reviews Assigned */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6">🧪 Peer Reviews Assigned</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {peerReviews.length === 0 ? (
                                <Typography>No peer reviews assigned.</Typography>
                            ) : (
                                peerReviews.map((review) => (
                                    <ListItem
                                        key={review.reviewId}
                                        alignItems="flex-start"
                                        sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                    >
                                        <ListItemText
                                            primary={review.assignmentTitle}
                                            secondary={`Submitted by: ${review.revieweeName} | Due: ${review.deadline}`}
                                        />
                                        {review.file && (
                                            <Button
                                                variant="outlined"
                                                sx={{ mt: 1 }}
                                                href={`https://mypeerlearn.s3.us-east-2.amazonaws.com/${encodeURIComponent(review.file)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                📥 Download Submission
                                            </Button>
                                        )}
                                        <Button
                                            variant="text"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => navigate(`/peer-review/${review.reviewId}`)}
                                        >
                                            Review Now
                                        </Button>
                                    </ListItem>
                                ))
                            )}
                        </List>

                    </CardContent>
                </Card>

                {/* Registered Courses */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6">📘 Registered Courses</Typography>
                        <Divider sx={{ my: 2 }} />
                        <List>
                            {courses.length === 0 ? (
                                <Typography>No registered courses found.</Typography>
                            ) : (
                                courses.map((course, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/student/course/${course.courseid}`)}
                                    >
                                        <ListItemText
                                            primary={course.name}
                                            secondary={`From ${course.startDate} to ${course.endDate}`}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default HomeStudent;
