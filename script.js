// Weather App — live conditions, details, forecast, units

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const splash = document.getElementById("splash");
const fetchLoader = document.getElementById("fetchLoader");
const weatherPanel = document.getElementById("weatherPanel");
const emptyState = document.getElementById("emptyState");
const toastEl = document.getElementById("toast");
const unitCBtn = document.getElementById("unitC");
const unitFBtn = document.getElementById("unitF");

let debounceTimer;
let selectedIndex = -1;
let units = "metric"; // metric (°C) | imperial (°F)
let lastWeatherData = null;
let lastForecastList = null;
let lastQuery = null; // reusable weather query (coords preferred)
let lastPlaceLabel = null; // accurate reverse-geocoded place name
let lastGps = null; // { lat, lon } when weather came from GPS
let toastTimer;

const popularCities = [
    { name: "London", country: "GB" },
    { name: "New York", country: "US" },
    { name: "Tokyo", country: "JP" },
    { name: "Paris", country: "FR" },
    { name: "Dubai", country: "AE" },
    { name: "Singapore", country: "SG" },
    { name: "Sydney", country: "AU" },
    { name: "Mumbai", country: "IN" },
    { name: "Berlin", country: "DE" },
    { name: "Toronto", country: "CA" },
    { name: "Los Angeles", country: "US" },
    { name: "Chicago", country: "US" },
    { name: "Hong Kong", country: "HK" },
    { name: "Barcelona", country: "ES" },
    { name: "Rome", country: "IT" },
    { name: "Amsterdam", country: "NL" },
    { name: "Istanbul", country: "TR" },
    { name: "Bangkok", country: "TH" },
    { name: "Seoul", country: "KR" },
    { name: "Moscow", country: "RU" },
    { name: "Cairo", country: "EG" },
    { name: "Mexico City", country: "MX" },
    { name: "São Paulo", country: "BR" },
    { name: "Buenos Aires", country: "AR" },
    { name: "Lagos", country: "NG" },
    { name: "Johannesburg", country: "ZA" },
    { name: "Addis Ababa", country: "ET" },
    { name: "Harar", country: "ET" },
    { name: "Woliso", country: "ET" },
    { name: "Jimma", country: "ET" },
    { name: "Tulu Bolo", country: "ET" },
    { name: "Adama", country: "ET" },
    { name: "Bahir Dar", country: "ET" },
    { name: "Gondar", country: "ET" },
    { name: "Mekelle", country: "ET" },
    { name: "Dire Dawa", country: "ET" },
    { name: "Hawassa", country: "ET" },
    { name: "Nairobi", country: "KE" },
    { name: "Beijing", country: "CN" },
    { name: "Shanghai", country: "CN" },
    { name: "Delhi", country: "IN" },
    { name: "Bangalore", country: "IN" },
    { name: "Karachi", country: "PK" },
    { name: "Dhaka", country: "BD" },
    { name: "Manila", country: "PH" },
    { name: "Jakarta", country: "ID" },
    { name: "Kuala Lumpur", country: "MY" },
    { name: "Riyadh", country: "SA" },
    { name: "Tel Aviv", country: "IL" },
    { name: "Athens", country: "GR" },
    { name: "Vienna", country: "AT" },
    { name: "Prague", country: "CZ" },
    { name: "Warsaw", country: "PL" },
    { name: "Stockholm", country: "SE" },
    { name: "Copenhagen", country: "DK" },
    { name: "Oslo", country: "NO" },
    { name: "Helsinki", country: "FI" },
    { name: "Lisbon", country: "PT" },
    { name: "Madrid", country: "ES" }
];

