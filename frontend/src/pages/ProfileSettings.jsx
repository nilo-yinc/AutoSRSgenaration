import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, LogOut, X, Camera, Save, Loader } from 'lucide-react';

const ProfileSettings = ({ onClose }) => {
    const { user, updateProfile, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        profilePic: user?.profilePic || '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Update form data if user changes (e.g. after save)
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                profilePic: user.profilePic || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        const data = {
            name: formData.name,
            phone: formData.phone,
            profilePic: formData.profilePic,
        };
        if (formData.newPassword) {
            data.password = formData.newPassword;
        }

        const res = await updateProfile(data);
        setLoading(false);
        if (res.success) {
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, newPassword: '' })); // Clear password field
            setTimeout(() => {
                setMsg({ type: '', text: '' });
                // onClose(); // Optional: close on success
            }, 2000);
        } else {
            setMsg({ type: 'error', text: res.msg });
        }
    };

    const handleLogout = () => {
        logout();
        // Redirect handled by App.jsx or Dashboard protection
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-dark-card border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-fadeIn">

                {/* Header */}
                <div className="bg-gray-900/50 p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-neon-blue" /> Profile Settings
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">

                    {/* Message Alert */}
                    {msg.text && (
                        <div className={`mb-4 p-3 rounded text-sm ${msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-neon-blue flex items-center justify-center relative overflow-hidden group">
                            {formData.profilePic ? (
                                <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-gray-500" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                <span className="text-xs text-white">Change URL</span>
                            </div>
                        </div>
                        <div className="mt-3 w-full">
                            <label className="text-xs text-gray-400 mb-1 block">Profile Picture URL</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-blue px-3 py-2">
                                <Camera size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    name="profilePic"
                                    value={formData.profilePic}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="bg-transparent w-full text-sm text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-blue px-3 py-2">
                                <User size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-transparent w-full text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                            <div className="flex items-center bg-dark-input/50 rounded border border-gray-800 px-3 py-2 cursor-not-allowed">
                                <Mail size={16} className="text-gray-600 mr-2" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-transparent w-full text-gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Phone Number</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-blue px-3 py-2">
                                <Phone size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890"
                                    className="bg-transparent w-full text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="pt-2">
                            <label className="text-sm text-neon-purple mb-1 block font-medium">Change Password</label>
                            <div className="flex items-center bg-dark-input rounded border border-gray-700 focus-within:border-neon-purple px-3 py-2">
                                <Lock size={16} className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="New Password (min 6 chars)"
                                    className="bg-transparent w-full text-white focus:outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password.</p>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-2.5 rounded hover:bg-red-500/20 transition flex justify-center items-center gap-2 font-medium"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white py-2.5 rounded hover:shadow-lg hover:opacity-90 transition flex justify-center items-center gap-2 font-bold disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
