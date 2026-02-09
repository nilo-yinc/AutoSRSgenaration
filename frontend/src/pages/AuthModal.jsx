import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, LogIn, UserPlus, Loader } from 'lucide-react';

const AuthModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await login(email, password);
                if (res.success) {
                    onClose();
                } else {
                    setError(res.msg || 'Login failed');
                }
            } else {
                const res = await register(name, email, password);
                if (res.success) {
                    // Auto switch to login or auto login? 
                    // register currently returns msg: "Please login"
                    // Let's switch to login view
                    setIsLogin(true);
                    setError('Registration successful! Please login.');
                } else {
                    setError(res.msg || 'Registration failed');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-card border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="bg-gray-900/50 p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {isLogin ? <LogIn className="text-neon-blue" /> : <UserPlus className="text-neon-purple" />}
                        {isLogin ? 'Login Required' : 'Create Account'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className={`mb-6 p-3 rounded text-sm ${error.includes('successful') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} border`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                                <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-purple px-3 py-2">
                                    <User size={18} className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent w-full text-white focus:outline-none placeholder-gray-600"
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-blue px-3 py-2">
                                <Mail size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-transparent w-full text-white focus:outline-none placeholder-gray-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Password</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-blue px-3 py-2">
                                <Lock size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-transparent w-full text-white focus:outline-none placeholder-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded font-bold text-white transition flex justify-center items-center gap-2 mt-2 ${isLogin ? 'bg-neon-blue hover:bg-blue-600 shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'bg-neon-purple hover:bg-purple-700 shadow-[0_0_15px_rgba(188,19,254,0.3)]'}`}
                        >
                            {loading && <Loader className="animate-spin" size={18} />}
                            {isLogin ? 'Enter Dashboard' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className={`ml-2 font-medium hover:underline ${isLogin ? 'text-neon-purple' : 'text-neon-blue'}`}
                        >
                            {isLogin ? 'Register now' : 'Login here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
