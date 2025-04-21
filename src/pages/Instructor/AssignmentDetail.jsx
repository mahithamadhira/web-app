import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";

const AssignmentDetail = () => {
    const { courseId, assignId } = useParams();
    const [rows, setRows] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newGrade, setNewGrade] = useState('');
    const { user } = useAuth();

    useEffect(() => {

        console.log(user.token);
        console.log(courseId);
        console.log(assignId);
        const fetchGrades = async () => {
            const res = await fetch('http://localhost:9001/api/auth/fetchGradesByCourseAndAssignmentId', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`, // Replace with actual token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId: parseInt(courseId),
                    assignId: parseInt(assignId)
                })
            });

            const data = await res.json();

            console.log(data);

            setRows(data);
        };

        fetchGrades();
    }, [courseId, assignId]);

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setNewGrade(student.grade);
        setEditDialogOpen(true);
    };

    const handleSaveGrade = () => {
        // Optional: Call API to update grade here
        const updatedRows = rows.map((row) =>
            row.student_name === selectedStudent.student_name ? { ...row, grade: newGrade } : row
        );
        setRows(updatedRows);
        setEditDialogOpen(false);
    };

    return (
        <>
        <Navbar />
            <Box p={4}>
                    <Typography variant="h5" gutterBottom>Assignment Details</Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Grade</TableCell>
                                <TableCell>Reviews</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{row.student_name}</TableCell>
                                    <TableCell>
                                        {row.grade}
                                        <IconButton onClick={() => handleEditClick(row)} size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        {row.reviews.map((review, rIdx) => (
                                            <Chip
                                                key={rIdx}
                                                label={`${review.reviewer_name} (${review.feedback ? 'Done' : 'Pending'})`}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mr: 0.5 }}
                                            />
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Edit Grade Dialog */}
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <DialogTitle>Edit Grade</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label="New Grade"
                                type="number"
                                value={newGrade}
                                onChange={(e) => setNewGrade(Number(e.target.value))}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleSaveGrade}>Save</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
        </>
    );
};

export default AssignmentDetail;
