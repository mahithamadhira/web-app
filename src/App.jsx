import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './routes/AppRoutes';
import theme from './theme';
import { AuthProvider } from './context/AuthContext'; // ✅ import it

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>  {/* ✅ wrap all routing inside AuthProvider */}
            <AppRoutes />
        </AuthProvider>
    </ThemeProvider>
);

export default App;
