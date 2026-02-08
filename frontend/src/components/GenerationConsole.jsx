import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const GenerationConsole = ({ isOpen, logs, onComplete }) => {
    const [displayLogs, setDisplayLogs] = useState([]);
    const [statuses, setStatuses] = useState({});
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (!isOpen) {
            setDisplayLogs([]);
            setStatuses({});
            return;
        }
        setDisplayLogs([]);
        setStatuses({});
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < logs.length) {
                const line = logs[currentIndex];
                setDisplayLogs(prev => [...prev, line]);
                setStatuses(prev => ({ ...prev, [currentIndex]: 'pending' }));
                setTimeout(() => {
                    setStatuses(prev => ({ ...prev, [currentIndex]: 'ok' }));
                }, 400);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 700);
        const t = setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
        }, 3000);
        return () => {
            clearInterval(interval);
            clearTimeout(t);
        };
    }, [isOpen, logs]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-50 flex items-center justify-center font-mono text-green-400"
                >
                    <div className="w-full max-w-2xl mx-4 p-6 border border-green-500/40 rounded-lg bg-black/95 shadow-[0_0_60px_rgba(0,255,100,0.08)]">
                        <div className="flex justify-between items-center border-b border-green-500/30 pb-3 mb-4">
                            <span className="text-green-500/80 text-sm">DOCUVERSE_KERNEL_V2.4</span>
                            <span className="text-green-500 text-xs">STATUS: ACTIVE</span>
                        </div>
                        <div className="space-y-1.5 min-h-[140px]">
                            {displayLogs.map((log, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-green-600 select-none">&gt;</span>
                                    <span className="text-gray-300">{log}</span>
                                    {statuses[index] === 'ok' && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-green-500 text-sm font-bold"
                                        >
                                            [OK]
                                        </motion.span>
                                    )}
                                </motion.div>
                            ))}
                            <motion.div
                                animate={{ opacity: [0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 0.7 }}
                                className="inline-block w-2 h-4 bg-green-500 ml-4 mt-1"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GenerationConsole;
