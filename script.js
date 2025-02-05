document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    showError("Please enter a city name!");
    return;
  }

  fetchWeatherData(city);
});

function fetchWeatherData(city) {
  const apiKey = "d0023f7d13e583c0f6f34259307025d4";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  Promise.all([fetch(apiUrl), fetch(forecastUrl)])
    .then(async ([weatherRes, forecastRes]) => {
      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found!");
      }
      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      hideError(); 
      updateCurrentWeather(weatherData);
      updateForecast(forecastData);
    })
    .catch((error) => {
      showError(error.message);
    });
}


function updateCurrentWeather(data) {
  const city = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const humidity = document.querySelector(".humidity");
  const wind = document.querySelector(".wind");
  const weatherSummary = document.querySelector("#weather-summary h4");
  const summaryText = document.querySelector("#weather-summary #summary-text");
  const weatherIcon = document.querySelector(".weather-icon");

  city.textContent = data.name;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  weatherSummary.textContent = data.weather[0].main;
  summaryText.textContent = data.weather[0].description;

  const condition = data.weather[0].main.toLowerCase();

  let iconPath = "images/default.png";
  if (condition.includes("clear")) {
    iconPath = "images/sunny.png";
  } else if (condition.includes("cloud")) {
    iconPath = "images/cloudy.png";
  } else if (condition.includes("rain")) {
    iconPath = "images/rain.png";
  } else if (condition.includes("snow")) {
    iconPath = "images/snow.png";
  } else if (condition.includes("storm")) {
    iconPath = "images/storm.png";
  } else if (condition.includes("drizzle")) {
    iconPath = "images/drizzle.png";
  } else if (condition.includes("mist") || condition.includes("fog")) {
    iconPath = "images/fog.png";
  }

  weatherIcon.src = iconPath;
}
function updateForecast(data) {
  const forecastEl = document.getElementById("forecast");
  const days = data.list.filter((_, index) => index % 8 === 0).slice(0, 3);

  forecastEl.innerHTML = '<h6>3-Day Forecast</h6><div class="box-container"></div>';
  const boxContainer = forecastEl.querySelector(".box-container");

  days.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    const temp = `${Math.round(day.main.temp)}°C`;
    const condition = day.weather[0].main;
    const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const dayBox = `
      <div class="day-box">
        <img src="${icon}" alt="${condition}">
        <h4>${date}</h4>
        <p>Temp: <span class="day-temp">${temp}</span></p>
        <p>Cond: <span class="day-condition">${condition}</span></p>
      </div>
    `;
    boxContainer.innerHTML += dayBox;
  });
}
function showError(message) {
  const errorEl = document.getElementById("error-message");
  errorEl.textContent = message;
  errorEl.style.display = "block";

  // Automatically hide error after 3 seconds
  setTimeout(() => {
    errorEl.style.display = "none";
  }, 3000);
}

function hideError() {
  const errorEl = document.getElementById("error-message");
  errorEl.style.display = "none";
}