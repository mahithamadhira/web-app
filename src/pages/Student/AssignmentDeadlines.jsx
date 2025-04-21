import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Alert, Divider, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AssignmentDeadlines = () => {
    const { id } = useParams(); // fallback from route
    const location = useLocation();
    const navigate = useNavigate();
    const { user: contextUser } = useAuth();

    const assignmentId = location.state?.assignmentId || id;
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [fileName, setFileName] = useState('');

    // ✅ Reusable fetch function
    const fetchDetails = async () => {
        const user = JSON.parse(localStorage.getItem('peerlearnUser'));
        const token = user?.token;

        if (!assignmentId || !token) return;

        try {
            const res = await fetch('http://localhost:9001/api/auth/fetchSubmissionByUserAndAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id: assignmentId })
            });

            if (!res.ok) throw new Error('Failed to fetch submission and assignment details');
            const data = await res.json();

            setAssignment(data.assignment);
            setSubmission(data.submission);
            setFileName(data.submission?.file || '');
        } catch (err) {
            console.error('❌ Error fetching details:', err.message);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [assignmentId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const user = JSON.parse(localStorage.getItem('peerlearnUser'));
        const token = user?.token;
        const userId = user?.id;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('assignid', assignmentId + '');
            formData.append('userid', userId + '');

            const res = await fetch('http://localhost:9001/api/auth/createSubmission', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');
            alert("✅ Submission uploaded!");
            setFileName(file.name);

            // 🔄 Refresh submission info
            await fetchDetails();
        } catch (err) {
            console.error(err.message);
            alert("❌ Upload failed");
        }
    };

    if (!assignment) {
        return <Typography p={4}>📭 Loading assignment details...</Typography>;
    }

    const reviews = submission?.reviews || [];
    const peerReviewCount = reviews.length;
    const totalExpectedReviews = 3;

    return (
        <Box p={4}>
            <Typography variant="h5">📘 Assignment: {assignment.title}</Typography>
            <Typography>Description: {assignment.description || 'N/A'}</Typography>
            <Typography>Due: {new Date(assignment.deadline).toLocaleDateString()}</Typography>

            {/* Submission Section */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    {submission ? (
                        <Alert severity="info">
                            <Typography>
                                ✅ Submitted File: <strong>{submission.file}</strong>
                            </Typography>
                            <Typography>Type: {submission.mimetype}</Typography>
                            <Typography>
                                Submitted On: {new Date(submission.submissiondate).toLocaleString()}
                            </Typography>
                            <Typography>Grade: {88}</Typography>
                        </Alert>
                    ) : (
                        <>
                            <Typography sx={{ mb: 2 }}>
                                ❌ You have not submitted this assignment yet.
                            </Typography>
                            <Button variant="contained" component="label">
                                Upload Assignment
                                <input type="file" hidden onChange={handleFileUpload} />
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Peer Review Section */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6">🧪 Peer Reviews</Typography>
                    <Divider sx={{ my: 1 }} />
                    {peerReviewCount > 0 ? (
                        <>
                            <Typography sx={{ mb: 2 }}>
                                🔄 Peer Reviews
                            </Typography>
                            <List>
                                {reviews.map((review, index) => (
                                    <ListItem key={index} alignItems="flex-start">
                                        <ListItemText
                                            primary={`Reviewer: ${review.reviewername || `User ${review.reviewedbyid}`}`}
                                            secondary={
                                                <>
                                                    <Typography>Score: {review.score ?? 'Pending'}</Typography>
                                                    <Typography>
                                                        Feedback: {review.feedback || 'No feedback yet'}
                                                    </Typography>
                                                    <Typography>
                                                        Media: {review.feedbackmedia || 'N/A'}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>

                        </>
                    ) : (
                        <Typography sx={{ color: 'gray' }}>
                            🔄 Peer Reviews: 0/{totalExpectedReviews} submitted
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Back Button */}
            <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate('/student')}>
                ⬅ Back to Home
            </Button>
        </Box>
    );
};

export default AssignmentDeadlines;
