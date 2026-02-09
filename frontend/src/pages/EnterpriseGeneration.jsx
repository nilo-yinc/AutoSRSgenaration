import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { buildEnterpriseDocx } from '../utils/buildEnterpriseDocx';
import { useAuth } from '../context/AuthContext';
import { User, Zap } from 'lucide-react';
import ProfileSettings from './ProfileSettings';

const EnterpriseGeneration = () => {
    const loc = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing Core...');
    const [showProfile, setShowProfile] = useState(false);
    const formData = loc.state?.formData;

    const steps = [
        "Initializing Core...",
        "Analyzing Project Context...",
        "Drafting Functional Requirements...",
        "Validating Security Constraints...",
        "Optimizing Technical Architecture...",
        "Finalizing Documentation..."
    ];

    useEffect(() => {
        if (!formData) {
            navigate('/enterprise/form');
            return;
        }

        let stepIndex = 0;
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1; // 100 steps
                if (next > 100) return 100;

                // Update status text based on progress chunk
                if (next % 17 === 0 && stepIndex < steps.length - 1) {
                    stepIndex++;
                    setStatus(steps[stepIndex]);
                }
                return next;
            });
        }, 50); // 5 seconds total

        return () => clearInterval(interval);
    }, [formData]);

    const handleDownload = async () => {
        try {
            const blob = await buildEnterpriseDocx(formData);
            const safeName = (formData.projectName || "Project").replace(/[^a-z0-9]/gi, '_');
            saveAs(blob, `${safeName}_Enterprise_SRS.docx`);
        } catch (e) {
            console.error(e);
            alert("Error generating document");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col font-mono">
            {/* Top Navigation Bar with Profile */}
            <nav className="h-16 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-neon-blue/20 transition duration-300">
                        <Zap className="text-neon-blue group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple tracking-tight">DocuVerse</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white tracking-wide">{user?.name || 'User'}</div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Enterprise SRS</div>
                    </div>

                    <div
                        onClick={() => setShowProfile(true)}
                        className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 hover:border-neon-blue cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                    >
                        {user?.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-gray-400" size={20} />
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-10">

            {progress < 100 ? (
                <div className="w-full max-w-2xl text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-10 relative"
                    >
                        <div className="w-32 h-32 border-4 border-t-neon-blue border-r-neon-purple border-b-neon-green border-l-transparent rounded-full mx-auto animate-spin"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">
                            {progress}%
                        </div>
                    </motion.div>

                    <h2 className="text-2xl text-neon-blue mb-4 animate-pulse">{status}</h2>

                    <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-700 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                            style={{ width: `${progress}%` }}
                        ></motion.div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-gray-900 border border-gray-800 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                >
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-4xl font-bold text-white mb-4">Documentation Ready</h1>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Your Enterprise SRS document has been successfully compiled and is ready for download.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            className="bg-neon-green text-black font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition shadow-[0_0_20px_rgba(10,255,10,0.4)]"
                        >
                            Download DOCX
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="border border-gray-600 text-gray-400 px-8 py-4 rounded-lg hover:bg-gray-800 transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </motion.div>
            )}
            </div>

            {/* Profile Modal */}
            {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
        </div>
    );
};

export default EnterpriseGeneration;
