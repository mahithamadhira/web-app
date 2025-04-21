import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Example dummy data (replace this with real backend call)
const dummyCourseData = {
    DBMS: [
        {
            student: 'Alice',
            grades: { 'ER Diagrams': 85, 'Normalization': 90 }
        },
        {
            student: 'Bob',
            grades: { 'ER Diagrams': 70, 'Normalization': 80 }
        }
    ],
    Cryptography: [
        {
            student: 'Charlie',
            grades: { 'AES Encryption': 92, 'RSA Security': 88 }
        },
        {
            student: 'Dana',
            grades: { 'AES Encryption': 84, 'RSA Security': 79 }
        }
    ]
};

const GradesOverview = () => {
    const { courseName } = useParams();

    const courseGrades = dummyCourseData[courseName] || [];

    const assignmentTitles = Array.from(
        new Set(courseGrades.flatMap(s => Object.keys(s.grades)))
    );

    const getAverage = (grades) => {
        const values = Object.values(grades);
        return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '-';
    };

    return (
        <>
            <Navbar />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    {courseName} – Grades Overview
                </Typography>

                {courseGrades.length === 0 ? (
                    <Typography>No grade data available for this course.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Student</strong></TableCell>
                                    {assignmentTitles.map(title => (
                                        <TableCell key={title}><strong>{title}</strong></TableCell>
                                    ))}
                                    <TableCell><strong>Average</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courseGrades.map(({ student, grades }) => (
                                    <TableRow key={student}>
                                        <TableCell>{student}</TableCell>
                                        {assignmentTitles.map(title => (
                                            <TableCell key={title}>
                                                {grades[title] ?? '–'}
                                            </TableCell>
                                        ))}
                                        <TableCell>{getAverage(grades)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </>
    );
};

export default GradesOverview;
