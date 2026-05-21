# 🌾 Syngenta Track 1: Adaptive Agricultural Campaign Intelligence

Production-style hackathon MVP for AI-powered agricultural marketing at scale. This is not a chatbot — the app wraps a completed LightGBM engagement model with channel intelligence, RAG agronomy retrieval, hyperlocal vernacular campaign generation, SQLite persistence, and a unified Vue application serving both farmers and marketers.

---

## 🚀 Recent Update: Unified App Merge

Both interfaces are now merged into a single frontend application without breaking existing routing or styles:

| Route | Interface | Audience |
|---|---|---|
| `/home`, `/selfie` | Farmer App | End-user (localized UI, push notifications, Grower Pride selfie tool) |
| `/dev-tool` | AI Dashboard | Syngenta marketers — campaign generation & analytics |

---

## What It Does

- Predicts farmer engagement probability using `backend/models/model_no_leakage.pkl`
- Segments farmers into **Low, Medium, High, and Very High** receptivity tiers
- Recommends WhatsApp, SMS, voice call, or fallback channels based on device, literacy, connectivity, and farmer value
- Retrieves pest, crop, weather, and low-bandwidth advisory knowledge with **LangChain + FAISS**, with an offline keyword fallback
- Generates SMS, WhatsApp, and voice-call campaign variants in **Hindi, Telugu, Tamil, Marathi, Punjabi, or English**
- Infers hyperlocal language style from state, district/block, device, literacy level, and language preference
- Persists prediction logs, campaign history, and generated advisories in **SQLite**
- **Farmer App UI** — Onboarding, Dashboard, and Messages Inbox built in Vue
- **Grower Selfie Tool** — HTML5 Canvas-based offline-capable feature for farmers to generate branded selfies for WhatsApp sharing (AI-powered brand advocacy)
- **Admin Dashboard** — Visualizes campaign performance, open rates by crop, and channel distributions

---

## Backend Setup

> Use **Python 3.11 or 3.12**. The saved LightGBM/scikit-learn artifacts were produced with the standard 3.11-era packages.

```bash
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### Optional: OpenAI generation

```bash
$env:OPENAI_API_KEY="your_key_here"
$env:OPENAI_MODEL="gpt-4o-mini"
```

### Run the API

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

API docs available at:

```
http://localhost:8000/docs
```

### Smoke test

```bash
cd backend
py -3 smoke_test.py
```

---

## Frontend Setup

The unified Vue app contains both the mobile mockup and the AI generation dashboard.

```bash
cd frontend
npm install
npm run dev
```

| URL | What it is |
|---|---|
| `http://localhost:5173` | Mobile Farmer App / Onboarding |
| `http://localhost:5173/dev-tool` | Marketer AI Dashboard (also reachable via "API Dev Tool" in the top nav) |

> Set `VITE_API_BASE_URL=http://localhost:8000` if the backend runs on a different host.

---

## Main API

### `POST /api/predict`

**Example request:**

```json
{
  "farmer_name": "Rajesh Kumar",
  "farmer": {
    "grower_id": "DEMO_001",
    "state": "Bihar",
    "district": "Purnia",
    "tehsil_block": "Kasba",
    "main_crop": "rice",
    "campaign_crop": "rice",
    "campaign_product": "Amistar Top",
    "pest_threat": "fungal disease",
    "weather_risk": "high humidity after rain",
    "device_type": "keypad_phone",
    "connectivity": "weak",
    "literacy_level": "low",
    "grower_age": 44,
    "grower_farm_size": 2.5
  }
}
```

**Response includes:**

| Field | Contents |
|---|---|
| `prediction` | Probability, segment, confidence, model metadata |
| `channel` | Recommended channel, timing, frequency, rationale |
| `vernacular` | Inferred language, regional style, complexity level, SMS/voice flags |
| `rag` | Retrieved agronomy advisory and sources |
| `content` | SMS, WhatsApp, voice script, CTA, generation mode |

---

## Architecture

```
Farmer context
  → LightGBM prediction
  → Channel recommender
  → Vernacular inference
  → RAG agronomy retrieval
  → OpenAI / local content generation
  → SQLite campaign & advisory logs
  → Vue unified frontend (Farmer UI + AI Dev Tool)
```

---

*Prepared for Syngenta IITM Hackathon 2026*
