# How to Run AutoSRS & Check If It Works

## 1. One-time setup

### 1.1 Open the project folder
```text
cd d:\Desktop\AutoSRS
```

### 1.2 Create and activate a virtual environment

**Windows (PowerShell or CMD):**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` at the start of the line.

### 1.3 Install Python dependencies
```bash
pip install -r requirements.txt
```

### 1.4 Create your `.env` file
- Copy `.env.example` to `.env`.
- Edit `.env` and set **one** API key (Groq or Gemini). Example:

```env
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
GROQ_MODEL=gemini/gemini-1.5-pro-latest
TEXT_ONLY=1
```

Leave `TEXT_ONLY=1` for text-only (no diagrams). Save the file.

---

## 2. Run the app

**Option A – Double-click (Windows)**  
- Double-click `start.bat`.  
- It will create/use `venv`, install deps if needed, then start the server.

**Option B – From terminal**
```bash
cd d:\Desktop\AutoSRS
venv\Scripts\activate
uvicorn srs_engine.main:app --reload
```

When it’s running you should see something like:
```text
Uvicorn running on http://127.0.0.1:8000
```

---

## 3. See if it works

### 3.1 Open the app in the browser
- Go to: **http://127.0.0.1:8000**
- You should see the AutoSRS form (project name, authors, features, etc.).

### 3.2 Quick test
1. Fill in at least:
   - **Project name**
   - **At least one author**
   - **At least one core feature**
   - **Problem statement** (short is fine)
2. Click **Generate SRS**.
3. Wait 1–3 minutes (the AI is generating the document).

### 3.3 Success
- A popup: **“SRS generated successfully!”**
- The Word file is saved at:  
  `d:\Desktop\AutoSRS\srs_engine\generated_srs\<ProjectName>_SRS.docx`
- Open that `.docx` to confirm the content.

### 3.4 If something goes wrong
- **Popup “API key not configured”**  
  → Add `GROQ_API_KEY` or `GEMINI_API_KEY` to `.env` and restart.

- **Popup “Failed to generate SRS: …”**  
  → Read the message; check the terminal where the server is running for more details.

- **Server won’t start**  
  → Make sure you activated the venv (`venv\Scripts\activate`) and ran `pip install -r requirements.txt`.

---

## 4. Stop the server

In the terminal where the server is running, press **Ctrl+C**.

---

## 5. Summary

| Step              | Command / action                          |
|-------------------|--------------------------------------------|
| Go to project     | `cd d:\Desktop\AutoSRS`                    |
| Activate venv     | `venv\Scripts\activate`                   |
| Install deps      | `pip install -r requirements.txt`         |
| Set API key       | Edit `.env` (copy from `.env.example`)     |
| Run server        | `uvicorn srs_engine.main:app --reload` or `start.bat` |
| Open in browser   | http://127.0.0.1:8000                      |
| Test              | Fill form → Generate SRS → check `.docx`   |
