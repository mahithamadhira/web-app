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
    Button
} from '@mui/material';
import Navbar from '../../components/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const HomeInstructor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const name = user?.name || 'Instructor';

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

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

            const formatted = data.map(course => ({
                id: course.courseid,
                name: course.coursename,
                startDate: new Date(course.startdate).toISOString().split('T')[0],
                endDate: new Date(course.enddate).toISOString().split('T')[0],
                isArchived: course.isarchived || false
            }));

            setCourses(formatted);
        } catch (err) {
            console.error('❌ Error fetching courses:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [user]);

    const toggleArchiveStatus = async (courseId, currentStatus) => {
        try {
            const res = await fetch(`http://localhost:9001/api/auth/archiveCourse`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    courseid: courseId,
                    status: !currentStatus
                })
            });

            if (!res.ok) throw new Error('Failed to toggle archive status');

            setCourses(prev =>
                prev.map(c =>
                    c.id === courseId ? { ...c, isArchived: !c.isArchived } : c
                )
            );
        } catch (err) {
            console.error('❌ Failed to archive/unarchive course:', err.message);
            alert('Failed to update course status.');
        }
    };

    return (
        <>
            <Navbar onCourseCreated={fetchCourses} />
            <Box p={4}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {name}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Your Courses
                </Typography>

                {loading ? (
                    <Typography>Loading courses...</Typography>
                ) : courses.length === 0 ? (
                    <Typography color="text.secondary">No courses found.</Typography>
                ) : (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Course Name</strong></TableCell>
                                        <TableCell><strong>Start Date</strong></TableCell>
                                        <TableCell><strong>End Date</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {courses.map((course, idx) => (
                                        <TableRow
                                            key={idx}
                                            hover
                                            sx={{ cursor: course.isArchived ? 'default' : 'pointer' }}
                                            onClick={() =>
                                                !course.isArchived &&
                                                navigate(`/course/${course.id}`, {
                                                    state: {
                                                        id: course.id,
                                                        name: course.name,
                                                        startDate: course.startDate,
                                                        endDate: course.endDate,
                                                        isArchived: course.isArchived
                                                    }
                                                })
                                            }
                                        >
                                            <TableCell sx={{ color: 'primary.main' }}>
                                                {course.name}
                                            </TableCell>
                                            <TableCell>{course.startDate}</TableCell>
                                            <TableCell>{course.endDate}</TableCell>
                                            <TableCell>
                                                {course.isArchived ? 'Archived' : 'Active'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color={course.isArchived ? 'success' : 'error'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleArchiveStatus(course.id, course.isArchived);
                                                    }}
                                                >
                                                    {course.isArchived ? 'Unarchive' : 'Archive'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>
    );
};

export default HomeInstructor;
