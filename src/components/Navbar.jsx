import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    FormControl,
    InputLabel,
    TextField,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onCourseRegister, onAssignmentRefresh, onCourseCreated }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [newCourse, setNewCourse] = useState({
        courseName: '',
        startDate: '',
        endDate: ''
    });

    const open = Boolean(anchorEl);
    const isStudent = user?.role === 'Student';
    const isInstructor = user?.role === 'Instructor';

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const goToHome = () => {
        if (!user || !user.role) return navigate('/');
        if (user.role === 'Instructor') return navigate('/instructor');
        if (user.role === 'Student') return navigate('/student');
        if (user.role === 'Grader') return navigate('/grader');
        return navigate('/');
    };

    const openRegisterModal = async () => {
        try {
            const [allCoursesRes, registeredCoursesRes] = await Promise.all([
                fetch('http://localhost:9001/api/auth/fetchAllCourses', {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                fetch('http://localhost:9001/api/auth/fetchcoursesbyuserid', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            if (!allCoursesRes.ok || !registeredCoursesRes.ok) throw new Error('Fetch failed');

            const [allCourses, registeredCourses] = await Promise.all([
                allCoursesRes.json(),
                registeredCoursesRes.json()
            ]);

            const registeredIds = registeredCourses.map(c => c.courseid);
            const unregisteredCourses = allCourses.filter(c => !registeredIds.includes(c.courseid));

            setCourses(unregisteredCourses);
            setRegisterModalOpen(true);
        } catch (err) {
            console.error('❌', err.message);
            alert('Failed to fetch course list.');
        }
    };

    const handleRegister = async () => {
        if (!selectedCourse) return alert('Please select a course');
        try {
            const res = await fetch('http://localhost:9001/api/auth/registerCourse', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    courseId: parseInt(selectedCourse)
                })
            });
            if (!res.ok) throw new Error('Registration failed');
            alert('✅ Successfully registered!');
            setRegisterModalOpen(false);
            setSelectedCourse('');
            onCourseRegister?.();
            onAssignmentRefresh?.();
        } catch (err) {
            console.error('❌', err.message);
            alert('❌ Failed to register');
        }
    };

    const handleCreateCourse = async () => {
        const { courseName, startDate, endDate } = newCourse;
        if (!courseName || !startDate || !endDate) return alert('Fill all fields');

        try {
            const res = await fetch('http://localhost:9001/api/auth/insertCourse', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseName,
                    instructorID: user.id.toString(),
                    startDate,
                    endDate,
                    isArchived: "false"
                })
            });

            if (!res.ok) throw new Error('Failed to create course');
            alert('✅ Course created successfully!');
            setCreateModalOpen(false);
            setNewCourse({ courseName: '', startDate: '', endDate: '' });
            onCourseCreated?.(); // Auto refresh home page courses
        } catch (err) {
            console.error('❌', err.message);
            alert('❌ Failed to create course');
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={goToHome}
                    >
                        PeerLearn
                    </Typography>

                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user?.email?.split('@')[0] || 'My Profile'}
                    </Typography>

                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                        {isStudent && (
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    openRegisterModal();
                                }}
                            >
                                Register for a Course
                            </MenuItem>
                        )}

                        {isInstructor && (
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    setCreateModalOpen(true);
                                }}
                            >
                                Create a Course
                            </MenuItem>
                        )}

                        <MenuItem
                            onClick={() => {
                                localStorage.clear();
                                logout();
                                navigate('/');
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Student Register Modal */}
            <Dialog open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Register for a Course</DialogTitle>
                <DialogContent>
                    <Box mt={2}>
                        <FormControl fullWidth>
                            <InputLabel>Select Course</InputLabel>
                            <Select
                                native
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value=""></option>
                                {courses.map((c) => (
                                    <option key={c.courseid} value={c.courseid}>
                                        {c.coursename}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRegisterModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleRegister}>
                        Register
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Instructor Create Course Modal */}
            <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create a New Course</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        <TextField
                            label="Course Name"
                            fullWidth
                            value={newCourse.courseName}
                            onChange={(e) =>
                                setNewCourse({ ...newCourse, courseName: e.target.value })
                            }
                        />
                        <TextField
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={newCourse.startDate}
                            onChange={(e) =>
                                setNewCourse({ ...newCourse, startDate: e.target.value })
                            }
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={newCourse.endDate}
                            onChange={(e) =>
                                setNewCourse({ ...newCourse, endDate: e.target.value })
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateCourse}>
                        Create Course
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar;
