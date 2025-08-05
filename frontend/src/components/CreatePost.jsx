import React, { useContext, useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Stack, Avatar } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ onClose, onSuccess }) => {
    const { handleCreatePost, userData, showSnackbar } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createPost = async () => {
        try {
            const res = await handleCreatePost(content);
            if (res.status === 201) {
                showSnackbar(res.data.message, 'success');
            }
            setContent('');

            navigate('/')
        } catch (err) {
            console.error(err);
            const backendMsg = err?.response?.data?.message || "Post created failed.";

            showSnackbar(backendMsg, 'error');

        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">

                    <TextField
                        fullWidth
                        label="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />


                </Stack>
                <Button variant="contained" onClick={createPost}>Post</Button>
            </CardContent>
        </Card>
    );
};

export default CreatePost;
