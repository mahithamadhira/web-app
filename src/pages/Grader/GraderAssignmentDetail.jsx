import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Chip,
    TextField
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const GraderAssignmentDetail = () => {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        // Simulated data
        const data = [
            {
                student: 'Murali',
                file: '8843.pdf',
                submitted: true,
                grade: ''
            },
            {
                student: 'Prajeeth',
                file: '',
                submitted: false,
                grade: ''
            },
            {
                student: 'Sri Mahitha',
                file: 'myfile.pdf',
                submitted: true,
                grade: ''
            }
        ];

        setSubmissions(data);
    }, [assignmentId]);

    const handleGradeChange = (index, value) => {
        const updated = [...submissions];
        updated[index].grade = value;
        setSubmissions(updated);
    };

    const handleSubmit = () => {
        console.log('📤 Final Grades Submitted:', submissions);
        alert('✅ Grades submitted!');
    };

    return (
        <>
            <Navbar />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    Grading – To-Do List App
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Course: Web Development
                </Typography>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Student</TableCell>
                                    <TableCell>Submission</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Grade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((s, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{s.student}</TableCell>
                                        <TableCell>
                                            {s.submitted && s.file ? (
                                                <a
                                                    href={`https://example-bucket.s3.amazonaws.com/${s.file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {s.file}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {s.submitted ? (
                                                <Chip label="Submitted" color="success" />
                                            ) : (
                                                <Chip label="Not Submitted" color="warning" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={s.grade}
                                                onChange={(e) => handleGradeChange(i, e.target.value)}
                                                inputProps={{ min: 0, max: 100 }}
                                                placeholder="/100"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box mt={3} textAlign="right">
                            <Button variant="contained" onClick={handleSubmit}>
                                Submit Grades
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default GraderAssignmentDetail;
