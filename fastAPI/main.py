from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained pipeline model
with open('rf_yield_model_pipeline.pkl', 'rb') as f:
    model = pickle.load(f)

# Define the expected input schema matching your training feature names
class Features(BaseModel):
    MONTH: str
    MAX_TEMP: float
    MIN_TEMP: float
    CROP: str
    RAINFALL: float
    pH: float
    N: float
    OC: float
    P: float
    Ca: float
    Mg: float
    K: float
    Na: float
    Zn: float
    Cu: float
    Mn: float
    Fe: float

@app.post("/predict")
def predict(features: Features):
    # Convert to dict and enforce column order
    input_dict = features.dict()
    
    column_order = [
        "MONTH", "MAX_TEMP", "MIN_TEMP", "CROP", "RAINFALL",
        "pH", "N", "OC", "P", "Ca", "Mg", "K", "Na", "Zn", "Cu", "Mn", "Fe"
    ]
    
    # Create DataFrame with correct column order
    input_df = pd.DataFrame([[input_dict[col] for col in column_order]], columns=column_order)

    # Make prediction
    pred = model.predict(input_df)

    return {"predicted_yield": float(pred[0])}

