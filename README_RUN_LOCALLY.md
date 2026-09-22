# How to Run the Intelligent Bug Diagnosis Platform Locally

This project is a full-stack **Intelligent Bug Diagnosis Platform with Fix Recommendation Assistance** consisting of:
- **Backend**: FastAPI + SQLAlchemy (SQLite database) + Multi-Agent AI Pipeline + RAG Vector Store.
- **Frontend**: React 18 + Vite + Tailwind CSS.

---

## 📋 Prerequisites & System Requirements

Before running, ensure your computer has:
1. **Python 3.10, 3.11, or 3.12+**: Download from [python.org](https://www.python.org/downloads/)
   - *Windows Note: Check the box **"Add Python to PATH"** during installation.*
2. **Node.js 18 or 20+**: Download from [nodejs.org](https://nodejs.org/)

---

## 📦 Required Python Dependencies (`requirements.txt`)

Below are the exact packages from `backend/requirements.txt`:

```text
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
SQLAlchemy>=2.0.30
pydantic>=2.7.0
email-validator>=2.2.0
pydantic-settings>=2.4.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
bcrypt>=4.0.1

# OCR (screenshot text extraction for attachments)
pytesseract>=0.3.10
Pillow>=10.0.0

# AI multi-agent pipeline (Duplicate Detection Agent's default, offline path)
numpy>=1.26.0
scikit-learn>=1.4.0

# PDF report export
reportlab>=4.2.0

# Testing
pytest>=8.0.0
httpx>=0.27.0
pypdf>=5.0.0
```

---

## ⚡ Quick Start (Windows)

### Option A: 1-Click Launch (Recommended)
1. In the project root folder, double-click:
   ```cmd
   start_all.bat
   ```
   *This automatically checks dependencies, creates `backend\venv`, installs required packages if needed, and launches both Backend and Frontend in two separate Command Prompt windows.*
2. Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**

---

### Option B: First-Time Full Setup (Optional)
If you prefer to install all packages up front:
1. Double-click `setup.bat` (installs both Python packages in `backend\venv` and npm packages in `frontend\node_modules`).
2. Once complete, double-click `start_all.bat`.

---

### Option C: Manual Command Prompt Execution

If you prefer to run commands manually in Command Prompt (`cmd.exe`):

#### 1. Start the Backend (Terminal 1)
```cmd
cd backend

:: Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate.bat

:: Install dependencies (only needed the first time)
pip install -r requirements.txt

:: (Optional) Seed database with demo bugs
python seed.py

:: Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 2. Start the Frontend (Terminal 2)
```cmd
cd frontend

:: Install node modules (only needed the first time)
npm install

:: Start Vite development server
npm run dev
```

---

## 🍎 Quick Start (macOS / Linux)

1. Open terminal in the project directory:
   ```bash
   chmod +x setup.sh start_all.sh
   ./setup.sh
   ./start_all.sh
   ```
2. Open **[http://localhost:5173](http://localhost:5173)**

---

## 🐳 Docker Execution

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🌐 URLs & Ports

| Service | URL | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5173` | Main interactive UI |
| **Neural Sandbox** | `http://localhost:5173/neural-sandbox` | Live particle grid & glitch purge |
| **Developer Terminal** | `http://localhost:5173/terminal` | In-browser CLI shell |
| **Backend API Health** | `http://127.0.0.1:8000/api/health` | Healthcheck endpoint |
| **Interactive API Docs** | `http://127.0.0.1:8000/docs` | Swagger interactive API documentation |

---

## 👤 Creating an Account & Roles

- Click **"Create account"** on the login page or navigate directly to `http://localhost:5173/register`.
- Enter your Name, Email, and Password (at least 8 characters).
- **First User Rule**: The very first account registered on the database automatically receives the **Admin** role with full access to the Control Center.
- Subsequent registered users receive the standard **Developer** role.
- **Seed Demo User**:
  - Email: `demo@bugadvisor.dev`
  - Password: `demo1234`

---

## 🛠️ Troubleshooting

- **"Cannot connect to backend server"**:
  Make sure the backend terminal window is open and showing `Uvicorn running on http://127.0.0.1:8000`.
- **Database migrations**:
  SQLite database schema migrations run automatically on backend startup. No manual SQL commands required.
- **`ModuleNotFoundError: No module named 'app'`**:
  Make sure you run `uvicorn app.main:app` from inside the `backend/` directory, not from the root directory.
