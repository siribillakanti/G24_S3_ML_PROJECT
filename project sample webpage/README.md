# Customer Purchase Prediction & Personalized Product Recommendation System

An academic machine learning web platform based on large-scale e-commerce behavioral event logs (September 2020 &ndash; February 2021). The system formulates purchase propensity as a forward-looking binary classification problem (predicting 7-day conversion after viewing an item) and uses a calibrated **HistGradientBoostingClassifier** with Platt scaling to power real-time personalized product recommendations.

---

## 1. Design System & Principles

A clean, modern, professional white-and-navy interface:
- **Main Background**: Pure White (`#FFFFFF`)
- **Secondary Surfaces**: Cool Light Grey (`#F5F7FA`)
- **Text**: Charcoal (`#202938`) and Muted Slate (`#64748B`)
- **Primary Buttons & Accents**: Navy (`#19345C`)
- **Borders**: Neutral Grey (`#E1E6ED`)
- **Aesthetics**: Generous whitespace, clear typography (`Inter` sans-serif), subtle shadows, restrained borders, responsive across mobile, tablet, and desktop. Strictly avoids generic AI template cliches, gradients, or glassmorphism.
- **Dataset Currency Integrity**: Prices are displayed strictly as numeric values without arbitrary currency symbols ($ or ₹).
- **Zero Cloud / Account Overhead**: Opens directly to the main application with no accounts, login screens, or cloud configuration requirements.

---

## 2. Core User Workflow

1. **Direct Access & Intro**
   - The application opens directly to the main interface with a clean overview explaining the 7-day conversion prediction objective.
   - Users can begin exploring recommendations immediately without any login or onboarding steps.

2. **Simple Shopping Workflow**
   - **Step 1 — Choose Product Categories**: Multiple selection buttons from actual catalog domains (`appliances`, `electronics`, `computers`, `furniture`, `auto`, etc.).
   - **Step 2 — Optional Brand or Keyword**: Enter custom brand or product line search terms (with clickable brand suggestions like Samsung, Apple, Lenovo).
   - **Step 3 — Maximum Budget**: Set a price limit with quick presets or choose "No limit".
   - **Step 4 — Result Count**: Select desired candidate pool size (5, 10, 20).
   - Click **Get Recommendations** to run live ML inference.

3. **Real Machine Learning Predictions**
   - Serves real catalog candidates scored by the trained and Platt-calibrated `HistGradientBoostingClassifier`.
   - Cards display:
     - Actual numeric Product ID (no fake images or descriptions)
     - Category code (e.g., `electronics.tablet`, `appliances.kitchen.microwave`)
     - Brand (e.g., `samsung`, `apple`, `huawei`)
     - Numeric catalog price (no artificial currency signs)
     - Calibrated purchase probability percentage
     - Mandatory explanation: *"Estimated purchase probability within 7 days."*

4. **Recent Searches (localStorage)**
   - Automatically saves each executed search query to the browser's `localStorage`.
   - Includes one-click **"Restore & Run Search"** to restore previous filters and execute fresh ML inference.

5. **Public Model Performance Evaluation**
   - Directly accessible from the main navigation header at any time.
   - Genuine held-out February 2021 test set benchmark metrics (90,212 instances):
     - **ROC-AUC**: `0.7747`
     - **PR-AUC**: `0.1701` (3.4x higher than random chance baseline of 0.0501)
     - **Accuracy**: `0.8693`
     - **Recall**: `0.3715`
     - **Precision**: `0.1772`
     - **F1 Score**: `0.2399`
     - **Brier Score**: `0.0492`
     - **Tuned Decision Threshold**: `0.705`
   - Split partitions: Training (361,941 samples), Validation (87,691 samples), Test (90,212 samples).
   - Logistic Regression vs HistGradientBoosting comparison.
   - Full 4-quadrant confusion matrix: `[[76558, 8644], [3149, 1861]]`.
   - Vector Precision-Recall and ROC diagnostic curves.
   - 33-feature engineering taxonomy table.

---

## 3. Quick Start

### Option A: Unified Launcher
```bash
./run.sh
```

### Option B: Run in Separate Terminals

**1. Start the FastAPI Backend:**
```bash
source .venv/bin/activate
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**2. Start the Vite Frontend:**
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser at **http://127.0.0.1:5173**.
