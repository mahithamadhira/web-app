import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Avatar,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ showInstructorOptions }) => {
    const { user, logout } = useAuth();
    console.log("user: ", user)
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    PeerLearn
                </Typography>

                {showInstructorOptions && (
                    <>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/create-course')}
                            sx={{ mr: 2 }}
                        >
                            Create Course
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/create-assignment')}
                            sx={{ mr: 2 }}
                        >
                            Create Assignment
                        </Button>
                    </>
                )}

                <IconButton onClick={handleMenuOpen}>
                    <Avatar sx={{ bgcolor: '#3f51b5' }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        navigate('/profile');
                    }}>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;