# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is **Project 5** of the `Learn JS` learning path. The workspace-root
`../CLAUDE.md` covers conventions shared by all browser projects (no build step,
no dependencies, `index.html` → `style.css` in `<head>`, `script.js` at end of
`<body>`, render-from-data). `SCOPE.md` is the product spec: full feature list,
the two API endpoints with exact query params, and the 5 build phases. Read
`SCOPE.md` before implementing — this file only adds what isn't there.

## Current state

Skeleton only. `index.html` and `style.css` are in place; `script.js` is a
single `console.log` stub. Per `SCOPE.md`, phases 2–5 (search → current
weather, forecast, states + geolocation, theming) are not yet built. The DOM
hooks already exist and are the contract `script.js` must wire into:
`#search-form`, `#search-input`, `#geo-btn`, and `#dashboard` (which currently
holds a `.dashboard__empty` placeholder to replace on first render).

## Run

This is its own git repo — commit and branch inside this folder, never at the
workspace root. Open `index.html` directly, or serve with VS Code Live Server
(the workspace `.vscode/launch.json` targets `http://127.0.0.1:3000`).
Geolocation ("My location" button) requires a `localhost`/served origin to work
in most browsers — opening via `file://` may block it.

## Data flow (the core architecture)

`city name → geocoding → lat/lon → forecast → render`, two sequential
`fetch` calls (see `SCOPE.md` for the exact URLs and params):

1. **Geocoding** returns an array of matches; take the first (`count=1`). An
   empty/missing `results` array means "city not found" — an expected error
   state, not a network failure. Handle it distinctly.
2. **Forecast** uses that match's lat/lon. `timezone=auto` is required for the
   daily forecast to align to the searched location's local days.

`weather_code` is an integer (WMO code), not text — both the current `current`
block and each `daily` entry return it. Mapping codes to human-readable
conditions (and to the weather-based theme) is the project's own lookup table to
build; it does not come from the API.

## Conventions specific to this project

- CSS uses BEM-ish names already established in the markup
  (`search__input`, `dashboard__empty`, …) — match that style for new elements.
- Theming is driven by the weather code: plan to toggle a class on a root
  element (e.g. `body` / `.app`) rather than setting inline styles per element.
