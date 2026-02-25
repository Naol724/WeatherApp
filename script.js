// API key will be loaded from load-env.js
// For deployment, set OPENWEATHER_API_KEY in your hosting environment variables

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");

let debounceTimer;
let selectedIndex = -1;

// Popular cities for suggestions
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
    { name: "Nairobi", country: "KE" },
    { name: "Harar", country: "ET" },
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

searchBtn.addEventListener("click", getWeatherByCity);
locationBtn.addEventListener("click", getWeatherByLocation);

// City input with autocomplete
cityInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    const value = e.target.value.trim();
    
    if (value.length < 2) {
        hideSuggestions();
        return;
    }

    debounceTimer = setTimeout(() => {
        showSuggestions(value);
    }, 300);
});

// Keyboard navigation
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

// Close suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!cityInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        hideSuggestions();
    }
});

function showSuggestions(query) {
    const filtered = popularCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    if (filtered.length === 0) {
        hideSuggestions();
        return;
    }

    suggestionsBox.innerHTML = filtered.map(city => `
        <div class="suggestion-item" data-city="${city.name}">
            <div class="font-medium text-gray-800">${city.name}</div>
            <div class="text-xs text-gray-500">${getCountryName(city.country)}</div>
        </div>
    `).join("");

    suggestionsBox.classList.remove("hidden");
    selectedIndex = -1;

    // Add click handlers
    suggestionsBox.querySelectorAll(".suggestion-item").forEach(item => {
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
        if (index === selectedIndex) {
            item.classList.add("active");
            item.scrollIntoView({ block: "nearest" });
        } else {
            item.classList.remove("active");
        }
    });
}

function getCountryName(code) {
    const countries = {
        "GB": "United Kingdom", "US": "United States", "JP": "Japan",
        "FR": "France", "AE": "United Arab Emirates", "SG": "Singapore",
        "AU": "Australia", "IN": "India", "DE": "Germany", "CA": "Canada",
        "HK": "Hong Kong", "ES": "Spain", "IT": "Italy", "NL": "Netherlands",
        "TR": "Turkey", "TH": "Thailand", "KR": "South Korea", "RU": "Russia",
        "EG": "Egypt", "MX": "Mexico", "BR": "Brazil", "AR": "Argentina",
        "NG": "Nigeria", "ZA": "South Africa", "ET": "Ethiopia", "KE": "Kenya",
        "CN": "China", "PK": "Pakistan", "BD": "Bangladesh", "PH": "Philippines",
        "ID": "Indonesia", "MY": "Malaysia", "SA": "Saudi Arabia", "IL": "Israel",
        "GR": "Greece", "AT": "Austria", "CZ": "Czech Republic", "PL": "Poland",
        "SE": "Sweden", "DK": "Denmark", "NO": "Norway", "FI": "Finland",
        "PT": "Portugal"
    };
    return countries[code] || code;
}

// Search weather by city
function getWeatherByCity() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Enter a city name!");
        return;
    }
    fetchWeather(`q=${city}`);
}

// Get weather by current location
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(`lat=${lat}&lon=${lon}`);
            },
            () => alert("Location access denied!")
        );
    } else {
        alert("Your browser does not support location!");
    }
}

// Fetch weather from OpenWeatherMap
async function fetchWeather(query) {
    // Try to get API key from window (load-env.js) or environment variable
    const apiKey = window.OPENWEATHER_API_KEY || "";
    
    if (!apiKey) {
        alert("API key not configured! Please check setup instructions.");
        console.error("API key missing. For local: create load-env.js. For deployment: set environment variable.");
        return;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod == "404") {
            alert("City not found!");
            return;
        }

        if (data.cod == "401") {
            alert("Invalid API key! Please check your configuration.");
            return;
        }

        displayWeather(data);
    } catch (error) {
        alert("Error fetching weather!");
        console.error("Fetch error:", error);
    }
}

// Display weather info
function displayWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = `${data.main.temp}°C`;
    document.getElementById("description").textContent = data.weather[0].description;

    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("weatherBox").classList.remove("hidden");
}
