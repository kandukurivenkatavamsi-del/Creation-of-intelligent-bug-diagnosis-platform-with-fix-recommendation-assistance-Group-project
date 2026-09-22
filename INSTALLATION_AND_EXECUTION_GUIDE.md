# Intelligent Bug Diagnosis Platform
## Requirements, Installation & Execution Guide

This comprehensive document contains the complete **`requirements.txt`**, system prerequisites, step-by-step **installation instructions**, and **execution steps** for running the Intelligent Bug Diagnosis Platform.

---

## 1. System Prerequisites

Before starting, ensure your system meets the following requirements:

- **Python**: Version `3.10`, `3.11`, or `3.12+`
  - *Windows Note: Ensure you check the box **"Add Python to PATH"** during installation.*
- **Node.js**: Version `18.x` or `20.x+` (includes `npm`) from [nodejs.org](https://nodejs.org/)
- **Git**: Installed and available in terminal
- *(Optional) Tesseract OCR*: Needed only for screenshot text extraction (gracefully skipped if not installed)
- *(Optional) Docker & Docker Compose*: For containerized deployment

---

## 2. Requirements & Dependencies

### Backend Dependencies (`requirements.txt`)

Below is the complete, exact content of `backend/requirements.txt`:

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

#### Package Explanations:
| Package | Version | Purpose |
|---|---|---|
| `fastapi` | `>=0.111.0` | High-performance asynchronous Web API framework |
| `uvicorn[standard]` | `>=0.29.0` | Lightning-fast ASGI production web server |
| `SQLAlchemy` | `>=2.0.30` | SQL toolkit and Object-Relational Mapper (ORM) |
| `pydantic` | `>=2.7.0` | Data validation and schema parsing |
| `pydantic-settings` | `>=2.4.0` | Application settings and environment management |
| `python-jose` / `cryptography` | `>=3.3.0` | Secure JWT authentication token encoding/decoding |
| `passlib` / `bcrypt` | `>=1.7.4` / `>=4.0.1` | Password hashing with salted bcrypt |
| `python-multipart` | `>=0.0.9` | Multipart form parser for bug file attachments |
| `pytesseract` / `Pillow` | `>=0.3.10` / `>=10.0.0` | Image processing and OCR screenshot text extraction |
| `numpy` / `scikit-learn` | `>=1.26.0` / `>=1.4.0` | Machine learning, TF-IDF vectorization & cosine similarity |
| `reportlab` | `>=4.2.0` | Server-side PDF report compilation |
| `pytest` / `httpx` / `pypdf` | `>=8.0.0` / `>=0.27.0` / `>=5.0.0` | Automated test suite, async HTTP client, and PDF validation |

---

### Optional Semantic Upgrade (`requirements-semantic.txt`)

For advanced semantic embeddings with deep neural transformers:
```text
sentence-transformers==3.1.1
faiss-cpu==1.9.0
```
*(Note: If omitted, the platform automatically and silently falls back to scikit-learn TF-IDF + Cosine Similarity with zero loss of platform stability).*

---

### Frontend Dependencies (`package.json`)

The frontend is built on **React 18 + Vite + Tailwind CSS**:

```json
{
  "dependencies": {
    "axios": "^1.7.7",
    "chart.js": "^4.4.4",
    "react": "^18.3.1",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}
```

---

## 3. Installation Steps

### Option A: 1-Click Automated Setup (Windows)

1. Open the project root folder.
2. Double-click:
   ```cmd
   setup.bat
   ```
   *This automatically checks Python and Node.js, creates `backend\venv`, installs all pip packages from `requirements.txt`, and runs `npm install` in `frontend\`.*

---

### Option B: 1-Click Automated Setup (macOS / Linux)

1. Open your terminal in the project root folder.
2. Run:
   ```bash
   chmod +x setup.sh start_all.sh
   ./setup.sh
   ```

---

### Option C: Manual Installation Steps

#### Step 1: Clone or Navigate to the Project
```bash
git clone https://github.com/kandukurivenkatavamsi-del/Creation-of-intelligent-bug-diagnosis-platform-with-fix-recommendation-assistance-Group-project.git
cd Creation-of-intelligent-bug-diagnosis-platform-with-fix-recommendation-assistance-Group-project
```

#### Step 2: Backend Installation
```bash
cd backend

# 1. Create a Python virtual environment
python -m venv venv

# 2. Activate the virtual environment
# Windows (Command Prompt):
call venv\Scripts\activate.bat
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

# 3. Upgrade pip and install required packages
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 3: Frontend Installation
```bash
# Navigate to the frontend directory
cd ../frontend

# Install node dependencies
npm install
```

---

## 4. Execution Steps

### Option A: 1-Click Launch (Windows)

1. In the project root folder, double-click:
   ```cmd
   start_all.bat
   ```
   *This opens two terminal windows: one running the FastAPI backend on port 8000, and one running the Vite frontend on port 5173.*
2. Open your browser to: **`http://localhost:5173`**

---

### Option B: 1-Click Launch (macOS / Linux)

1. In the project root folder, run:
   ```bash
   ./start_all.sh
   ```
2. Open your browser to: **`http://localhost:5173`**

---

### Option C: Manual Execution (Two Terminals)

#### Terminal 1: Start Backend Server
```bash
cd backend

# Activate virtual environment
# Windows:
call venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# (Optional) Seed the database with sample bugs & demo user:
python seed.py

# Launch the FastAPI server:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend will start at: `http://127.0.0.1:8000`

#### Terminal 2: Start Frontend Development Server
```bash
cd frontend

# Launch Vite development server:
npm run dev
```
Frontend will start at: `http://localhost:5173`

---

### Option D: Docker Execution

Run the complete full-stack environment using Docker Compose:
```bash
docker-compose up --build
```
- Access Frontend: `http://localhost:5173`
- Access Backend API: `http://localhost:8000`

---

## 5. Application URLs & Default Accounts

| Endpoint | URL | Description |
|---|---|---|
| **Frontend Web App** | `http://localhost:5173` | Main dashboard & user interface |
| **Interactive API Docs (Swagger)** | `http://127.0.0.1:8000/docs` | Interactive API documentation |
| **Alternative API Docs (ReDoc)** | `http://127.0.0.1:8000/redoc` | OpenAPI spec documentation |
| **Backend Health Check** | `http://127.0.0.1:8000/api/health` | Service health status |

### User Accounts & First-User Admin Bootstrap
- **Bootstrap Admin**: The very first user to register at `http://localhost:5173/register` automatically receives the **Admin** role.
- **Demo Seed Account** (if `python seed.py` was executed):
  - **Email**: `demo@bugadvisor.dev`
  - **Password**: `demo1234`
  - **Role**: `Developer`

---

## 6. Running Automated Tests

To run the full backend test suite (99 automated unit, integration, and agent pipeline tests):

```bash
cd backend
# Activate virtual environment
call venv\Scripts\activate.bat   # Windows
# source venv/bin/activate      # macOS/Linux

pytest -v
```

---

## 7. Troubleshooting

- **`ModuleNotFoundError: No module named 'app'`**: Ensure you run `uvicorn app.main:app` from inside the `backend/` directory.
- **Port 8000 or 5173 already in use**: Close any existing Python or Node processes or change the port using `--port <PORT>`.
- **Database schema updates**: SQLite schema migrations run automatically on backend startup. No manual SQL scripts required.
