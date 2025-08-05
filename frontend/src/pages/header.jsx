import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';

const Header = ({ user }) => {
    const { isLoggedIn, setIsLoggedIn, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <AppBar position="sticky" sx={{ bgcolor: isLoggedIn ? '#1565c0' : '#ffffff', color: isLoggedIn ? '#fff' : '#000' }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    onClick={() => navigate('/')}
                    sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
                >
                    MiniLinkedIn
                </Typography>

                {isLoggedIn ? (
                    <>
                        <Button color="inherit" onClick={() => navigate('/post')}>Create Post</Button>
                        <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>

                        <IconButton onClick={() => navigate('/profile')} color="inherit">
                            <Avatar alt={user?.firstName} src={user?.profilePicture} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>

                        </Menu>
                    </>
                ) : (
                    <Box>
                        <Button color="primary" variant="outlined" sx={{ mr: 1 }} onClick={() => navigate('/login')}>Login</Button>
                        <Button color="primary" variant="contained" onClick={() => navigate('/register')}>Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;