import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import withAuth from "../utils/WithAuth";
import {
    Box,
    Typography,
    Avatar,
    Stack,
    Card,
    CardContent,
    Skeleton,
    useMediaQuery,
    useTheme,
    Divider,
    TextField,
    Button
} from '@mui/material';

const Profile = () => {
    const { handleGetUserProfile, handleGetPostByAuthor, handleUpdateUserProfile, showSnackbar } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null); // to compare changes
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const profileData = await handleGetUserProfile(userId);
                const userPosts = await handleGetPostByAuthor(userId);

                setUser(profileData);
                setOriginalUser(profileData);
                setPosts(userPosts);
            } catch (err) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setUser(originalUser);
        setEditing(false);
    };

    const handleSave = async () => {
        if (
            user.firstName === originalUser.firstName &&
            user.lastName === originalUser.lastName &&
            user.bio === originalUser.bio
        ) {
            showSnackbar("No changes to save", "info");
            setEditing(false);
            return;
        }

        try {
            const updatedUser = await handleUpdateUserProfile(user._id, {
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio
            });

            setUser(updatedUser);
            setOriginalUser(updatedUser);
            showSnackbar("Profile updated successfully", "success");
            setEditing(false);
        } catch (err) {
            showSnackbar("Failed to update profile", "error");
        }
    };

    const handleChange = (field, value) => {
        setUser((prev) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 4 }}>
                <Skeleton variant="circular" width={150} height={150} />
                <Box sx={{ flexGrow: 1, pl: 4 }}>
                    <Skeleton variant="text" width="40%" height={40} />
                    <Skeleton variant="text" width="70%" height={30} />
                    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
                </Box>
            </Box>
        );
    }

    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 2 }}>
            <Card sx={{ maxWidth: 900, mx: 'auto', mb: 4, p: 3 }}>
                <Stack direction={isSmallScreen ? "column" : "row"} spacing={4} alignItems="center">
                    <Avatar
                        alt={`${user.firstName} ${user.lastName}`}
                        src={user.profilePicture || ''}
                        sx={{
                            width: 120,
                            height: 120,
                            bgcolor: theme.palette.primary.main,
                            fontSize: 40
                        }}
                    >
                        {user.firstName?.[0]}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                        {editing ? (
                            <Stack spacing={2}>
                                <TextField
                                    label="First Name"
                                    value={user.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Last Name"
                                    value={user.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Bio"
                                    value={user.bio || ""}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                                <Stack direction="row" spacing={2}>
                                    <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                                </Stack>
                            </Stack>
                        ) : (
                            <>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    {`${user.firstName} ${user.lastName}`}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {user.bio || "No bio provided."}
                                </Typography>
                                <Button onClick={handleEdit} variant="outlined">Edit</Button>
                            </>
                        )}
                    </Box>
                </Stack>
            </Card>

            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Posts by {user.firstName}
                </Typography>

                {posts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No posts yet.
                    </Typography>
                ) : (
                    posts.map((post) => (
                        <Card key={post._id} sx={{ mb: 3 }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <Avatar>{post.author?.firstName?.[0]}</Avatar>
                                    <Box>
                                        <Typography fontWeight="bold">
                                            {post.author?.firstName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(post.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Divider sx={{ mb: 1 }} />
                                <Typography>{post.content}</Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default withAuth(Profile);
