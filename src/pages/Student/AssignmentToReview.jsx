import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const AssignmentToReview = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [media, setMedia] = useState('');
    const [rubricScores, setRubricScores] = useState({});
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('peerlearnUser'));
    const userId = user?.id;
    const token = user?.token;

    useEffect(() => {
        const fetchReview = async () => {
            if (!token) return;

            try {
                const res = await fetch('http://localhost:9001/api/auth/fetchAssignmentsToPeerReviewByUserId', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Could not fetch peer reviews.');

                const data = await res.json();
                const found = data.find(r => r.reviewid.toString() === reviewId);
                if (!found) throw new Error('Review not found.');

                setReview(found);

                // Initialize rubric scores with default criteria
                const defaultCriteria = ['Clarity', 'Completeness', 'Originality'];
                const initialScores = {};
                defaultCriteria.forEach(crit => (initialScores[crit] = 0));
                setRubricScores(initialScores);
            } catch (err) {
                console.error(err.message);
                setReview(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [reviewId, token]);

    const handleRubricChange = (criterion, score) => {
        setRubricScores((prev) => ({
            ...prev,
            [criterion]: parseInt(score, 10)
        }));
    };

    const calculateTotalScore = () => {
        const scores = Object.values(rubricScores).map(Number);
        return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    };

    const handleSubmit = async () => {
        if (!token || !userId || !review?.submissionid) {
            alert("Missing required fields.");
            return;
        }

        const payload = {
            submissionId: parseInt(review.submissionid),
            reviewedById: parseInt(userId),
            feedback,
            feedbackMedia: media,
            score: calculateTotalScore()
        };

        try {
            const res = await fetch('http://localhost:9001/api/auth/createPeerfeedback', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to submit review');

            alert('✅ Peer review submitted successfully!');

            // 🔁 Redirect based on role
            if (user?.role === 'Student') {
                navigate('/student');
            } else if (user?.role === 'Grader') {
                navigate('/grader');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err.message);
            alert('❌ Failed to submit review');
        }
    };

    if (loading) {
        return <Box p={4}><Typography>Loading...</Typography></Box>;
    }

    if (!review) {
        return <Box p={4}><Typography>✅ Peer review submitted</Typography></Box>;
    }

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Review Assignment: {review.assignment_title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Submitted by: {review.reviewee_name}
            </Typography>

            {review.submission_file && (
                <Box mt={2}>
                    <Button
                        variant="outlined"
                        href={`https://mypeerlearn.s3.us-east-2.amazonaws.com/${encodeURIComponent(review.submission_file)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📥 Download Submission
                    </Button>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        File: {review.submission_file}
                    </Typography>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <TextField
                fullWidth
                multiline
                rows={4}
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="Feedback Media (file name or link)"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Typography variant="h6">Rubric Scores</Typography>
            <List>
                {Object.keys(rubricScores).map((criterion) => (
                    <ListItem key={criterion}>
                        <ListItemText primary={criterion} />
                        <TextField
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                            value={rubricScores[criterion]}
                            onChange={(e) => handleRubricChange(criterion, e.target.value)}
                            sx={{ width: 100 }}
                        />
                    </ListItem>
                ))}
            </List>

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
                Submit Review
            </Button>
        </Box>
    );
};

export default AssignmentToReview;
