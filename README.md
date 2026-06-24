# Skyline — Weather Dashboard

A clean, responsive weather dashboard built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build step, no API key. Search any city for its current conditions and a 6-day forecast, or get the weather for your current location. The background theme shifts to match the weather.

<!-- Replace with a real screenshot once hosted: drop an image in the repo and update the path -->
![Skyline screenshot](screenshot.png)

🔗 **Live demo:** _add your GitHub Pages / Netlify link here_

---

## Features

- 🔍 **Search any city** by name
- 🌡️ **Current conditions** — temperature, feels-like, condition, humidity, wind
- 📅 **6-day forecast** rendered as a row of cards
- 📍 **"My location"** button using the browser's Geolocation API
- ⏳ **Loading and error states** — handles invalid cities, network failures, and denied location requests
- 🎨 **Weather-based theming** — the background fades between clear, cloudy, rain, snow, storm, and night
- 📱 **Responsive** — forecast row collapses to a sideways scroll on mobile

---

## Tech Stack

- **HTML5**
- **CSS** — custom properties (variables) for theming, flexbox layout, media queries
- **JavaScript (ES6+)** — `fetch`, `async`/`await`, the Geolocation API
- **[Open-Meteo](https://open-meteo.com)** — free weather API, no key required

**Why Open-Meteo:** it needs no API key, so this repo can be cloned and run by anyone with zero setup — no secrets to configure, nothing to hide from version control.

---

## Running It Locally

No build step or dependencies. Either:

**Option A — just open it**
Download or clone the repo and open `index.html` in your browser.

**Option B — Live Server (recommended)**
Open the folder in VS Code, install the **Live Server** extension, then right-click `index.html` → _Open with Live Server_.

```bash
git clone https://github.com/your-username/project-5-weather-dashboard.git
cd project-5-weather-dashboard
```

> Geolocation needs a secure context. Browsers make an exception for `localhost` / `127.0.0.1`, so the "My location" button works fine on Live Server.

---

## How It Works

The app makes two API calls in sequence:

1. **Geocoding** — turns a city name into coordinates (latitude/longitude).
2. **Forecast** — turns those coordinates into current weather and a daily forecast.

```
city name → geocoding → lat/lon → forecast → render
```

The "My location" button skips the geocoding step, since the browser hands back coordinates directly. Both paths funnel into a single shared display function so the fetch-and-render logic isn't duplicated.

---

## Project Structure

```
project-5-weather-dashboard/
├── index.html      # markup + structure
├── style.css       # all styling + theme variables
├── script.js       # logic: fetch, render, events, theming
├── SCOPE.md        # planning doc + feature checklist
└── README.md       # this file
```

---

## What I Learned

This project pulled together patterns from earlier work and added a few new ones:

- Chaining two dependent API calls and passing data between them
- Distinguishing a **network failure** (request broke) from an **empty result** (request worked, found nothing) — and handling each differently
- Mapping raw API codes to human-readable conditions with a lookup table
- Working with **parallel arrays** (the forecast data) vs. an array of objects
- The Geolocation API's **callback** style vs. promise-based `fetch`
- Refactoring shared logic into a single function to avoid repetition
- Driving UI theming from data using **CSS variables** and a single class swap

---

## Possible Improvements

- [ ] Toggle between °C and °F
- [ ] Remember the last searched city with `localStorage`
- [ ] Hourly forecast view
- [ ] Weather icons instead of text conditions
