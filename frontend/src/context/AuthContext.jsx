// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On first load, check if a token already exists (e.g. user refreshed the page)
    useEffect((() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check the token hasn't already expired before trusting it
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ id: decoded.id });
                } else {
                    localStorage.removeItem('token');
                }
            } catch {
                localStorage.removeItem('token')
            }
        }
        setLoading(false);
    }), []);

    const login = async ({ email, password }) => {
        const res = await authApi.login(email, password);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    }
    const register = async ({ username, email, password }) => {
        const res = await authApi.register(username, email, password);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

//  A smallhook so componenets use 'useAuth()' instead of importing AuthContext directly everywhere
export function useAuth() {
    return useContext(AuthContext);
}