import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthCard = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(4),
    maxWidth: 450,
    margin: 'auto',
    textAlign: 'center',
}));

const AuthLayout = ({ title, children }) => {
    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                PeerLearn
            </Typography>
            <AuthCard>
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
                {children}
            </AuthCard>
        </Container>
    );
};

export default AuthLayout;