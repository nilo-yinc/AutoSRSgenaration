import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Zap, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-gray-900 text-white font-sans selection:bg-neon-purple selection:text-white flex flex-col overflow-hidden">

            {/* Header */}
            <nav className="h-20 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-neon-blue/20 transition duration-300">
                        <Zap className="text-neon-blue group-hover:scale-110 transition-transform" size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple tracking-tight">DocuVerse</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white tracking-wide">Choose Your Path</div>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Enterprise or Student</div>
                    </div>
                </div>
            </nav>

            {/* Split Screen Content */}
            <div className="flex-1 flex flex-col md:flex-row relative">

                {/* Enterprise SRS Side */}
                <motion.div
                    className="w-full md:w-1/2 bg-gray-900 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-800 hover:bg-gray-800/80 transition-colors cursor-pointer group relative overflow-hidden p-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => navigate('/enterprise/access')}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-gray-700 group-hover:border-neon-blue/50">
                            <Building2 className="text-neon-blue w-12 h-12" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors duration-300">Enterprise SRS</h2>
                        <p className="text-gray-400 max-w-md text-center text-lg leading-relaxed">
                            IEEE 830-1998 compliant SRS generation. Professional documentation for serious engineering teams.
                        </p>

                        <div className="mt-10 px-8 py-3 border border-neon-blue/30 text-neon-blue rounded-full font-semibold group-hover:bg-neon-blue/10 group-hover:border-neon-blue transition-all duration-300 flex items-center gap-2">
                            Access Module
                        </div>
                    </div>
                </motion.div>

                {/* Student Lab Side */}
                <motion.div
                    className="w-full md:w-1/2 bg-black flex flex-col justify-center items-center relative overflow-hidden cursor-pointer group p-8"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    onClick={() => navigate('/student/access')}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 z-0"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-900/80 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-gray-800 group-hover:border-neon-purple/50">
                            <GraduationCap className="text-neon-purple w-12 h-12" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-4 animate-pulse-slow">
                            Student Lab Suite
                        </h2>
                        <p className="text-gray-400 max-w-md text-center text-lg leading-relaxed mb-2">
                            The ultimate toolkit for students.
                        </p>
                        <ul className="text-sm text-gray-500 flex gap-4 mb-8">
                            <li className="flex items-center gap-1"><Sparkles size={14} className="text-neon-purple" /> Lab Reports</li>
                            <li className="flex items-center gap-1"><Sparkles size={14} className="text-neon-purple" /> UML Diagrams</li>
                            <li className="flex items-center gap-1"><Sparkles size={14} className="text-neon-purple" /> Prototypes</li>
                        </ul>

                        <button className="px-10 py-4 bg-gradient-to-r from-neon-blue via-purple-500 to-neon-purple text-white rounded-full font-bold shadow-[0_0_20px_rgba(188,19,254,0.4)] group-hover:shadow-[0_0_35px_rgba(188,19,254,0.6)] hover:scale-105 transition-all duration-300">
                            Launch Wizard 🚀
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
