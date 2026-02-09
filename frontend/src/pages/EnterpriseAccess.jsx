import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EnterpriseAccess = () => {
    const navigate = useNavigate();
    const { login: contextLogin, register, token } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (token) {
            navigate('/enterprise/form');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login Flow using context
                const res = await contextLogin(email, password);
                if (res.success) {
                    setSuccessMsg(res.msg || "Access Granted Successfully");
                    setTimeout(() => {
                        navigate('/enterprise/form');
                    }, 1500);
                } else {
                    setError(res.msg || 'Login failed');
                }
            } else {
                // Registration Flow using context
                const res = await register(name, email, password);
                if (res.success) {
                    setSuccessMsg(res.msg || "Registration Successful! Please sign in.");
                    setTimeout(() => {
                        setIsLogin(true);
                        setSuccessMsg('');
                        setPassword(''); // Clear password for security
                    }, 2000);
                } else {
                    setError(res.msg || 'Registration failed');
                }
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Authentication failed.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md z-10 relative"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                        {isLogin ? 'Enterprise Access' : 'New Specialist'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {isLogin ? 'Authenticate to access the SRS Generator' : 'Register for an Enterprise account'}
                    </p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-red-900/50 text-red-300 text-sm rounded border border-red-800 flex items-center gap-2"
                        >
                            <span>⚠️</span> {error}
                        </motion.div>
                    )}

                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-green-900/50 text-green-300 text-sm rounded border border-green-800 flex items-center gap-2"
                        >
                            <CheckCircle size={16} /> {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-neon-blue text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] outline-none transition-all placeholder-gray-600"
                                placeholder="John Doe"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-neon-blue text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] outline-none transition-all placeholder-gray-600"
                            placeholder="you@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-neon-purple text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-purple focus:shadow-[0_0_15px_rgba(188,19,254,0.3)] outline-none transition-all placeholder-gray-600 pr-10"
                                placeholder="••••••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || successMsg}
                        className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(188,19,254,0.6)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Processing...' : (successMsg ? 'Success!' : (isLogin ? 'Access Workspace' : 'Create Account'))}
                    </button>

                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-xs">
                            {isLogin ? "Need an account? " : "Already have credentials? "}
                        </span>
                        <span
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-white font-bold cursor-pointer hover:text-neon-blue transition text-xs uppercase tracking-wide"
                        >
                            {isLogin ? 'Register Access' : 'Sign In'}
                        </span>
                    </div>
                    <div className="mt-6 text-center text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition" onClick={() => navigate('/dashboard')}>
                        ← Return to Dashboard
                    </div>
                </form>

                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-blue/30 rounded-tl-2xl -mt-2 -ml-2"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-purple/30 rounded-br-2xl -mb-2 -mr-2"></div>
            </motion.div>
        </div>
    );
};

export default EnterpriseAccess;
