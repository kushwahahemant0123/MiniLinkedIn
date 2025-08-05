import axios from "axios";
import { createContext, use, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';

export const AuthContext = createContext({});


const routes = axios.create(
    {
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/api-v1` || "http://localhost:8000/api-v1",

    }
);


export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            routes.get('/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setUserData(res.data);
                setIsLoggedIn(true);
            }).catch(() => {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            });
        }
    }, []);


    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const router = useNavigate();

    const handleRegister = async (firstName, lastName, email, password) => {
        try {

            const response = await routes.post("/auth/register", {
                firstName,
                lastName,
                email,
                password
            });
            if (response.status === 201) {
                return response.data.message

            }

        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const response = await routes.post("/auth/login", {
                email,
                password
            });
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.user._id);
                setUserData(response.data);
                setIsLoggedIn(true);
                console.log(response);

                router("/profile")
                return response.data;

                // Redirect to the mini LinkedIn page after successful login

            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserData({});
        setIsLoggedIn(false);
        router('/login'); // Redirect to login page after logout
    };

    const handleCreatePost = async (content) => {
        try {
            const response = await routes.post("/post/create", { content }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    const handleUpdatePost = async (postId, content) => {
        try {
            const response = await routes.put(`/posts/${postId}`, { content }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }
    const handleDeletePost = async (postId) => {
        try {
            const response = await routes.delete(`/post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }
    const handleGetPosts = async () => {
        try {
            const response = await routes.get("/post", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    }
    const handleGetPostByAuthor = async (userId) => {
        try {
            const response = await routes.get(`/post/author/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching posts by author:", error);
            throw error;
        }
    }

    const handleGetUserProfile = async (userId) => {
        try {
            const response = await routes.get(`/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }
    const handleUpdateUserProfile = async (userId, profileData) => {
        try {
            const response = await routes.put(`/profile/${userId}`, profileData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
    const handleCreateComment = async (postId, content) => {
        try {
            const response = await routes.post(`/posts/${postId}/comments`, { content }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    }
    const handleGetComments = async (postId) => {
        try {
            const response = await routes.get(`/posts/${postId}/comments`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    }
    const handleEditComment = async (postId, commentId, content) => {
        try {
            const response = await routes.put(`/posts/${postId}/comments/${commentId}`, { content }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error editing comment:", error);
            throw error;
        }
    }
    const handleDeleteComment = async (postId, commentId) => {
        try {
            const response = await routes.delete(`/posts/${postId}/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
    const handleAddReaction = async (postId, reactionType) => {
        try {
            const response = await routes.post(`/posts/${postId}/reactions`, { type: reactionType }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding reaction:", error);
            throw error;
        }
    }
    const handleGetReactions = async (postId) => {
        try {
            const response = await routes.get(`/posts/${postId}/reactions`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching reactions:", error);
            throw error;
        }
    }
    const handleVerifyEmail = async (token) => {
        try {
            const res = await routes.post('/auth/verify-email', { token });
            if (res.status === 200) {
                return res.data;
            }
        } catch (err) {
            throw err;
        }
    }


    const data = {
        userData,
        handleRegister,
        handleLogin,
        handleLogout,
        handleCreatePost,
        handleUpdatePost,
        handleDeletePost,
        handleGetPosts,
        handleGetPostByAuthor,
        handleGetUserProfile,
        handleUpdateUserProfile,
        handleCreateComment,
        handleGetComments,
        handleEditComment,
        handleDeleteComment,
        handleAddReaction,
        handleGetReactions,
        showSnackbar,
        isLoggedIn,
        setIsLoggedIn,
        handleVerifyEmail
    }
    return (
        <AuthContext.Provider value={data}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={closeSnackbar} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    );

}