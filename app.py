from flask import Flask, render_template, request, jsonify
import requests
import os
import time
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Config: set your API key as environment variable EXRATE_API_KEY
# e.g. export EXRATE_API_KEY="your_key_here"
API_KEY = os.getenv("EXRATE_API_KEY", "").strip()
# Example url format:
# https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD

# Simple in-memory cache to reduce API calls { base_currency: (timestamp, rates_dict) }
CACHE = {}
CACHE_TTL = 60 * 5  # cache for 5 minutes


def get_rates(base="USD"):
    """Return dict of rates for base currency, using cache when possible."""
    now = time.time()
    cached = CACHE.get(base)
    if cached and now - cached[0] < CACHE_TTL:
        return cached[1]

    if not API_KEY:
        return {"error": "No API key configured. Set EXRATE_API_KEY environment variable."}

    url = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{base}"
    try:
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if data.get("result") != "success":
            return {"error": "API returned non-success", "details": data}
        rates = data.get("conversion_rates", {})
        CACHE[base] = (now, rates)
        return rates
    except Exception as e:
        return {"error": "fetch_failed", "details": str(e)}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/convert-currency", methods=["GET"])
def convert_currency():
    """
    Query params:
      from - source currency (e.g. USD)
      to   - target currency (e.g. INR)
      amount - numeric
    """
    from_cur = request.args.get("from", type=str, default="USD").upper()
    to_cur = request.args.get("to", type=str, default="INR").upper()
    amount = request.args.get("amount", type=float, default=1.0)

    rates = get_rates(base=from_cur)
    if isinstance(rates, dict) and rates.get("error"):
        return jsonify({"success": False, "error": rates}), 500

    if to_cur not in rates:
        return jsonify({"success": False, "error": f"currency '{to_cur}' not found"}), 400

    rate = rates[to_cur]
    converted = amount * rate
    return jsonify({
        "success": True,
        "from": from_cur,
        "to": to_cur,
        "amount": amount,
        "rate": rate,
        "converted": converted
    })


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

