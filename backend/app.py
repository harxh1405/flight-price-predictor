from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from fastapi import HTTPException


app = FastAPI(title="FlightSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://flightsense-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained pipeline
model = joblib.load("model/flight_model.pkl")

print("LOADED MODEL PIPELINE:", model)

# 🔴 HARD FAIL if preprocessor is missing
if not hasattr(model, "named_steps") or "preprocessor" not in model.named_steps:
    raise RuntimeError(
        "❌ Loaded model does NOT contain a preprocessor. "
        "You are loading the WRONG model file."
    )


class FlightInput(BaseModel):
    Airline: str
    Source: str
    Destination: str
    Duration_minutes: int
    stops_num: int
    Dep_Hour: int
    Arrival_Hour: int
    Journey_Day: int
    Journey_Month: int

@app.post("/predict")
def predict_price(data: FlightInput):
    try:
        # Basic validation
        if data.Duration_minutes <= 0:
            raise HTTPException(
                status_code=400,
                detail="Duration must be greater than 0 minutes"
            )

        if data.stops_num < 0 or data.stops_num > 4:
            raise HTTPException(
                status_code=400,
                detail="Invalid number of stops"
            )

        # Build dataframe
        df = pd.DataFrame([{
            "Airline": data.Airline,
            "Source": data.Source,
            "Destination": data.Destination,
            "Duration_minutes": data.Duration_minutes,
            "stops_num": data.stops_num,
            "Dep_Hour": data.Dep_Hour,
            "Arrival_Hour": data.Arrival_Hour,
            "Journey_Day": data.Journey_Day,
            "Journey_Month": data.Journey_Month,
        }])

        pred_log = model.predict(df)[0]
        pred_price = int(np.expm1(pred_log))

        return {
            "predicted_price": pred_price
        }

    except HTTPException:
        # rethrow known validation errors
        raise

    except Exception as e:
        print("🔥 REAL PREDICTION ERROR:", repr(e))  # <-- ADD THIS
        raise HTTPException(
            status_code=500,
            detail=str(e)  # <-- TEMPORARILY expose real error
        )


