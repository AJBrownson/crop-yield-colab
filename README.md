## 🌾 Crop Yield Prediction App using Random Forest Algorithm

This is a full-stack application for predicting crop yields using machine learning. The backend is built with FastAPI and the frontend with React (Vite).

---

## 🧠 Features

- Predict crop yield based on year, production, area, crop type, temperature, and rainfall.
- REST API using FastAPI.
- ML model and label encoder loaded using `joblib`.
- CORS enabled to connect with frontend.
- Modern React frontend to send inputs and display predictions.

---

## 🗂 Project Structure

```bash

crop-yield-colab/
├── fastapi/                  # FastAPI backend
│   ├── main.py               # API code
│   ├── crop\_yield\_model.pkl  # Trained ML model
│   ├── label\_encoder.pkl     # Label encoder for crop names
│   └── requirements.txt
└── client/                 # React frontend (Vite)
├── src/
│   ├── App.jsx
│   ├── components
│   ├── pages
│   └── ...
├── index.html
└── package.json

```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Python 3.9+
- Node.js (v16 or newer)
- pip

---

## ⚙️ Backend Setup (FastAPI)

### 1. Navigate to the backend (FastAPI) folder

```bash
cd fastapi
```

### 2. Create a virtual environment

```bash
# On Windows Git Bash:

py -m venv env
source env\Scripts\activate
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn scikit-learn joblib numpy pydantic
```

Or install from `requirements.txt` if provided:

```bash
pip install -r requirements.txt
```

### 4. Ensure the model and encoder files are present

* `crop_yield_model.pkl`
* `label_encoder.pkl`

> Place these files in the `backend/` directory.

### 5. Start the FastAPI server

```bash
uvicorn main:app --reload
```

The API will run at `http://localhost:8000`.

---

## 🖥 Frontend Setup (React + Vite)

### 1. Navigate to the frontend (Client) folder

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔄 Connecting Frontend & Backend

Ensure that the backend CORS settings in `main.py` include your frontend origin:

```python
allow_origins=["http://localhost:5173"]
```

The frontend should send POST requests to:

```http
POST http://localhost:8000/predict
```

---

## 📬 Sample API Request

```json
{
  "year": 2023,
  "production": 1200,
  "area": 400,
  "crop": "Wheat",
  "mintemp": 22.4,
  "maxtemp": 33.1,
  "rainfall": 540.5
}
```

---

## 📦 Build for Production

### Frontend

```bash
npm run build
```