// Ethiopian towns/cities used to snap GPS to the closest local weather place
// (so Harar / Woliso / Jimma / Tulu Bolo win over Addis when they are nearer)
const ethiopianCities = [
    { name: "Harar", lat: 9.3133, lon: 42.1187 },
    { name: "Woliso", lat: 8.5400, lon: 37.9700 },
    { name: "Jimma", lat: 7.6667, lon: 36.8333 },
    { name: "Tulu Bolo", lat: 8.6667, lon: 38.2167 },
    { name: "Adama", lat: 8.5400, lon: 39.2700 },
    { name: "Bishoftu", lat: 8.7522, lon: 38.9786 },
    { name: "Sebeta", lat: 8.9167, lon: 38.6167 },
    { name: "Holeta", lat: 9.0631, lon: 38.4875 },
    { name: "Ambo", lat: 8.9833, lon: 37.8500 },
    { name: "Ginchi", lat: 9.0333, lon: 38.1333 },
    { name: "Mojo", lat: 8.6111, lon: 39.1167 },
    { name: "Ziway", lat: 7.9333, lon: 38.7167 },
    { name: "Butajira", lat: 8.1200, lon: 38.3800 },
    { name: "Welkite", lat: 8.2833, lon: 37.7833 },
    { name: "Hosaena", lat: 7.5500, lon: 37.8500 },
    { name: "Sodo", lat: 6.8600, lon: 37.7600 },
    { name: "Arba Minch", lat: 6.0333, lon: 37.5500 },
    { name: "Dilla", lat: 6.4100, lon: 38.3100 },
    { name: "Yirgalem", lat: 6.7500, lon: 38.4200 },
    { name: "Hawassa", lat: 7.0500, lon: 38.4667 },
    { name: "Shashamane", lat: 7.2000, lon: 38.6000 },
    { name: "Asella", lat: 7.9500, lon: 39.1400 },
    { name: "Robe", lat: 7.1194, lon: 40.0044 },
    { name: "Goba", lat: 7.0167, lon: 39.9833 },
    { name: "Dire Dawa", lat: 9.5931, lon: 41.8661 },
    { name: "Jijiga", lat: 9.3500, lon: 42.8000 },
    { name: "Haramaya", lat: 9.4000, lon: 42.0167 },
    { name: "Chiro", lat: 9.0800, lon: 40.8700 },
    { name: "Dessie", lat: 11.1333, lon: 39.6333 },
    { name: "Kombolcha", lat: 11.0817, lon: 39.7431 },
    { name: "Woldia", lat: 11.8300, lon: 39.6000 },
    { name: "Bahir Dar", lat: 11.5742, lon: 37.3614 },
    { name: "Gondar", lat: 12.6000, lon: 37.4667 },
    { name: "Debre Tabor", lat: 11.8500, lon: 38.0167 },
    { name: "Debre Markos", lat: 10.3500, lon: 37.7333 },
    { name: "Debre Birhan", lat: 9.6833, lon: 39.5333 },
    { name: "Fiche", lat: 9.7667, lon: 38.7333 },
    { name: "Mekelle", lat: 13.4967, lon: 39.4753 },
    { name: "Adigrat", lat: 14.2770, lon: 39.4610 },
    { name: "Axum", lat: 14.1214, lon: 38.7236 },
    { name: "Shire", lat: 14.1050, lon: 38.2844 },
    { name: "Nekemte", lat: 9.0900, lon: 36.5500 },
    { name: "Gimbi", lat: 9.1700, lon: 35.7800 },
    { name: "Metu", lat: 8.3000, lon: 35.5800 },
    { name: "Agaro", lat: 7.8500, lon: 36.6500 },
    { name: "Bonga", lat: 7.2700, lon: 36.2300 },
    { name: "Bedelle", lat: 8.4560, lon: 36.3530 },
    { name: "Assosa", lat: 10.0667, lon: 34.5333 },
    { name: "Gambela", lat: 8.2500, lon: 34.5833 },
    { name: "Jinka", lat: 5.7800, lon: 36.5700 },
    { name: "Semera", lat: 11.7930, lon: 41.0080 },
    { name: "Addis Ababa", lat: 9.0300, lon: 38.7400 }
];

const countryNames = {
    GB: "United Kingdom", US: "United States", JP: "Japan",
    FR: "France", AE: "United Arab Emirates", SG: "Singapore",
    AU: "Australia", IN: "India", DE: "Germany", CA: "Canada",
    HK: "Hong Kong", ES: "Spain", IT: "Italy", NL: "Netherlands",
    TR: "Turkey", TH: "Thailand", KR: "South Korea", RU: "Russia",
    EG: "Egypt", MX: "Mexico", BR: "Brazil", AR: "Argentina",
    NG: "Nigeria", ZA: "South Africa", ET: "Ethiopia", KE: "Kenya",
    CN: "China", PK: "Pakistan", BD: "Bangladesh", PH: "Philippines",
    ID: "Indonesia", MY: "Malaysia", SA: "Saudi Arabia", IL: "Israel",
    GR: "Greece", AT: "Austria", CZ: "Czech Republic", PL: "Poland",
    SE: "Sweden", DK: "Denmark", NO: "Norway", FI: "Finland",
    PT: "Portugal"
};

