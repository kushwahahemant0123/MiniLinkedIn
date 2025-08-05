import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Avatar,
    Stack,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../context/AuthContext';
import withAuth from '../utils/WithAuth';

const FeedPage = () => {
    const {
        userData,
        handleCreatePost,
        handleGetPosts,
        handleDeletePost,
        showSnackbar
    } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const userId = localStorage.getItem("userId");

    const fetchPosts = async () => {
        try {
            const res = await handleGetPosts();
            setPosts(res);
        } catch (err) {
            console.error(err);
        }
    };

    const createPost = async () => {
        try {
            const res = await handleCreatePost(content);
            if (res.status === 201) {
                showSnackbar(res.data.message, 'success');
                setContent('');
                fetchPosts();
            }
        } catch (err) {
            console.error(err);
            const backendMsg = err?.response?.data?.message || "Post creation failed.";
            showSnackbar(backendMsg, 'error');
        }
    };

    const deletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await handleDeletePost(postId);
            showSnackbar("Post deleted", "success");
            fetchPosts(); // Refresh posts
        } catch (err) {
            console.error(err);
            const backendMsg = err?.response?.data?.message || "Failed to delete post.";
            showSnackbar(backendMsg, 'error');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Box p={2} maxWidth="800px" margin="auto">
            <Typography variant="h4" mb={2}>Feed</Typography>

            {/* Post Creation */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>{userData.firstName?.[0]}</Avatar>
                        <TextField
                            fullWidth
                            label="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button variant="contained" onClick={createPost}>Post</Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Post List */}
            {posts.map((post) => (
                <Card key={post._id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1} justifyContent="space-between">
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar>{post.author?.firstName?.[0]}</Avatar>
                                <Box>
                                    <Typography fontWeight="bold">
                                        {`${post.author?.firstName} ${post.author.lastName}${post.author?._id === userId ? " (You)" : ""}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Show delete icon only if user is the author */
                                console.log(post.author._id)}
                            {post.author?._id === userId && (
                                <IconButton onClick={() => deletePost(post._id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Stack>
                        <Typography>{post.content}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default withAuth(FeedPage);
