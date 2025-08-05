import { Button, TextField, Stack, Link } from '@mui/material';
import { useContext, useState } from 'react';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import routes from '../routes';


const Register = () => {
    const navigate = useNavigate();
    const { handleRegister, showSnackbar } = useContext(AuthContext);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //const res = await routes.post('auth/register', form);
            const res = await handleRegister(form.firstName, form.lastName, form.email, form.password);

            if (res) {
                showSnackbar(res, 'success');
            }
            navigate('/login');

        } catch (err) {

            const backendMsg = err?.response?.data?.message || "Registration failed.";
            showSnackbar(backendMsg, 'error');
        }
    };

    return (

        <>
            <AuthFormWrapper title="Register">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="First Name" name="firstName" value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })} fullWidth />
                        <TextField label="Last Name" name="lastName" value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })} fullWidth />
                        <TextField label="Email" name="email" type="email"
                            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
                        <TextField label="Password" name="password" type="password"
                            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth />
                        <Button variant="contained" type="submit">Register</Button>
                        <Link href="/login" underline="hover">Already have an account? Login</Link>
                    </Stack>
                </form>
            </AuthFormWrapper>
        </>
    );
};

export default Register;
