const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const dashboard = document.getElementById("dashboard");
const geoBtn = document.getElementById("geo-btn");

// Translate the API's number codes into readable text
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

// Run this whenever the search form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the page from reloading on submit
  const city = input.value.trim(); // read what was typed, remove spaces
  if (!city) return; // do nothing if the box is empty
  await getWeather(city); // fetch the weather for that city
});

// The main job: take a city name and show its weather
async function getWeather(city) {
  try {
    // Step 1: turn the city NAME into cordinates (latitude/longitude)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl); // ask the geocoding API
    const geoData = await geoRes.json(); // trun the response into a JS object

    // If there's no "results", the city name didn't match anything
    if (!geoData.results || geoData.results.length === 0) {
      dashboard.innerHTML = `<p class="message">Couldn't find "${city}". Try another search.</p>`;
      return; // stop here - nothing else to do
    }

    const place = geoData.results[0]; // grab the best (first) match
    const label = `${place.name}, ${place.country}`;

    // Step 2: hand the cordinates off to the shared display function
    await displayWeather(place.latitude, place.longitude, label);
  } catch (error) {
    // This runs only if a fetch truly fails (no internet, server down, etc...)
    dashboard.innerHTML = `<p class="message">Something went wrong. Check your connection and try again.</p>`;
    console.error(error); // log the real error for us to read in the console
  }
}

// Shared: given cordinates, fetch the forecast and draw everything
// Both the search AND the "my location" button use this.
async function displayWeather(latitude, longitude, label) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const weatherRes = await fetch(weatherUrl); // ask the forcast API
  const weatherData = await weatherRes.json(); // turn it into a JS object

  renderCurrent(label, weatherData.current);
  renderForecast(weatherData.daily);
}

// Build the HTML for the current weather and put it on the page
function renderCurrent(label, current) {
  // Look up the readable condition; fall back to "Unknown" if missing
  const condition = weatherCodes[current.weather_code] || "Unknown";

  // Write the whole weather block in one go using a template literal.
  // Math.round() trims long decimals (15.34 -> 15) so it reads cleanly.
  dashboard.innerHTML = `
    <section class="current">
      <h1 class="current__city">${label}</h1>
      <p class="current__temp">${Math.round(current.temperature_2m)}°C</p>
      <p class="current__condition">${condition}</p>
      <div class="current__details">
        <span>Feels like ${Math.round(current.apparent_temperature)}°C</span>
        <span>Humidity ${current.relative_humidity_2m}%</span>
        <span>Wind ${Math.round(current.wind_speed_10m)} km/h</span>
      </div>
    </section>
  `;
}

// Build the 6-day forecast row and put it on the page
function renderForecast(daily) {
  // Create the container that will hold all the day cards
  const section = document.createElement("section");
  section.className = "forecast";

  // Loop over the first 6 days.
  // The API gives PARALLEL arrays: daily.time[i], daily.weather_code[i],
  // daily.temperature_2m_max[i] all describe the SAME day, day number i.
  for (let i = 0; i < 6; i++) {
    // Turn "2026-06-23" into a short weekday like "Mon".
    // Splitting the date into parts avoids a timezone off-by-one bug.
    const [year, month, day] = daily.time[i].split("-");
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    // Pull this day's values out of the arrays
    const condition = weatherCodes[daily.weather_code[i]] || "Unknown";
    const high = Math.round(daily.temperature_2m_max[i]);
    const low = Math.round(daily.temperature_2m_min[i]);

    // Build one card and fill in its insides
    const card = document.createElement("div");
    card.className = "forecast__card";
    card.innerHTML = `
      <p class="forecast__day">${dayName}</p>
      <p class="forecast__condition">${condition}</p>
      <p class="forecast__temps">${high}° / ${low}°</p>
    `;

    // Add this card into the container
    section.appendChild(card);
  }

  // Add the whole finished row onto the page, below the current weather
  dashboard.appendChild(section);
}

// "My location" button: ask the browser where the user is
geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    renderMessage("Geolocation isn't supported by your browser.");
    return;
  }

  renderLoading();
  // This pops the browser's "Allow location?" prompt.
  // It takes TWO functions: one for success, one for failure.
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
});

// Runs if the user allows location and it's found
async function onGeoSuccess(position) {
  // The browser hands us a position object; pull lat/lon out of it
  const {latitude, longitude} = position.coords;
  try {
    await displayWeather(latitude, longitude, "Your location");
  } catch (error) {
    renderMessage("Something went wrong fetching your weather.");
    console.error(error);
  }
}

// Run if the user blocks location or it can't be found
function onGeoError(error) {
  renderMessage("Couldn't get your location. Allow location access or search by city.");
  console.error(error);
}

// Small helpers so every state looks consistent
function renderLoading() {
  dashboard.innerHTML = `<p class="message">Loading...</p>`;
}

function renderMessage(text) {
  dashboard.innerHTML = `<p class="message">${text}</p>`;
}