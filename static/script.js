// Basic units definition and conversion functions
const UNITS = {
  length: {
    base: "meter",
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254
    }
  },
  weight: {
    base: "gram",
    units: {
      gram: 1,
      kilogram: 1000,
      milligram: 0.001,
      pound: 453.59237,
      ounce: 28.349523125
    }
  },
  temperature: {
    units: ["celsius", "fahrenheit", "kelvin"]
  },
  time: {
    base: "second",
    units: {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400
    }
  }
};

// 💰 Currency list (for dropdowns)
const CURRENCIES = [
  "USD", "EUR", "INR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SGD",
  "NZD", "KRW", "SEK", "NOK", "ZAR", "AED", "SAR", "HKD", "THB", "IDR"
];

const $ = id => document.getElementById(id);

function populateUnitSelects(category) {
  const from = $("fromUnit");
  const to = $("toUnit");
  from.innerHTML = "";
  to.innerHTML = "";

  if (category === "temperature") {
    UNITS.temperature.units.forEach(u => {
      const opt1 = document.createElement("option"); opt1.value = u; opt1.text = capitalize(u);
      const opt2 = opt1.cloneNode(true);
      from.appendChild(opt1); to.appendChild(opt2);
    });
  } else {
    const units = UNITS[category].units;
    Object.keys(units).forEach(u => {
      const opt1 = document.createElement("option"); opt1.value = u; opt1.text = capitalize(u);
      const opt2 = opt1.cloneNode(true);
      from.appendChild(opt1); to.appendChild(opt2);
    });
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// conversion functions
function convertValue(category, val, from, to) {
  if (category === "temperature") {
    return convertTemperature(val, from, to);
  } else {
    const units = UNITS[category].units;
    const baseVal = val * units[from];
    const converted = baseVal / units[to];
    return converted;
  }
}

function convertTemperature(val, from, to) {
  let c;
  if (from === "celsius") c = val;
  else if (from === "fahrenheit") c = (val - 32) * (5 / 9);
  else if (from === "kelvin") c = val - 273.15;

  let out;
  if (to === "celsius") out = c;
  else if (to === "fahrenheit") out = (c * 9 / 5) + 32;
  else if (to === "kelvin") out = c + 273.15;

  return out;
}

// main DOM logic
document.addEventListener("DOMContentLoaded", () => {
  const category = $("category");
  populateUnitSelects(category.value);

  category.addEventListener("change", () => {
    populateUnitSelects(category.value);
  });

  // 🪙 Populate currency dropdowns
  const curFrom = $("curFrom");
  const curTo = $("curTo");
  CURRENCIES.forEach(c => {
    const opt1 = document.createElement("option");
    opt1.value = c;
    opt1.text = c;
    const opt2 = opt1.cloneNode(true);
    curFrom.appendChild(opt1);
    curTo.appendChild(opt2);
  });
  curFrom.value = "USD";
  curTo.value = "INR";

  $("convertUnit").addEventListener("click", () => {
    const cat = category.value;
    const from = $("fromUnit").value;
    const to = $("toUnit").value;
    const val = parseFloat($("unitValue").value || 0);
    if (isNaN(val)) return alert("Enter a numeric value");
    const res = convertValue(cat, val, from, to);
    const formatted = Number.isFinite(res) ? (Math.round(res * 100000) / 100000) : "N/A";
    $("unitResult").innerText = `${val} ${from} = ${formatted} ${to}`;
    pushHistory({ type: "unit", category: cat, from, to, val, result: formatted, title: `${val} ${from} → ${formatted} ${to}` });
  });

  $("convertCurrency").addEventListener("click", async () => {
    const from = $("curFrom").value.trim().toUpperCase();
    const to = $("curTo").value.trim().toUpperCase();
    const amount = parseFloat($("curAmount").value || 0);
    if (!from || !to) return alert("Enter currency codes (e.g. USD, INR)");
    if (isNaN(amount)) return alert("Enter a numeric amount");

    $("curResult").innerText = "Loading...";
    try {
      const q = new URLSearchParams({ from, to, amount });
      const resp = await fetch(`/api/convert-currency?${q}`);
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        $("curResult").innerText = `Error: ${data.error ? JSON.stringify(data.error) : "unknown"}`;
        return;
      }
      const conv = Math.round(data.converted * 100000) / 100000;
      $("curResult").innerText = `${data.amount} ${data.from} = ${conv} ${data.to} (rate: ${data.rate})`;
      pushHistory({ type: "currency", from, to, val: amount, result: conv, rate: data.rate, title: `${amount} ${data.from} → ${conv} ${data.to}` });
    } catch (err) {
      $("curResult").innerText = `Fetch error: ${err.message}`;
    }
  });

  renderHistory();

  $("clearHistory").addEventListener("click", () => {
    localStorage.removeItem("uc_history");
    renderHistory();
  });

  const darkToggle = $("darkToggle");
  const saved = localStorage.getItem("uc_dark") || "false";
  if (saved === "true") document.body.classList.add("dark");
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("uc_dark", document.body.classList.contains("dark"));
  });
});

function pushHistory(item) {
  let arr = JSON.parse(localStorage.getItem("uc_history") || "[]");
  arr.unshift({ ...item, time: new Date().toISOString() });
  if (arr.length > 50) arr = arr.slice(0, 50);
  localStorage.setItem("uc_history", JSON.stringify(arr));
  renderHistory();
}

function renderHistory() {
  const container = $("historyList");
  container.innerHTML = "";
  const arr = JSON.parse(localStorage.getItem("uc_history") || "[]");
  if (!arr.length) {
    container.innerHTML = "<div class='item'>No recent conversions yet.</div>";
    return;
  }
  arr.forEach((it, i) => {
    const el = document.createElement("div");
    el.className = "item";
    const left = document.createElement("div");
    left.innerHTML = `<div>${it.title}</div><div style="font-size:12px;color:var(--muted)">${new Date(it.time).toLocaleString()}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<button onclick='replay(${i})'>Replay</button>`;
    el.appendChild(left);
    el.appendChild(right);
    container.appendChild(el);
  });
}

// 🪄 Replay Function (new)
function replay(index) {
  const arr = JSON.parse(localStorage.getItem("uc_history") || "[]");
  const it = arr[index];
  if (!it) return;

  if (it.type === "currency") {
    $("curFrom").value = it.from;
    $("curTo").value = it.to;
    $("curAmount").value = it.val;
    $("convertCurrency").click();
  } else if (it.type === "unit") {
    $("category").value = it.category;
    populateUnitSelects(it.category);
    $("fromUnit").value = it.from;
    $("toUnit").value = it.to;
    $("unitValue").value = it.val;
    $("convertUnit").click();
  }
}
