from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and label encoder
model = joblib.load('crop_yield_model.pkl')
encoder = joblib.load('label_encoder.pkl')

# Define request model
class PredictionInput(BaseModel):
    year: int
    production: float
    area: float
    crop: str
    mintemp: float
    maxtemp: float
    rainfall: float

@app.get("/")
def read_root():
    return {"message": "Crop Yield Prediction API is up and running!"}

@app.post("/predict")
def predict_yield(data: PredictionInput):
    try:
        # Encode crop name to numeric
        crop_encoded = encoder.transform([data.crop])[0]

        # Build the input vector in correct order
        input_features = np.array([[data.year, data.production, data.area, crop_encoded, data.mintemp, data.maxtemp, data.rainfall]])

        # Make prediction
        prediction = model.predict(input_features)[0]
        return {"predicted_yield": round(prediction, 2)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
