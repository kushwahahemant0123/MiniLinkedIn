import { Button, TextField, Stack, Link } from '@mui/material';
import { useContext, useState } from 'react';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const { handleLogin, showSnackbar } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await handleLogin(form.email, form.password);

            if (res?.message) {
                showSnackbar(res.message, 'success');
            }

        } catch (err) {
            const backendMsg = err?.response?.data?.message || "Login failed.";
            console.log(err.response?.data.message);
            showSnackbar(backendMsg, 'error');
            console.error('Login failed:', err.response?.data?.message || err.message);
        }
    };

    return (
        <>




            <AuthFormWrapper title="Login">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="Email" name="email" type="email"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
                        <TextField label="Password" name="password" type="password"
                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth />
                        <Button variant="contained" type="submit">Login</Button>
                        <Link href="/register" underline="hover">Don’t have an account? Register</Link>
                    </Stack>
                </form>
            </AuthFormWrapper>
        </>
    );
};

export default LoginPage;
