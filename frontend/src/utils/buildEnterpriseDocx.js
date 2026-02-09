import axios from 'axios';

/**
 * Builds the Enterprise SRS DOCX by calling the backend API.
 * The backend handles AI generation and DOCX construction.
 * 
 * @param {Object} formData - The form data collected from the wizard.
 * @returns {Promise<Blob>} - A Blob containing the generated DOCX file.
 */
export async function buildEnterpriseDocx(formData) {
    try {
        const token = localStorage.getItem('token');
        
        // Call the Node.js backend to initiate the generation process
        // The backend will:
        // 1. Create a Project record
        // 2. Call the Python service to expand content and generate the DOCX
        // 3. Return a download URL
        // Note: Using the proxy path /api which redirects to Node backend (port 5000)
        const response = await axios.post('/api/projects/enterprise/generate', 
            { formData },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.srs_document_path) {
            let downloadUrl = response.data.srs_document_path;
            
            // Handle development environment path adjustments
            // If the path comes back as relative (from Python backend), we might need to target the Python port directly
            // or rely on a proxy. 
            // Previous working configuration suggested direct access or proxy handling.
            // If the URL is relative like /download_srs/..., we try to fetch it.
            // If we are in dev, and there is no proxy for /download_srs, we might need to hit Python (8000) directly.
            
            if (downloadUrl.startsWith('/') && !downloadUrl.startsWith('/api')) {
                 // Attempt to fetch from Python backend directly in dev environment
                 downloadUrl = `http://127.0.0.1:8000${downloadUrl}`;
            }

            const fileResponse = await axios.get(downloadUrl, {
                responseType: 'blob'
            });

            return fileResponse.data;
        } else {
            throw new Error("Backend did not return a valid document path.");
        }

    } catch (error) {
        console.error("Error generating Enterprise SRS:", error);
        throw error;
    }
}
