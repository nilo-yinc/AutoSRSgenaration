import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial check
        const initjs = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await axios.get('/api/v1/users/get-profile');
                    if (res.data.success) {
                        setUser(res.data.user);
                    }
                } catch (err) {
                    console.log("Error fetching profile:", err);
                    if (token === 'offline-token') {
                        setUser({ name: "Guest User", email: "guest@example.com", phone: "", profilePic: "" });
                    }
                    // If 401, handle logout? For now, keep token but user might be null or stale.
                }
            } else {
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };
        initjs();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/v1/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.warn("Backend login failed, using offline mode.");
            // Offline Fallback for UI visualization
            const dummyUser = { name: "Guest User", email: email };
            const dummyToken = "offline-token";
            localStorage.setItem('token', dummyToken);
            setToken(dummyToken);
            setUser(dummyUser);
            return { success: true, msg: "Logged in (Offline Mode)" };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post('/api/v1/users/register', { name, email, password });
            return { success: true, msg: 'Registration successful. Please login.' };
        } catch (err) {
            console.warn("Backend registration failed, using offline mode.");
            return { success: true, msg: "Registration simulated (Offline Mode). Please login." };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (data) => {
        try {
            const res = await axios.put('/api/v1/users/update-profile', data);
            if (res.data.success) {
                setUser({ ...user, ...res.data.user });
                return { success: true, msg: "Profile updated successfully" };
            }
            return { success: false, msg: res.data.message || "Update failed" };
        } catch (err) {
            console.error("Profile update error", err);
            // Offline fallback
            if (token === 'offline-token') {
                setUser({ ...user, ...data });
                return { success: true, msg: "Profile updated (Offline Mode)" };
            }
            return { success: false, msg: err.response?.data?.message || "Update failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
