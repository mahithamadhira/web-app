import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
        // Initialize from localStorage if available
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {
            token: null,
            user: null,
            isAuthenticated: false
        };
    });

    const login = async (userData) => {
        const newAuthState = {
            token: userData.token,
            user: {
                username: userData.username,
                email: userData.email,
                role: userData.role
            },
            isAuthenticated: true
        };

        // Update both state and localStorage
        setAuthState(newAuthState);
        localStorage.setItem('auth', JSON.stringify(newAuthState));
    };

    const logout = () => {
        setAuthState({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);