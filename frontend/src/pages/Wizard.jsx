import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import GenerationConsole from '../components/GenerationConsole';
import { useAuth } from '../context/AuthContext';
import { buildLabReportDocx } from '../utils/buildLabReportDocx';

const Wizard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [logs, setLogs] = useState([]);

    const initialEffort = 2.4 * Math.pow(5, 1.05);
    const initialTime = 2.5 * Math.pow(initialEffort, 0.38);
    const [formData, setFormData] = useState({
        title: '',
        domain: 'Web Development',
        teamMembers: [{ name: '', rollNo: '', univRollNo: '' }],
        techStack: { frontend: 'React', backend: 'Node', database: 'MongoDB' },
        cocomo: {
            kloc: 5,
            effort: Number(initialEffort.toFixed(2)),
            time: Number(initialTime.toFixed(2)),
            cost: Number((initialEffort * 5000).toFixed(2))
        },
        diagrams: {}, // { key: base64 }
        features: 'User Login, Dashboard, Payment Gateway',
        themeColor: 'Blue'
    });

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleTeamChange = (index, field, value) => {
        const newTeam = [...formData.teamMembers];
        newTeam[index][field] = value;
        setFormData(prev => ({ ...prev, teamMembers: newTeam }));
    };

    const addMember = () => setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { name: '', rollNo: '', univRollNo: '' }] }));

    const removeMember = (index) => {
        if (formData.teamMembers.length > 1) {
            const newTeam = formData.teamMembers.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, teamMembers: newTeam }));
        }
    };

    const calculateCocomo = (klocVal) => {
        const kloc = Number(klocVal) || 0;
        // Organic Mode: E = 2.4 * (KLOC)^1.05
        const effortNum = 2.4 * Math.pow(kloc, 1.05);
        const timeNum = 2.5 * Math.pow(effortNum, 0.38);
        const costNum = effortNum * 5000; // $5000 per person-month
        setFormData(prev => ({
            ...prev,
            cocomo: {
                kloc,
                effort: Number(effortNum.toFixed(2)),
                time: Number(timeNum.toFixed(2)),
                cost: Number(costNum.toFixed(2))
            }
        }));
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, diagrams: { ...prev.diagrams, [key]: reader.result } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProject = async () => {
        const fallbackProject = { ...formData, _id: Date.now().toString() }; // Mock ID
        try {
            const res = await axios.post('/api/projects/save', { ...formData, projectId }, {
                headers: { 'x-auth-token': token }
            });
            setProjectId(res.data._id);
            return res.data;
        } catch (err) {
            console.warn("Backend save failed. Saving locally.");
            localStorage.setItem(`project_${fallbackProject._id}`, JSON.stringify(fallbackProject));
            setProjectId(fallbackProject._id);
            return fallbackProject;
        }
    };

    const generatePrototype = async () => {
        let currentPid = projectId;
        if (!currentPid) {
            const saved = await saveProject();
            if (!saved) return;
            currentPid = saved._id;
        }
        setLoading(true);
        try {
            const res = await axios.post('/api/projects/generate-prototype', {
                projectId: currentPid,
                features: formData.features,
                themeColor: formData.themeColor
            }, {
                headers: { 'x-auth-token': token }
            });
            alert('Prototype Generated Successfully!');
        } catch (err) {
            console.warn("Backend generation failed. Using mock prototype.");
            // Mock AI Generation for offline mode
            const mockHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${formData.title}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-gray-900 text-white font-sans">
                    <header class="p-6 bg-gray-800 flex justify-between items-center">
                        <h1 class="text-3xl font-bold text-blue-400">${formData.title}</h1>
                        <nav><a href="#" class="text-gray-300 hover:text-white">Home</a></nav>
                    </header>
                    <main class="p-10 text-center">
                        <h2 class="text-5xl font-bold mb-6">Welcome to ${formData.title}</h2>
                        <p class="text-xl text-gray-400 mb-8">Generated by DocuVerse AI</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="p-6 border border-gray-700 rounded bg-gray-800">
                                <h3 class="text-2xl font-bold text-purple-400 mb-2">Feature 1</h3>
                                <p>Dynamic Feature Implementation</p>
                            </div>
                            <div class="p-6 border border-gray-700 rounded bg-gray-800">
                                <h3 class="text-2xl font-bold text-green-400 mb-2">Feature 2</h3>
                                <p>Responsive Design</p>
                            </div>
                            <div class="p-6 border border-gray-700 rounded bg-gray-800">
                                <h3 class="text-2xl font-bold text-pink-400 mb-2">Feature 3</h3>
                                <p>AI Integration</p>
                            </div>
                        </div>
                    </main>
                    <footer class="text-center p-6 text-gray-600 mt-10">
                        &copy; 2024 ${formData.title}. Powered by DocuVerse.
                    </footer>
                </body>
                </html>
            `;

            // Save mock HTML to local storage for the Demo page to pick up
            const projectKey = `project_${currentPid}`;
            const existing = JSON.parse(localStorage.getItem(projectKey) || '{}');
            existing.prototypeHtml = mockHtml;
            existing.hasPrototype = true;
            localStorage.setItem(projectKey, JSON.stringify(existing));

            alert('Prototype Generated (Offline Mode)!');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const teamLabel = formData.teamMembers.filter(m => m.name).length
            ? formData.teamMembers.map(m => m.name.split(/\s/).pop() || 'Member').slice(0, 3).join(' ').toUpperCase()
            : 'TEAM';
        setLogs([
            'Connecting to DocuVerse Engine...',
            `Injecting Team Data [${teamLabel}]...`,
            'Fetching Live Prototype Link...',
            'Compiling IEEE Standard DOCX...'
        ]);
        setConsoleOpen(true);
        // Console will trigger onComplete -> generateDocx
    };

    const generateDocx = async () => {
        try {
            const blob = await buildLabReportDocx({ formData, projectId: projectId || 'local' });
            saveAs(blob, `${(formData.title || 'LabReport').replace(/[^a-zA-Z0-9-_]/g, '_')}_Report.docx`);
        } catch (err) {
            console.error('DOCX generation failed:', err);
        }
        setConsoleOpen(false);
    };

    return (
        <div className="flex h-screen bg-black text-white p-10 font-mono">
            <GenerationConsole isOpen={consoleOpen} logs={logs} onComplete={generateDocx} />

            <div className="w-1/4 border-r border-gray-800 pr-10">
                <h1 className="text-3xl font-bold text-neon-blue mb-8">Lab Suite</h1>
                <div className="space-y-4">
                    {['Identity', 'Team', 'Feasibility', 'Diagrams', 'Prototype'].map((s, i) => (
                        <div key={i} className={`p-3 rounded cursor-pointer ${step === i + 1 ? 'bg-neon-purple text-black font-bold' : 'text-gray-500'}`}
                            onClick={() => setStep(i + 1)}>
                            {i + 1}. {s}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-3/4 pl-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl text-neon-green mb-4">Project Identity</h2>
                                <input placeholder="Project Title" className="w-full bg-dark-input p-4 rounded border border-gray-700 outline-none focus:border-neon-blue"
                                    value={formData.title} onChange={e => updateField('title', e.target.value)} />
                                <select className="w-full bg-dark-input p-4 rounded border border-gray-700 outline-none"
                                    value={formData.domain} onChange={e => updateField('domain', e.target.value)}>
                                    <option>Web Development</option>
                                    <option>App Development</option>
                                    <option>AI/ML</option>
                                </select>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl text-neon-green mb-4">Team Config</h2>
                                {formData.teamMembers.map((m, i) => (
                                    <div key={i} className="flex gap-4">
                                        <input placeholder="Name" className="bg-dark-input p-2 rounded w-1/3" value={m.name} onChange={e => handleTeamChange(i, 'name', e.target.value)} />
                                        <input placeholder="Class Roll" className="bg-dark-input p-2 rounded w-1/4" value={m.rollNo} onChange={e => handleTeamChange(i, 'rollNo', e.target.value)} />
                                        <input placeholder="Univ Roll" className="bg-dark-input p-2 rounded w-1/4" value={m.univRollNo} onChange={e => handleTeamChange(i, 'univRollNo', e.target.value)} />
                                        <button onClick={() => removeMember(i)} className="text-red-500">x</button>
                                    </div>
                                ))}
                                <button onClick={addMember} className="text-neon-blue hover:underline">+ Add Member</button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl text-neon-green mb-4">Feasibility & COCOMO</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <input placeholder="Frontend (e.g. React)" className="bg-dark-input p-2 rounded" value={formData.techStack.frontend} onChange={e => setFormData(p => ({ ...p, techStack: { ...p.techStack, frontend: e.target.value } }))} />
                                    <input placeholder="Backend" className="bg-dark-input p-2 rounded" value={formData.techStack.backend} onChange={e => setFormData(p => ({ ...p, techStack: { ...p.techStack, backend: e.target.value } }))} />
                                    <input placeholder="Database" className="bg-dark-input p-2 rounded" value={formData.techStack.database} onChange={e => setFormData(p => ({ ...p, techStack: { ...p.techStack, database: e.target.value } }))} />
                                </div>
                                <div className="p-6 bg-gray-900 rounded border border-gray-700">
                                    <h3 className="text-xl mb-4 text-gray-400">COCOMO Estimator</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <label>Estimated KLOC:</label>
                                        <input type="number" className="bg-black border border-gray-600 p-1 w-24 text-center rounded"
                                            value={formData.cocomo.kloc} onChange={e => calculateCocomo(Number(e.target.value) || 0)} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 text-center">
                                        <div><div className="text-3xl font-bold text-neon-purple">{formData.cocomo.effort}</div><div className="text-xs text-gray-500">Person-Months</div></div>
                                        <div><div className="text-3xl font-bold text-neon-blue">${formData.cocomo.cost}</div><div className="text-xs text-gray-500">Est. Cost</div></div>
                                        <div><div className="text-3xl font-bold text-white">{formData.cocomo.time}</div><div className="text-xs text-gray-500">Months</div></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl text-neon-green mb-4">Diagram Uploads</h2>
                                {['useCase', 'dfd0', 'dfd1', 'classDiagram'].map(key => (
                                    <div key={key} className="flex justify-between items-center bg-gray-900 p-4 rounded">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <input type="file" onChange={e => handleFileChange(e, key)} className="text-sm text-gray-400" />
                                        {formData.diagrams[key] && <span className="text-green-500">✓ Uploaded</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl text-neon-green mb-4">Prototype Studio</h2>
                                <textarea placeholder="Describe features for AI generation (e.g. User Login, Dashboard, Payment Gateway)..." className="w-full bg-dark-input p-4 rounded h-28 outline-none border border-gray-700 focus:border-neon-blue"
                                    value={formData.features} onChange={e => updateField('features', e.target.value)} />
                                <div className="flex items-center gap-4">
                                    <label className="text-gray-400">Theme color:</label>
                                    <select className="bg-dark-input p-2 rounded border border-gray-700 outline-none focus:border-neon-blue" value={formData.themeColor} onChange={e => updateField('themeColor', e.target.value)}>
                                        <option>Blue</option>
                                        <option>Purple</option>
                                        <option>Green</option>
                                        <option>Red</option>
                                        <option>Orange</option>
                                        <option>Slate</option>
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={generatePrototype} disabled={loading} className="bg-neon-purple px-6 py-3 rounded font-bold hover:opacity-80 disabled:opacity-50">
                                        {loading ? 'Generating...' : '✨ Generate AI Live Site'}
                                    </button>
                                    {projectId && (
                                        <a href={`/demo/${projectId}`} target="_blank" rel="noreferrer" className="flex items-center justify-center border border-neon-blue text-neon-blue px-6 py-3 rounded font-bold hover:bg-neon-blue/10">
                                            Preview Site ↗
                                        </a>
                                    )}
                                </div>

                                <div className="border-t border-gray-800 pt-8 mt-8">
                                    <h3 className="text-xl mb-4">Final Output</h3>
                                    <button onClick={handleDownloadReport} className="w-full bg-green-600 hover:bg-green-700 p-4 rounded font-bold flex items-center justify-center gap-2">
                                        <span>Download Standard Lab Report (.docx)</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex justify-between">
                    <button onClick={() => setStep(Math.max(1, step - 1))} className={`text-gray-500 ${step === 1 ? 'invisible' : ''}`}>← Back</button>
                    <button onClick={() => setStep(Math.min(5, step + 1))} className={`bg-white text-black px-6 py-2 rounded font-bold ${step === 5 ? 'invisible' : ''}`}>Next →</button>
                </div>
            </div>
        </div>
    );
};

export default Wizard;
