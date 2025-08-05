import { Box, Container, Paper, Typography } from '@mui/material';

const AuthFormWrapper = ({ children, title }) => {
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    {title}
                </Typography>
                {children}
            </Paper>
        </Container>
    );
};

export default AuthFormWrapper;
