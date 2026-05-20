# unit-converter
# 🚀 Smart Unit & Currency Converter
[![Flask](https://img.shields.io/badge/Flask-v3.0.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
A beautiful, full-stack, responsive web application for seamless unit and currency conversions. Featuring live currency exchange rates with an intelligent backend caching layer, a complete local transaction history with instant replay, and a gorgeous, glassmorphism-inspired adaptive Dark Mode.
---
## 🌟 Key Features
### 📐 Comprehensive Unit Converter
Perform high-precision conversions across four essential categories with instantaneous frontend computation:
*   **Length:** Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, Inches
*   **Weight:** Grams, Kilograms, Milligrams, Pounds, Ounces
*   **Temperature:** Celsius, Fahrenheit, Kelvin
*   **Time:** Seconds, Minutes, Hours, Days
### 💵 Live Currency Converter
*   **Real-time Rates:** Integrates with the reliable [ExchangeRate-API](https://www.exchangerate-api.com/).
*   **Diverse Currencies:** Supports 20 global currencies: `USD`, `EUR`, `INR`, `GBP`, `JPY`, `CAD`, `AUD`, `CHF`, `CNY`, `SGD`, `NZD`, `KRW`, `SEK`, `NOK`, `ZAR`, `AED`, `SAR`, `HKD`, `THB`, `IDR`.
*   **Smart Caching Backend:** Implements an automated server-side TTL (Time-To-Live) cache (5 minutes) to avoid redundant API hits, speed up responses, and safeguard your API rate limits.
### ⚡ Premium User Experience (UX)
*   **Glassmorphic Adaptive UI:** Implements custom CSS variables supporting a fluid and elegant system-preferred or manual Dark/Light Mode.
*   **Conversion History & Replay:** Saves up to 50 previous conversions in the browser's `localStorage`. Re-run any past calculation with a single click of the "Replay" button.
*   **Responsive Layouts:** Designed with CSS Grid and Media Queries for seamless use across desktop, tablet, and mobile screens.
---

## 🛠️ Technology Stack
*   **Frontend:** HTML5, Modern Vanilla CSS (Variables, Flexbox, Grid), JavaScript (ES6+ Fetch & LocalStorage)
*   **Backend:** Python 3.x, Flask (Microframework), Flask-CORS (Cross-Origin Resource Sharing)
*   **API Services:** ExchangeRate-API (V6)
*   **Production Server:** Gunicorn (Green Unicorn WSGI HTTP Server)
---
## 🚀 Getting Started
### 📋 Prerequisites
Make sure you have python 3.8+ installed on your system.
### 📥 1. Clone the Repository
```bash
git clone https://github.com/Madhavan20906/unit-converter.git
cd unit-converter
```
### ⚙️ 2. Set Up the Environment
Create a virtual environment and install the required Python packages:
```bash
# Windows
python -m venv venv
venv\Scripts\activate
# macOS / Linux
python3 -m venv venv
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
```
### 🔑 3. Configure API Keys
To enable real-time currency conversions, obtain a free API key from [ExchangeRate-API](https://www.exchangerate-api.com/) and configure it in your environment:
```bash
# Windows (CMD)
set EXRATE_API_KEY=your_api_key_here
# Windows (PowerShell)
$env:EXRATE_API_KEY="your_api_key_here"
# macOS / Linux
export EXRATE_API_KEY="your_api_key_here"
```
### 🏃 4. Run Locally
Launch the Flask development server:
```bash
python app.py
```
Open your browser and navigate to **`http://localhost:5000`** to view the application in action!
---
## 🔒 Environment Variables
|
 Variable 
|
 Type 
|
 Description 
|
 Required 
|
|
:---
|
:---
|
:---
|
:---
|
|
`EXRATE_API_KEY`
|
 String 
|
 API key from ExchangeRate-API 
|
 Yes (for live currency) 
|
|
`PORT`
|
 Integer 
|
 Network port for Flask backend (Default: 
`5000`
) 
|
 No 
|
---
## 🌐 Production Deployment
This project is fully structured and ready to deploy on cloud platforms like **Render**, **Heroku**, or **Railway**.
### 💜 Deploying to Render
1.  Sign up or log in to [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service with the following settings:
    *   **Runtime:** `Python`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `gunicorn app:app`
5.  In the **Environment** section, add your `EXRATE_API_KEY`.
6.  Click **Deploy Web Service**!
> [!NOTE]
> The frontend (`static/script.js`) is currently configured to connect to the deployed API at `https://unit-converter-1.onrender.com`. If you deploy your own backend, update line 134 in `static/script.js` with your custom Render URL.
---
## 🧑‍💻 Code Highlights
### Smart Backend Caching (`app.py`)
To protect against rate-limiting and maximize application responsiveness, Flask caches conversion rates in-memory:
```python
CACHE = {}
CACHE_TTL = 60 * 5  # 5 minutes in seconds
def get_rates(base="USD"):
    now = time.time()
    cached = CACHE.get(base)
    if cached and now - cached[0] < CACHE_TTL:
        return cached[1]  # Return fast from memory!
    # Otherwise, fetch new rates from the API...
```
### Dynamic History Replay (`static/script.js`)
History cards allow quick switching back to previously completed conversions:
```javascript
function replay(index) {
  const arr = JSON.parse(localStorage.getItem("uc_history") || "[]");
  const it = arr[index];
  if (!it) return;
  if (it.type === "currency") {
    $("curFrom").value = it.from;
    $("curTo").value = it.to;
    $("curAmount").value = it.val;
    $("convertCurrency").click();
  }
  // Handles unit conversion replay identically
}
```
---
## 🤝 Contributing
Contributions are always welcome! To contribute:
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
---
## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
---
<p align="center">
  Made with ❤️ by <a href="https://github.com/Madhavan20906">Madhavan</a>
</p>
