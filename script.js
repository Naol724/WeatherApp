import apiKey from "./config.js";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

searchBtn.addEventListener("click", getWeatherByCity);
locationBtn.addEventListener("click", getWeatherByLocation);

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
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod == "404") {
            alert("City not found!");
            return;
        }

        displayWeather(data);
    } catch (error) {
        alert("Error fetching weather!");
        console.error(error);
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
