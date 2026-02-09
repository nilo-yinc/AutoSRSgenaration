import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Stars, CalendarClock, Rocket } from 'lucide-react';

const StudentComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0e1116] text-[#f5f1e8] font-sans relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-[#b9805a]/18 rounded-full blur-[110px]"></div>
                <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-[#3a7ca5]/18 rounded-full blur-[130px]"></div>
                <div className="absolute top-1/3 left-1/2 w-[2px] h-[60%] bg-gradient-to-b from-transparent via-[#f5f1e8]/10 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-12 rounded-xl bg-[#1b1f23] border border-[#2b3137] flex items-center justify-center">
                            <Sparkles className="text-[#e3b684]" size={20} />
                        </div>
                        <div>
                            <div className="text-sm uppercase tracking-[0.2em] text-[#e3b684]">Student Lab Suite</div>
                            <div className="text-2xl font-semibold text-[#f5f1e8]">DocuVerse Labs</div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm px-4 py-2 border border-[#3b434b] rounded-full hover:bg-[#1b1f23] transition"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-6xl font-semibold leading-tight"
                        >
                            A student workspace built like a real engineering lab.
                        </motion.h1>
                        <p className="text-[#c9c3b8] mt-6 text-lg leading-relaxed">
                            This is not a generic report generator. It is a guided lab studio with
                            verified templates, structured evaluation cues, and real submission checklists
                            so your work looks faculty-ready on day one.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/enterprise/form')}
                                className="px-6 py-3 bg-[#f5f1e8] text-[#121416] rounded-full font-semibold hover:bg-white transition flex items-center gap-2"
                            >
                                Explore Enterprise SRS <Rocket size={16} />
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 border border-[#3b434b] rounded-full font-medium hover:bg-[#1b1f23] transition flex items-center gap-2"
                            >
                                Keep me posted <Stars size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#14171a] border border-[#2b3137] rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex items-center gap-3 text-[#e3b684] mb-6">
                            <CalendarClock size={18} />
                            <span className="text-xs uppercase tracking-[0.3em]">Coming Soon</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Lab Report Studio', text: 'Index-to-conclusion reports with verified university formats.' },
                                { title: 'Viva Drill Mode', text: 'Topic-based viva cards with scoring and confidence tips.' },
                                { title: 'Submission Pack', text: 'Auto cover sheets, diagrams, and print-ready exports.' },
                                { title: 'CSE Lab Tracker', text: 'Weekly progress map so you never miss a lab task.' }
                            ].map((item) => (
                                <div key={item.title} className="p-4 rounded-2xl bg-[#1b1f23] border border-[#2b3137]">
                                    <div className="text-lg font-semibold text-[#f5f1e8]">{item.title}</div>
                                    <div className="text-sm text-[#b4aea5] mt-1">{item.text}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-xs text-[#8e877d]">
                            You are authenticated. Your access is reserved for early drop.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentComingSoon;
