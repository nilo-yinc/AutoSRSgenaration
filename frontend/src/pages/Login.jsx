import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import useTitle from '../hooks/useTitle';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    useTitle(isLogin ? 'Login' : 'Register');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const res = await login(email, password);
            if (res.success) {
                navigate('/dashboard');
            } else {
                alert(res.msg);
            }
        } else {
            const res = await register(name, email, password);
            if (res.success) {
                alert(res.msg);
                setIsLogin(true);
            } else {
                alert(res.msg);
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-dark-bg">
            <form onSubmit={handleSubmit} className="bg-dark-card p-8 rounded border border-neon-purple shadow-lg w-96">
                <h2 className="text-2xl mb-6 text-neon-blue font-bold text-center">
                    {isLogin ? 'DocuVerse Login' : 'Create Account'}
                </h2>

                {!isLogin && (
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-400">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 bg-dark-input rounded text-white border border-gray-700 focus:border-neon-blue outline-none"
                            required={!isLogin}
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 text-gray-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 bg-dark-input rounded text-white border border-gray-700 focus:border-neon-blue outline-none"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-gray-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 bg-dark-input rounded text-white border border-gray-700 focus:border-neon-blue outline-none"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-neon-purple text-white p-2 rounded hover:bg-purple-700 transition font-bold mb-4">
                    {isLogin ? 'Enter System' : 'Register'}
                </button>

                <div className="text-center text-sm text-gray-500 cursor-pointer hover:text-white" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                </div>
            </form>
        </div>
    );
};

export default Login;
