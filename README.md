# ✈️ FlightSense

FlightSense is an AI-powered flight ticket price prediction platform built using
machine learning and a modern full-stack architecture.

## 🔍 Features
- Predict flight ticket prices using XGBoost
- Interactive dashboard for model evaluation
- Smart UX hints (cheaper earlier/later flights)
- Explainable AI predictions
- React + FastAPI full-stack system

## 🧠 Tech Stack
**Frontend**
- React (Vite)
- Tailwind CSS
- Recharts
- Framer Motion

**Backend**
- FastAPI
- Scikit-learn
- XGBoost

🚀 How to Run the Project
Backend
cd backend


Create virtual environment

python -m venv venv


Activate virtual environment

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate


Install dependencies (inside the venv)

pip install -r requirements.txt


Run the backend

uvicorn app:app --reload


Backend will be available at:

http://localhost:8000

Frontend
cd frontend
npm install
npm run dev


Frontend will be available at:

http://localhost:5173

Built with ❤️ by Harsh Singh
