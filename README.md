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

## 🚀 How to Run the Project

1)Go to Backend:

cd backend


2)Create virtual environment:

python -m venv venv


3)Activate virtual environment:

**macOS / Linux** :

source venv/bin/activate

**Windows** :

venv\Scripts\activate


4)Install dependencies (inside the venv):

pip install -r requirements.txt


5)Run the backend:

uvicorn app:app --reload

Backend will be available at:
http://localhost:8000

6)Go to Frontend:

cd frontend

7)Install all the dependencies:

npm install

8)Run the frontend:

npm run dev


Frontend will be available at:
http://localhost:5173

Built with ❤️ by Harsh Singh