searchBtn.addEventListener("click", getWeatherByCity);
locationBtn.addEventListener("click", getWeatherByLocation);
unitCBtn.addEventListener("click", () => setUnits("metric"));
unitFBtn.addEventListener("click", () => setUnits("imperial"));

cityInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const value = e.target.value.trim();
    if (value.length < 2) {
        hideSuggestions();
        return;
    }
    debounceTimer = setTimeout(() => showSuggestions(value), 300);
});

cityInput.addEventListener("keydown", (e) => {
    const items = suggestionsBox.querySelectorAll(".suggestion-item");
    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelection(items);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].click();
        } else {
            getWeatherByCity();
        }
    } else if (e.key === "Escape") {
        hideSuggestions();
    }
});

document.addEventListener("click", (e) => {
    if (!cityInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        hideSuggestions();
    }
});

window.addEventListener("load", () => {
    // Minimum splash time so the loader feels intentional
    const minSplash = 900;
    const start = performance.now();

    const finishSplash = () => {
        const elapsed = performance.now() - start;
        const wait = Math.max(0, minSplash - elapsed);
        setTimeout(() => {
            splash.classList.add("hide");
            // Auto-try location for a useful first view
            tryAutoLocation();
        }, wait);
    };

    // Wait briefly for load-env.js to attach the key
    setTimeout(finishSplash, 200);
});

function tryAutoLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
            // Permission denied / unavailable — keep empty state
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function showSuggestions(query) {
    const filtered = popularCities
        .filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);

    if (filtered.length === 0) {
        hideSuggestions();
        return;
    }

    suggestionsBox.innerHTML = filtered
        .map(
            (city) => `
        <div class="suggestion-item" data-city="${city.name}">
            <div class="font-medium text-gray-800">${city.name}</div>
            <div class="text-xs text-gray-500">${countryNames[city.country] || city.country}</div>
        </div>`
        )
        .join("");

    suggestionsBox.classList.remove("hidden");
    selectedIndex = -1;

    suggestionsBox.querySelectorAll(".suggestion-item").forEach((item) => {
        item.addEventListener("click", () => {
            cityInput.value = item.dataset.city;
            hideSuggestions();
            getWeatherByCity();
        });
    });
}

function hideSuggestions() {
    suggestionsBox.classList.add("hidden");
    selectedIndex = -1;
}

function updateSelection(items) {
    items.forEach((item, index) => {
        item.classList.toggle("active", index === selectedIndex);
        if (index === selectedIndex) item.scrollIntoView({ block: "nearest" });
    });
}

function getApiKey() {
    return window.OPENWEATHER_API_KEY || "";
}

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
}

function setFetching(isFetching) {
    fetchLoader.classList.toggle("hidden", !isFetching);
    searchBtn.disabled = isFetching;
    locationBtn.disabled = isFetching;
}

function setUnits(next) {
    if (units === next) return;
    units = next;
    unitCBtn.classList.toggle("active", units === "metric");
    unitFBtn.classList.toggle("active", units === "imperial");

    if (lastQuery) {
        fetchWeather(lastQuery, {
            placeLabel: lastPlaceLabel,
            fromGps: Boolean(lastGps),
            gps: lastGps || undefined,
            distanceKm: lastGps?.distanceKm
        });
    }
}

function getWeatherByCity() {
    const city = cityInput.value.trim();
    if (!city) {
        showToast("Enter a city name to search.");
        return;
    }
    hideSuggestions();
    lastPlaceLabel = null;
    lastGps = null;
    fetchWeather(`q=${encodeURIComponent(city)}`);
}

