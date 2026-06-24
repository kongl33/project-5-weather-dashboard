const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const dashboard = document.getElementById("dashboard");

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

    // Step 2: use those CORDINATES to ask for the actual weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await fetch(weatherUrl); // ask the forcast API
    const weatherData = await weatherRes.json(); // turn it into a JS object

    // Hand the data off to be drawn on the screen
    renderCurrent(place.name, place.country, weatherData.current);
  } catch (error) {
    // This runs only if a fetch truly fails (no internet, server down, etc...)
    dashboard.innerHTML = `<p class="message">Something went wrong. Check your connection and try again.</p>`;
    console.error(error); // log the real error for us to read in the console
  }
}

// Build the HTML for the current weather and put it on the page
function renderCurrent(name, country, current) {
  // Look up the readable condition; fall back to "Unknown" if missing
  const condition = weatherCodes[current.weather_code] || "Unknown";

  // Write the whole weather block in one go using a template literal.
  // Math.round() trims long decimals (15.34 -> 15) so it reads cleanly.
  dashboard.innerHTML = `
    <section class="current">
      <h1 class="current__city">${name}, ${country}</h1>
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
