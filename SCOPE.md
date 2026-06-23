# Skyline — Weather Dashboard

A clean, responsive weather dashboard built with vanilla **HTML, CSS, and JavaScript**. Search any city to see its current conditions and a 5-day forecast, or pull weather for your current location. No frameworks, no build step, no API key.

---

## Goals

This is a portfolio project. Beyond "it works," it's meant to demonstrate:

- Consuming a **real external API** with proper async data flow
- Handling **loading and error states** gracefully (not just the happy path)
- Rendering UI **from data** rather than hard-coding it
- Thoughtful **UX touches** (search-on-Enter, geolocation, weather-based theming)
- Clean, readable, well-organized code

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | HTML5 |
| Styling | CSS (custom properties, flexbox/grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Data | [Open-Meteo](https://open-meteo.com) API |
| Tooling | VS Code + Live Server |

**Why Open-Meteo:** it's free and requires **no API key**. That means the repo can be cloned and run by anyone — including whoever is reviewing the portfolio — with zero setup. Most weather APIs need a secret key that can't be safely committed to GitHub.

---

## Features

### Core (v1)
- [ ] Search any city by name
- [ ] Display current weather: temperature, feels-like, condition, humidity, wind
- [ ] 5-day forecast as a row of cards
- [ ] "My location" button using browser geolocation
- [ ] Loading state while fetching
- [ ] Error handling (invalid city, network failure, denied location)

### Polish (v1)
- [ ] Weather-based theming (sunny / rainy / cloudy / night change the look)
- [ ] Responsive layout (mobile → desktop)
- [ ] Search on Enter key, not just button click

### Stretch (future)
- [ ] Toggle °C / °F
- [ ] Remember last searched city (`localStorage`)
- [ ] Hourly forecast view
- [ ] Weather icons / animated backgrounds

---

## The API

Two Open-Meteo endpoints are used:

**1. Geocoding** — turns a city name into coordinates
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
```

**2. Forecast** — turns coordinates into weather
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto
```

Flow: **city name → geocoding → lat/lon → forecast → render**.

---

## File Structure

```
project-5-weather-dashboard/
├── index.html      # markup + structure
├── style.css       # all styling
├── script.js       # all logic (fetch, render, events)
└── SCOPE.md        # this file
```

---

## Build Phases

1. **Skeleton** — HTML structure (search bar, empty dashboard container) + base CSS. Confirm it renders.
2. **Search → current weather** — wire the form, call geocoding + forecast, display current conditions.
3. **5-day forecast** — store the daily data in an array, render forecast cards from it.
4. **States + geolocation** — loading spinner, error messages, "My location" button.
5. **Styling + theming** — full portfolio-grade CSS, weather-based look.

---

## Concepts Practiced

Building directly on earlier projects:

- `fetch()`, `async`/`await`, `try`/`catch` — *(from the Quote Generator)*
- Render-from-data pattern: mutate data, redraw the UI — *(from the To-Do List)*
- `createElement` / `appendChild` for forecast cards — *(from the To-Do List)*
- Event listeners and `preventDefault()` on a form *(new)*
- The Geolocation API *(new)*
- Mapping API response codes to human-readable conditions *(new)*