function getWeatherByLocation() {
    if (!navigator.geolocation) {
        showToast("Your browser does not support location.");
        return;
    }
    setFetching(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
            setFetching(false);
            const messages = {
                1: "Location access denied. Allow location in your browser, then try again.",
                2: "Location unavailable. Check GPS / network and try again.",
                3: "Location request timed out. Try again."
            };
            showToast(messages[error.code] || "Could not get your location.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

function toRadians(deg) {
    return (deg * Math.PI) / 180;
}

/** Distance between two GPS points in km */
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Snap GPS to the closest Ethiopian city (Harar, Woliso, Jimma, Tulu Bolo, …)
 * so Addis Ababa is only used when it is actually the nearest place.
 */
function findClosestEthiopianCity(lat, lon) {
    let best = null;
    for (const city of ethiopianCities) {
        const distanceKm = haversineKm(lat, lon, city.lat, city.lon);
        if (!best || distanceKm < best.distanceKm) {
            best = { ...city, distanceKm };
        }
    }
    return best;
}

async function fetchWeatherByCoords(lat, lon) {
    const apiKey = getApiKey();
    if (!apiKey) {
        setFetching(false);
        showToast("API key not configured. Check setup instructions.");
        return;
    }

    setFetching(true);

    const nearest = findClosestEthiopianCity(lat, lon);
    // If somehow far outside Ethiopia, still use the nearest listed city within 250 km
    const maxSnapKm = 250;

    if (nearest && nearest.distanceKm <= maxSnapKm) {
        const placeLabel = `${nearest.name}, ET`;
        lastPlaceLabel = placeLabel;
        lastGps = { lat: nearest.lat, lon: nearest.lon, distanceKm: nearest.distanceKm };
        await fetchWeather(`lat=${nearest.lat}&lon=${nearest.lon}`, {
            placeLabel,
            fromGps: true,
            gps: lastGps,
            distanceKm: nearest.distanceKm
        });
        return;
    }

    // Outside Ethiopia coverage — use raw coordinates
    const placeLabel = `Near ${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;
    lastPlaceLabel = placeLabel;
    lastGps = { lat, lon };
    await fetchWeather(`lat=${lat}&lon=${lon}`, {
        placeLabel,
        fromGps: true,
        gps: { lat, lon }
    });
}

async function fetchWeather(query, options = {}) {
    const apiKey = getApiKey();
    if (!apiKey) {
        showToast("API key not configured. Check setup instructions.");
        console.error("API key missing.");
        return;
    }

    setFetching(true);
    lastQuery = query;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${units}`;

    try {
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (String(weatherData.cod) === "404") {
            showToast("City not found. Try another name.");
            return;
        }
        if (String(weatherData.cod) === "401") {
            showToast("Invalid API key. Please check your configuration.");
            return;
        }
        if (!weatherRes.ok) {
            showToast(weatherData.message || "Could not load weather.");
            return;
        }

        const placeLabel = options.placeLabel || lastPlaceLabel || null;
        if (placeLabel) lastPlaceLabel = placeLabel;

        lastWeatherData = weatherData;

        const lat = options.gps?.lat ?? weatherData.coord.lat;
        const lon = options.gps?.lon ?? weatherData.coord.lon;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        lastForecastList = forecastData.list || [];
        displayWeather(weatherData, placeLabel, options.fromGps ? {
            lat,
            lon,
            distanceKm: options.distanceKm
        } : null);
        displayForecast(lastForecastList);
        applyAtmosphere(weatherData.weather[0].main);
    } catch (error) {
        showToast("Network error fetching weather.");
        console.error("Fetch error:", error);
    } finally {
        setFetching(false);
    }
}

function formatTemp(value) {
    const n = Math.round(Number(value));
    return `${n}°${units === "metric" ? "C" : "F"}`;
}

function formatWind(speed) {
    if (units === "metric") {
        // API returns m/s for metric — show km/h for readability
        const kmh = Math.round(speed * 3.6);
        return `${kmh} km/h`;
    }
    return `${Math.round(speed)} mph`;
}

function formatVisibility(meters) {
    if (meters == null) return "—";
    if (units === "metric") {
        return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
    }
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
}

function formatSunTime(unix, timezoneOffsetSec) {
    const date = new Date((unix + timezoneOffsetSec) * 1000);
    // Use UTC methods because we already applied offset
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const h12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${h12}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

function formatLocalClock(timezoneOffsetSec) {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const local = new Date(utc + timezoneOffsetSec * 1000);
    return local.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function displayWeather(data, placeLabel, gps) {
    emptyState.classList.add("hidden");
    weatherPanel.classList.remove("hidden");

    // Restart fade animations
    weatherPanel.querySelectorAll(".fade-up").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
    });

    const unitLabel = units === "metric" ? "C" : "F";
    const fallbackName = `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;
    document.getElementById("cityName").textContent = placeLabel || fallbackName;

    const clock = formatLocalClock(data.timezone);
    let nearStation = "";
    if (gps) {
        const dist =
            typeof gps.distanceKm === "number"
                ? ` · Closest city (${gps.distanceKm < 10 ? gps.distanceKm.toFixed(1) : Math.round(gps.distanceKm)} km away)`
                : "";
        nearStation = dist;
    }
    document.getElementById("localTime").textContent = `${clock}${nearStation}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°${unitLabel}`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `Feels like ${Math.round(data.main.feels_like)}°${unitLabel}`;

    const icon = data.weather[0].icon;
    const iconEl = document.getElementById("weatherIcon");
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = data.weather[0].description;

    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = formatWind(data.wind.speed);
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
    document.getElementById("visibility").textContent = formatVisibility(data.visibility);
    document.getElementById("sunrise").textContent = formatSunTime(data.sys.sunrise, data.timezone);
    document.getElementById("sunset").textContent = formatSunTime(data.sys.sunset, data.timezone);
}

function displayForecast(list) {
    const row = document.getElementById("forecastRow");
    if (!list || !list.length) {
        row.innerHTML = `<p class="col-span-5 text-sm text-slate-500 text-center">Forecast unavailable</p>`;
        return;
    }

    // Pick one reading near midday per calendar day (local to city via dt_txt which is UTC)
    const byDay = {};
    list.forEach((item) => {
        const dayKey = item.dt_txt.slice(0, 10);
        const hour = Number(item.dt_txt.slice(11, 13));
        if (!byDay[dayKey] || Math.abs(hour - 12) < Math.abs(Number(byDay[dayKey].dt_txt.slice(11, 13)) - 12)) {
            byDay[dayKey] = item;
        }
    });

    const todayKey = new Date().toISOString().slice(0, 10);
    const days = Object.keys(byDay)
        .filter((k) => k !== todayKey)
        .slice(0, 5);

    // If filtering today leaves fewer than 5, include from start
    const keys = days.length >= 4 ? days.slice(0, 5) : Object.keys(byDay).slice(0, 5);

    const unitLabel = units === "metric" ? "C" : "F";

    row.innerHTML = keys
        .map((key) => {
            const item = byDay[key];
            const d = new Date(key + "T12:00:00");
            const label = d.toLocaleDateString(undefined, { weekday: "short" });
            const icon = item.weather[0].icon;
            const temp = Math.round(item.main.temp);
            return `
            <div class="forecast-day metric rounded-2xl p-2.5 sm:p-3 text-center">
                <p class="text-[11px] sm:text-xs font-semibold text-slate-600 mb-1">${label}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${item.weather[0].description}"
                     class="w-10 h-10 mx-auto -my-1">
                <p class="text-sm sm:text-base font-bold">${temp}°</p>
                <p class="text-[10px] text-slate-500 capitalize truncate">${item.weather[0].main}</p>
            </div>`;
        })
        .join("");
}

function applyAtmosphere(mainCondition) {
    const map = {
        Clear: "clear",
        Clouds: "clouds",
        Rain: "rain",
        Drizzle: "drizzle",
        Thunderstorm: "thunderstorm",
        Snow: "snow",
        Mist: "mist",
        Smoke: "mist",
        Haze: "haze",
        Dust: "haze",
        Fog: "fog",
        Sand: "haze",
        Ash: "mist",
        Squall: "rain",
        Tornado: "thunderstorm"
    };

    const next = map[mainCondition] || "clear";
    document.body.className = next;

    const sunGlow = document.getElementById("sunGlow");
    if (sunGlow) {
        sunGlow.style.opacity = next === "clear" ? "1" : next === "clouds" ? "0.35" : "0.15";
    }
}
