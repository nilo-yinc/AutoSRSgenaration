import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, FileText, Shield, Sparkles, GraduationCap, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        // Hero Animation
        const tl = gsap.timeline();
        tl.from(".hero-title", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        })
            .from(".hero-subtitle", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5")
            .from(".hero-btn", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            }, "-=0.5");

        // Scroll Animations for Features
        gsap.utils.toArray('.feature-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: "power3.out"
            });
        });

    }, { scope: heroRef });

    return (
        <div ref={heroRef} className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-neon-purple selection:text-white">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple flex items-center gap-2">
                        <FileText size={24} className="text-neon-blue" /> DocuVerse
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/dashboard')} className="bg-transparent border border-neon-blue text-neon-blue px-6 py-2 rounded-full hover:bg-neon-blue/10 transition font-medium">
                            Login
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-full hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition font-medium">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="z-10 max-w-5xl">
                    <div className="hero-title inline-block mb-4 px-4 py-1 rounded-full bg-gray-900/80 border border-gray-700 text-sm text-gray-300 backdrop-blur-sm">
                        ✨ Revolutionizing Documentation with AI
                    </div>
                    <h1 className="hero-title text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
                        One Platform.<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-purple-500 to-neon-purple">
                            Infinite Possibilities.
                        </span>
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
                        Automate your software requirements, feasibility reports, and costing analysis with the power of Gemini AI. Professional grade tools for Students and Enterprises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hero-btn group relative px-8 py-4 bg-gray-900 border border-neon-blue/50 rounded-xl overflow-hidden hover:border-neon-blue transition-all"
                        >
                            <div className="absolute inset-0 bg-neon-blue/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <Building2 className="text-neon-blue" />
                                <div className="text-left">
                                    <div className="text-xs text-neon-blue uppercase font-bold tracking-wider">For Business</div>
                                    <div className="text-lg font-bold">Enterprise SRS</div>
                                </div>
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="hero-btn group relative px-8 py-4 bg-gray-900 border border-neon-purple/50 rounded-xl overflow-hidden hover:border-neon-purple transition-all"
                        >
                            <div className="absolute inset-0 bg-neon-purple/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                <GraduationCap className="text-neon-purple" />
                                <div className="text-left">
                                    <div className="text-xs text-neon-purple uppercase font-bold tracking-wider">For Education</div>
                                    <div className="text-lg font-bold">Student Lab</div>
                                </div>
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-black via-gray-900/30 to-black relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose <span className="text-neon-blue">DocuVerse</span>?</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {/* Feature 1 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl border border-gray-800 hover:border-neon-blue/50 transition duration-300 group hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-blue/20 transition">
                                <Sparkles className="text-neon-blue w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI-Powered Generation</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Leverage Google's Gemini AI to instantly generate comprehensive prototypes, SRS documents, and feasibility checks from simple text prompts.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl border border-gray-800 hover:border-neon-purple/50 transition duration-300 group hover:shadow-[0_0_30px_rgba(188,19,254,0.2)]">
                            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-purple/20 transition">
                                <Shield className="text-neon-purple w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">IEEE Standard Compliance</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Our Enterprise module ensures all generated Software Requirements Specifications (SRS) strictly adhere to IEEE 830-1998 standards.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card p-8 bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition duration-300 group hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition">
                                <FileText className="text-pink-500 w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Instant DOCX Export</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Seamlessly export your generated reports and documentation to professionally formatted Microsoft Word (DOCX) files with one click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Benefits Section */}
            <section className="py-24 px-6 bg-black relative z-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Perfect for <span className="text-neon-blue">Students</span> & <span className="text-neon-purple">Enterprises</span></h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Student Benefits */}
                        <div className="p-10 rounded-2xl border border-neon-purple/30 bg-black/40 backdrop-blur-sm">
                            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30">
                                <GraduationCap className="text-neon-purple" size={20} />
                                <span className="text-neon-purple font-bold">Student Lab</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Academic Excellence</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-purple mt-1">→</span>
                                    <span className="text-gray-300">Generate feasibility reports and costing analysis</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-purple mt-1">→</span>
                                    <span className="text-gray-300">Create professional lab reports with diagrams & ERDs</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-purple mt-1">→</span>
                                    <span className="text-gray-300">24/7 documentation support for your projects</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-purple mt-1">→</span>
                                    <span className="text-gray-300">Learn industry-standard documentation practices</span>
                                </li>
                            </ul>
                        </div>

                        {/* Enterprise Benefits */}
                        <div className="p-10 rounded-2xl border border-neon-blue/30 bg-black/40 backdrop-blur-sm">
                            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/30">
                                <Building2 className="text-neon-blue" size={20} />
                                <span className="text-neon-blue font-bold">Enterprise SRS</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Professional Requirements</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-blue mt-1">→</span>
                                    <span className="text-gray-300">IEEE 830-1998 compliant SRS generation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-blue mt-1">→</span>
                                    <span className="text-gray-300">Enterprise-grade documentation for production</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-blue mt-1">→</span>
                                    <span className="text-gray-300">Secure handling of sensitive project data</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-neon-blue mt-1">→</span>
                                    <span className="text-gray-300">Streamlined workflow for development teams</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative z-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Documentation?</h2>
                    <p className="text-xl text-gray-400 mb-10">Choose your path and start generating professional SRS documents in minutes.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group px-8 py-4 bg-gradient-to-r from-neon-blue to-blue-600 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all"
                        >
                            🚀 Get Started Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-900 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} DocuVerse. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-neon-blue transition">Privacy Policy</a>
                    <a href="#" className="hover:text-neon-blue transition">Terms of Service</a>
                    <a href="#" className="hover:text-neon-blue transition">Contact</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
