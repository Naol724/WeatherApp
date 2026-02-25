# 🌦️ Weather Application

This project is a modern, user-friendly Weather Application built with JavaScript that provides real-time weather information using the **OpenWeatherMap API**.

It allows users to quickly check current weather conditions either by entering a city name or by using their current geographic location.

---

## Features

- Search weather by city name
- Displays temperature, humidity, and wind speed
- Mobile responsive
- Clean and modern UI

---

## 🛠️ Setup Instructions

1. Clone or download this repository
2. Copy `config.example.js` to `config.js`:
   ```bash
   copy config.example.js config.js
   ```
3. Open `config.js` and replace `YOUR_API_KEY_HERE` with your OpenWeatherMap API key
4. Open `index.html` in your browser

### Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key from the dashboard
4. Add it to your `config.js` file

## Screenshots

### Home Screen

![Home Screen](screenshots/image.png)

### Location Weather

![addis ababa](screenshots/image1.png)

### Location Weather

![Dubai](screenshots/image2.png)

### By Using Exact Location

![harar](screenshots/image3.png)

## 🚀 What This Project Does

This application:

- 🔍 Retrieves weather data by **city name search**
- 📍 Retrieves weather data using the user’s **current location**
- 🌡️ Displays the **current temperature in Celsius**
- 🏙️ Shows the **city name**
- ☁️ Presents a clear **weather description**
- 🖼️ Displays the official **weather icon**
- ⚠️ Handles common errors such as:
  - Empty city input
  - City not found
  - Location permission denied
  - Network or API issues

---

## ⚙️ How It Works

1. The user either:
   - Enters a city name and clicks the search button
   - Or clicks the location button to use browser geolocation

2. The application sends a request to the OpenWeatherMap API.

3. The returned weather data is processed and dynamically displayed on the webpage.

4. If any issue occurs (invalid input, denied permission, or failed request), a clear alert message is shown.

---

## 🎯 Purpose of the Project

This project demonstrates:

- Integration with an external API
- Use of asynchronous JavaScript (`async/await`)
- DOM manipulation
- Event handling
- Geolocation API usage
- Basic error handling

---

## 💡 Summary

This is a real-time weather application that provides accurate and instant weather updates based on user input or current location, offering a clean and interactive user experience.
