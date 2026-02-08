import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { buildEnterpriseDocx } from '../utils/buildEnterpriseDocx';

const EnterpriseGeneration = () => {
    const loc = useLocation();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing Core...');
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
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 font-mono">

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
    );
};

export default EnterpriseGeneration;
