import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Demo = () => {
    const { id } = useParams();
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemo = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/projects/demo/${id}`);
                setHtml(res.data);
                setLoading(false);
            } catch (err) {
                console.warn("Backend demo fetch failed. Checking local storage.");
                const localProject = JSON.parse(localStorage.getItem(`project_${id}`));
                if (localProject && localProject.prototypeHtml) {
                    setHtml(localProject.prototypeHtml);
                } else {
                    setHtml('<h1 style="color:white;text-align:center;font-family:sans-serif;margin-top:50px;">404 Prototype Not Found (Offline)</h1>');
                }
                setLoading(false);
            }
        };
        fetchDemo();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Loading Prototype...</div>;

    return (
        <iframe
            srcDoc={html}
            style={{ width: '100vw', height: '100vh', border: 'none' }}
            title="Project Demo"
        />
    );
};

export default Demo;
