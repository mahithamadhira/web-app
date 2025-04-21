import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // ✅ Decode token safely
    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('❌ Invalid token:', error.message);
            return null;
        }
    };



    // ✅ Login handler
    const login = async ({ email, password }) => {
        try {
            const res = await fetch('http://localhost:9001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Invalid login');
            }

            const decoded = decodeToken(data.token);

            const userInfo = {
                token: data.token,
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name || decoded.email.split('@')[0]
            };

            setUser(userInfo);
            localStorage.setItem('peerlearnUser', JSON.stringify(userInfo));

            return userInfo; // <-- 🔥 return this to your component
        } catch (err) {
            console.error('Login failed:', err.message);
            throw err;
        }
    };


    // ✅ Signup handler
    const signup = async ({ name, email, password, role }) => {
        try {
            const res = await fetch('http://localhost:9001/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            const decoded = decodeToken(data.token);

            const userInfo = {
                token: data.token,
                id: decoded.id,
                email: email,
                role: role,
                name: name,
            };

            setUser(userInfo);
            localStorage.setItem('peerlearnUser', JSON.stringify(userInfo));
        } catch (err) {
            console.error('Signup failed:', err.message);
            throw err;
        }
    };

    // ✅ Logout handler
    const logout = () => {
        setUser(null);
        localStorage.removeItem('peerlearnUser');
    };

    // ✅ Load from localStorage on refresh
    useEffect(() => {
        const stored = localStorage.getItem('peerlearnUser');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
