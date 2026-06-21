# Crop Recommendation System - Setup Guide

## Features Implemented

✅ **Location-based Crop Recommendations**
✅ **Weather Data Integration** (Temperature, Humidity, Rainfall)  
✅ **Soil Quality Analysis** (Nitrogen, Phosphorus, Potassium, pH)
✅ **Machine Learning Model Integration** (CSV Dataset)
✅ **Multi-language Voice Input** with Auto-translation
✅ **Real-time Search** for Crops and Diseases
✅ **Match Score Calculation** (0-100%)

---

## Step 1: Prepare Your Dataset

1. **Download the CSV file** from your GitHub repository
2. **Place it in the project root** folder: `c:\Users\manas\cropai\Crop_recommendation.csv`

The CSV should have these columns:
- `N` - Nitrogen level
- `P` - Phosphorus level  
- `K` - Potassium level
- `temperature` - Required temperature
- `humidity` - Required humidity
- `ph` - pH level required
- `rainfall` - Required rainfall
- `label` - Crop name

---

## Step 2: Run the Backend Server

**Terminal 1 - Start Backend:**
```bash
cd c:\Users\manas\cropai
npm run server
```

Output should show:
```
Backend server running on http://localhost:5000
Loaded XXXX crop records from CSV
```

---

## Step 3: Run the Frontend

**Terminal 2 - Start Frontend:**
```bash
cd c:\Users\manas\cropai
npm run dev
```

Your app will be available at `http://localhost:5173` (or shown in terminal)

---

## How It Works

### Crop Recommendation Flow:
1. **User selects location** from dropdown
2. **System fetches weather data** for that location
3. **System fetches soil quality** (N, P, K, pH) for that location
4. **Dataset is searched** for matching crops
5. **Match score calculated** based on similarity (0-100%)
6. **Top 5 crops displayed** with requirements

### Match Score Formula:
```
Score = 100 - (
  N_difference × 0.15 +
  P_difference × 0.10 +
  K_difference × 0.10 +
  Temperature_difference × 0.15 +
  Humidity_difference × 0.10 +
  pH_difference × 0.15 +
  Rainfall_difference × 0.25
) × 2
```

---

## API Endpoints

### 1. Get Crop Recommendations
```
POST /api/recommend-crop

Body:
{
  "location": "Hyderabad",
  "nitrogen": 180,
  "phosphorus": 45,
  "potassium": 185,
  "ph": 6.8
}

Response:
{
  "location": "Hyderabad",
  "weather": {
    "temperature": 28,
    "humidity": 65,
    "rainfall": 750,
    "season": "Monsoon"
  },
  "soil": {
    "nitrogen": 180,
    "phosphorus": 45,
    "potassium": 185,
    "ph": 6.8
  },
  "recommendations": [
    {
      "crop": "Rice",
      "matchScore": 92.5,
      "requirements": { ... }
    }
  ]
}
```

### 2. Search Crops
```
POST /api/search

Body:
{
  "query": "wheat",
  "location": "Hyderabad"
}
```

### 3. Get All Crops
```
GET /api/crops
```

---

## Customization

### Add/Edit Locations with Weather & Soil Data

Edit `server.js` and update these functions:

```javascript
const getWeatherByLocation = (location) => {
  const weatherData = {
    "Your Location": {
      temperature: 28,
      humidity: 65,
      rainfall: 750,
      season: "Monsoon"
    }
  };
  return weatherData[location] || weatherData["Hyderabad"];
};

const getSoilQualityByLocation = (location) => {
  const soilData = {
    "Your Location": {
      nitrogen: 180,
      phosphorus: 45,
      potassium: 185,
      ph: 6.8
    }
  };
  return soilData[location] || soilData["Hyderabad"];
};
```

---

## Features Guide

### 🎤 Voice Input
1. Click the floating mic button
2. Speak in any language (Hindi, Spanish, etc.)
3. Speech auto-translates to English
4. Text appears in search bar

### 🌾 Crop Recommendations
- Automatically shown when you change location
- Shows weather conditions
- Shows soil quality
- Lists top 5 recommended crops with match scores
- Click "View Requirements" to see crop specifications

### 🔍 Search
- Type crop or disease name
- Click search or press Enter
- Results shown below search bar

---

## Troubleshooting

### Backend won't start
- Check if port 5000 is free
- Verify CSV file exists: `Crop_recommendation.csv`
- Check Node.js installation: `node --version`

### CSV not loading
- Ensure CSV is in project root folder
- Verify column names match exactly (case-sensitive):
  - `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall`, `label`
- Check CSV format (should be standard UTF-8)

### CORS errors
- Backend must be running on port 5000
- Frontend must be running on port 5173
- Check `.env.local` has correct API URL

### No recommendations shown
- Verify location is in weatherData and soilData objects
- Check browser console for errors
- Ensure backend is running

---

## Environment Variables

File: `.env.local`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Next Steps

1. ✅ Place CSV file in project root
2. ✅ Start backend server
3. ✅ Start frontend
4. ✅ Test recommendation system
5. Optional: Add more locations with real weather/soil APIs
6. Optional: Connect to actual soil testing services

---

## Project Structure

```
cropai/
├── src/
│   ├── components/
│   │   ├── CropRecommendation.jsx      ← Displays recommendations
│   │   ├── FloatingMic.jsx             ← Voice input with translation
│   │   ├── SearchBar.jsx               ← Search interface
│   │   └── ...other components
│   ├── services/
│   │   └── searchService.js            ← API calls
│   ├── pages/
│   │   └── DashBoard.jsx               ← Main dashboard
│   └── styles/
│       ├── CropRecommendation.css
│       └── ...other styles
├── server.js                            ← Backend server
├── .env.local                           ← Environment variables
├── Crop_recommendation.csv              ← Your dataset (add this)
└── package.json
```

---

Enjoy your AI-powered crop recommendation system! 🌱🤖
