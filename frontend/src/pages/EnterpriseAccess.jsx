import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';

const EnterpriseAccess = () => {
    const navigate = useNavigate();
    const { login: contextLogin, register, token } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    useTitle(isLogin ? 'Enterprise Access' : 'Enterprise Registration');
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
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden font-mono text-[#c9d1d9] selection:bg-[#58a6ff]/30">
            {/* Multi-layered Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#58a6ff]/5 rounded-full blur-[120px]"
                ></motion.div>
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] -right-[10%] w-[40%] h-[40%] bg-[#238636]/5 rounded-full blur-[100px]"
                ></motion.div>
            </div>

            {/* Hanging / Floating Card Implementation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                whileHover={{ y: -5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Outer Glow Wrapper */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#58a6ff]/10 via-transparent to-[#238636]/10 rounded-2xl blur-2xl -z-10 group-hover:opacity-100 transition-opacity"></div>

                <div className="bg-gradient-to-br from-[#1c2128] via-[#161b22] to-[#10141b] backdrop-blur-2xl p-8 rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                    {/* Floating Animation Wrapper */}
                    <motion.div
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">
                                {isLogin ? 'Enterprise Access' : 'New Specialist'}
                            </h1>
                            <p className="text-[#8b949e] mt-2 text-sm font-medium">
                                {isLogin ? 'Authenticate to access the workspace' : 'Register for an Enterprise account'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-6 p-3 bg-red-900/20 text-red-400 text-xs rounded-xl border border-red-800/50 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <span>⚠️</span> {error}
                                </motion.div>
                            )}

                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-6 p-3 bg-green-900/20 text-green-400 text-xs rounded-xl border border-green-800/50 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <CheckCircle size={16} /> {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="block text-[#79c0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#0d1117]/80 border border-white/10 rounded-xl p-3.5 text-white focus:border-[#58a6ff]/50 outline-none transition-all placeholder-[#484f58] text-sm shadow-inner"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="block text-[#79c0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0d1117]/80 border border-white/10 rounded-xl p-3.5 text-white focus:border-[#58a6ff]/50 outline-none transition-all placeholder-[#484f58] text-sm shadow-inner"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[#79c0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 px-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#0d1117]/80 border border-white/10 rounded-xl p-3.5 text-white focus:border-[#58a6ff]/50 outline-none transition-all placeholder-[#484f58] text-sm pr-12 shadow-inner"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#484f58] hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || successMsg}
                                className="w-full bg-[#238636] hover:bg-[#2eaa44] text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(35,134,54,0.2)] hover:shadow-[0_15px_40px_rgba(35,134,54,0.3)] uppercase tracking-[0.2em] text-xs"
                            >
                                {loading ? 'Processing...' : (successMsg ? 'Access Granted' : (isLogin ? 'Access Workspace' : 'Create Specialist Account'))}
                            </button>

                            <div className="text-center pt-2">
                                <span className="text-[#8b949e] text-[10px] font-medium uppercase tracking-wider">
                                    {isLogin ? "Need an account? " : "Already have credentials? "}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setSuccessMsg('');
                                    }}
                                    className="text-[#58a6ff] font-bold border-b border-[#58a6ff]/20 hover:border-[#58a6ff]/50 transition-all text-[10px] uppercase tracking-widest pb-0.5 ml-1"
                                >
                                    {isLogin ? 'Register Access' : 'Sign In'}
                                </button>
                            </div>
                            <button
                                type="button"
                                className="w-full mt-4 text-[10px] text-[#484f58] uppercase tracking-[0.2em] flex items-center justify-center gap-2 font-bold hover:text-[#8b949e] transition-colors"
                                onClick={() => navigate('/dashboard')}
                            >
                                <span className="opacity-50">←</span> Return to Dashboard
                            </button>
                        </form>
                    </motion.div>

                    {/* Decorative Corner Elements */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[#58a6ff]/30 rounded-tl-2xl -mt-1 -ml-1 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#238636]/30 rounded-br-2xl -mb-1 -mr-1 pointer-events-none"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default EnterpriseAccess;
