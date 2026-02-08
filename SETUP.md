# AutoSRS - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Install Mermaid CLI for diagram generation
npm install -g @mermaid-js/mermaid-cli
```

### 2. Configure API Keys

Copy `.env.example` to `.env` and add your API keys:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and add your keys:
- Get Gemini API key from: https://aistudio.google.com/app/apikey
- Get Groq API key from: https://console.groq.com/keys

### 3. Windows Users - Configure Mermaid CLI Path

Open `srs_engine/utils/globals.py` (line 240) and update the mmdc path:

```python
cmd = [
    "C:\\Users\\YOUR_USERNAME\\AppData\\Roaming\\npm\\mmdc.cmd",
    # ... rest of the command
]
```

Replace `YOUR_USERNAME` with your actual Windows username.

### 4. Start the Server

```bash
uvicorn srs_engine.main:app --reload
```

Open browser at: http://127.0.0.1:8000

## Troubleshooting

### Rate Limit Errors
- Switch to Gemini Pro in `.env`
- System includes automatic retry logic

### Diagram Generation Fails
- Verify mmdc is installed: `mmdc --version`
- Check path in `globals.py` (Windows only)

### Port 8000 Already in Use
```bash
uvicorn srs_engine.main:app --reload --port 8001
```
