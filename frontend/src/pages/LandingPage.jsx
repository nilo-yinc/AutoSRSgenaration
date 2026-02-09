import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal, GraduationCap, Sparkles, Calculator, FileText,
    Lightbulb, BrainCircuit, Share2, Link, CheckCircle,
    ArrowRight, Code, Database, Server, Cloud,
    Zap, Layout, Shield
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [typedText, setTypedText] = useState('');
    const fullText = "Writes Itself.";

    // Typewriter effect
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-neon-purple selection:text-white font-sans overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Zap className="text-neon-blue fill-neon-blue/20" />
                        <span className="text-xl font-bold tracking-tight">DocuVerse</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition backdrop-blur-sm">
                            Log In
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-full text-sm font-bold shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition hover:scale-105">
                            Start Project
                        </button>
                    </div>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full text-neon-blue text-xs font-bold mb-6 tracking-wide">
                            <Sparkles size={12} /> NEW: AI Integration
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Documentation That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-neon-purple">
                                {typedText}<span className="animate-pulse">|</span>
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
                            From raw ideas to IEEE-standard SRS documents & live prototypes in seconds. The ultimate tool for CSE Students & Engineers.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-[0_0_40px_rgba(255,255,255,0.1)] group">
                                Start a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition backdrop-blur-sm flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" /> View Sample Report
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* 3D Abstract Animation */}
                <div className="hidden lg:flex justify-center relative">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative z-10"
                    >
                        <div className="w-[400px] h-[500px] bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl group">
                            {/* Pseudo-Code Animation */}
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
                            <div className="space-y-4 font-mono text-sm opacity-80">
                                <div className="flex gap-2 mb-8">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-blue-400">const</span> <span className="text-yellow-400">project</span> = <span className="text-purple-400">await</span> AI.<span className="text-blue-300">analyze</span>(idea);
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-blue-400">return</span> <span className="text-green-400">new</span> SRS_Document(project);
                                </div>
                                {/* Visual Transform */}
                                <motion.div
                                    className="mt-12 p-6 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-xl border border-white/10 flex items-center gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                >
                                    <FileText className="text-neon-blue" size={32} />
                                    <div>
                                        <div className="text-white font-bold">Report_Final.docx</div>
                                        <div className="text-xs text-gray-400">IEEE 830-1998 Standard</div>
                                    </div>
                                    <CheckCircle className="text-green-400 ml-auto" size={20} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Glows */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue to-neon-purple opacity-20 blur-3xl rounded-full -z-10"></div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Power Features (Bento Grid) */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">
                        Everything you need to <br />ace your submission.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">

                    {/* Card 1: Student Lab Suite (Large) */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 col-span-1 md:col-span-2 row-span-1 relative overflow-hidden group hover:border-gray-500 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-neon-purple">
                                    <GraduationCap />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Student Lab Suite</h3>
                                <p className="text-gray-400">Crush your Viva. Generate full Lab Reports (Index to Conclusion) with one click.</p>
                            </div>
                            <div className="mt-8">
                                <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                                    <span>METADATA</span>
                                    <span>TEAM</span>
                                    <span>COCOMO</span>
                                    <span>PDF</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: AI Prototype Engine (Tall) */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 col-span-1 md:col-span-1 md:row-span-2 relative overflow-hidden group hover:border-neon-blue/50 transition-colors">
                        <div className="absolute top-0 right-0 p-32 bg-neon-blue/10 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 text-neon-blue">
                                <Sparkles />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI Prototype Engine</h3>
                            <p className="text-gray-400 mb-8">Don't just write about it. See it. Instantly generate a live website.</p>

                            {/* Mock Window */}
                            <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                                <div className="bg-gray-800 h-6 flex items-center px-3 gap-1.5 border-b border-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-4 group-hover:bg-neon-blue/5 transition-colors h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-3 animate-pulse"></div>
                                        <div className="h-2 w-20 bg-gray-700 rounded mx-auto mb-2"></div>
                                        <div className="h-2 w-16 bg-gray-700 rounded mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs font-mono text-neon-blue flex items-center gap-1">
                                <Zap size={12} fill="currentColor" /> Powered by AI
                            </div>
                        </div>
                    </div>

                    {/* Card 3: COCOMO Calculator */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 col-span-1 relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-dotted-pattern opacity-10"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-400">
                                <Calculator size={20} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">COCOMO Calc</h3>
                            <p className="text-gray-400 text-sm mb-4">Auto-math for cost estimation.</p>
                            <div className="font-mono text-xs bg-black/50 p-2 rounded text-green-400 border border-green-500/30">
                                $Effort = 2.4(KLOC)^b$
                            </div>
                        </div>
                    </div>

                    {/* Card 4: One-Click DOCX */}
                    <div className="bg-gradient-to-br from-neon-purple/20 to-transparent border border-white/10 rounded-3xl p-8 col-span-1 relative overflow-hidden group hover:border-neon-purple transition-colors">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-white">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">IEEE 830 Ready</h3>
                            <p className="text-gray-400 text-sm">Standard compliant format. Ready to print & submit.</p>
                            <div className="absolute bottom-4 right-4 text-neon-purple opacity-50">
                                <ArrowRight />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. How It Works (Pipeline) */}
            <section className="py-24 bg-black/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">From Zero to Submission</h2>
                        <p className="text-gray-400">A streamlined pipeline for maximum efficiency.</p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                            {[
                                { icon: Lightbulb, title: "Input Idea", text: "Describe your project" },
                                { icon: BrainCircuit, title: "AI Analysis", text: "AI models requirements", pulse: true },
                                { icon: Share2, title: "Diagrams", text: "UML & DFD Generation" },
                                { icon: Link, title: "Live Link", text: "Inject Prototype URL" },
                                { icon: CheckCircle, title: "Download", text: "Get .docx File" }
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className={`w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:border-neon-blue group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] ${step.pulse ? 'animate-pulse border-neon-blue/50' : ''}`}>
                                        <step.icon className={step.pulse ? 'text-neon-blue' : 'text-gray-400 group-hover:text-white'} size={28} />
                                    </div>
                                    <h3 className="font-bold mb-1">{step.title}</h3>
                                    <p className="text-xs text-gray-500">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Educational Archive */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Master Software Engineering</h2>
                        <p className="text-gray-400">Library of standard development models.</p>
                    </div>
                    <button className="text-neon-blue text-sm font-medium hover:underline">Explore Library</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group cursor-help">
                        <div className="mb-6 opacity-50 group-hover:opacity-100 transition"><Layout size={32} className="text-blue-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Waterfall Model</h3>
                        <p className="text-sm text-gray-400 mb-4">Linear sequential design approach.</p>
                        <div className="text-xs bg-blue-500/10 text-blue-300 p-2 rounded border border-blue-500/20 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                            Best for: Fixed Requirements
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group cursor-help">
                        <div className="mb-6 opacity-50 group-hover:opacity-100 transition"><Code size={32} className="text-green-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Agile / Scrum</h3>
                        <p className="text-sm text-gray-400 mb-4">Iterative and incremental management.</p>
                        <div className="text-xs bg-green-500/10 text-green-300 p-2 rounded border border-green-500/20 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                            Best for: Changing Requirements
                        </div>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group cursor-help">
                        <div className="mb-6 opacity-50 group-hover:opacity-100 transition"><Shield size={32} className="text-purple-400" /></div>
                        <h3 className="text-xl font-bold mb-2">Spiral Model</h3>
                        <p className="text-sm text-gray-400 mb-4">Risk-driven process model generator.</p>
                        <div className="text-xs bg-purple-500/10 text-purple-300 p-2 rounded border border-purple-500/20 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                            Best for: High Risk Projects
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="border-t border-white/10 bg-[#050507] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Zap className="text-neon-purple fill-neon-purple/20" size={20} />
                            <span className="font-bold text-lg">DocuVerse</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            Made with 💜 for Engineers. © 2026
                        </div>
                    </div>

                    {/* Tech Ticker */}
                    <div className="relative overflow-hidden opacity-30 select-none">
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050507] to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050507] to-transparent z-10"></div>
                        <div className="flex animate-scroll whitespace-nowrap gap-12 text-sm font-mono text-gray-400">
                            {['React', 'Node.js', 'Python', 'FastAPI', 'MongoDB', 'Tailwind', 'AI', 'AWS', 'Docker', 'React'].map((tech, i) => (
                                <span key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> {tech}</span>
                            ))}
                            {['React', 'Node.js', 'Python', 'FastAPI', 'MongoDB', 'Tailwind', 'AI', 'AWS', 'Docker', 'React'].map((tech, i) => (
                                <span key={`dup-${i}`} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div> {tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
        .bg-dotted-pattern {
          background-image: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
