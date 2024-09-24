const API_KEY = "f1d01d334e935bce7cb7c7be30392a94";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const cityWeather = document.getElementById("cityWeather");
const noCityFound = document.getElementById("noCityFound");

searchButton.addEventListener("click", updateWeatherData);
searchInput.addEventListener('keydown', (event) => event.key === "Enter" && updateWeatherData());

async function updateWeatherData() {
    try {
        if (!searchInput.value.trim()) {
            alert("Please enter the city");
            return;
        }
        const weatherData = await getWeatherData(searchInput.value);
        noCityFound.classList.remove("show");
        cityWeather.classList.add("show");
        city.textContent = weatherData.city;
        temperature.textContent = weatherData.temperature + "°C";
        wind.textContent = weatherData.wind + "km/h";
        humidity.textContent = weatherData.humidity + "%";
        icon.src = weatherData.icon;
    } catch (error) {
        if (error?.code === "404") {
            cityWeather.classList.remove("show");
            noCityFound.classList.add("show");
            console.error(error.message);
        } else {
            alert("Unknown error: " + error);
        }
    }
}

function getIconUrl(weatherDescription) {
    const iconMap = {
        'Clear': 'aset/clear.png',
        'Clouds': 'aset/clouds.png',
        'Rain': 'aset/drizzle.png',
        'Snow': 'aset/snow.png',
        'Thunderstorm': 'aset/rain.png',
        'Mist': 'aset/mist.png',
        
    };
    return iconMap[weatherDescription] || 'aset/clear.png'; 
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const apiResponse = await fetch(apiUrl);
    const apiResponseBody = await apiResponse.json();

    if (apiResponseBody.cod == "404") {
        throw { code: "404", message: "City Not Found" };
    }

    return {
        city: apiResponseBody.name,
        temperature: Math.round(apiResponseBody?.main?.temp),
        humidity: apiResponseBody.main.humidity,
        wind: Math.round(apiResponseBody.wind.speed),
        icon: getIconUrl(apiResponseBody.weather[0].main), 
    };
}
