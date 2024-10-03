const searchInput = document.getElementById("city");
const submitBtn = document.getElementById("submit");
const displayElement = document.getElementById("display");
displayElement.classList.add("hidden");

const handleSubmit = (e) => {
  e.preventDefault();
  const location = searchInput.value.trim();
  !location ? alert("Please enter a city name") : fetchData(location);
  searchInput.value = "";
};

const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("vi-VN", options);
};

const formatTime = (time) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(time).toLocaleTimeString("vi-VN", options);
};

const formatWeekday = (date) => {
  const options = { weekday: "long" };
  return new Date(date).toLocaleDateString("vi-VN", options);
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const createHourlyForecastHTML = (forecastData) => {
  return forecastData
    .map(({ dt_txt, weather, main, wind }) => {
      return `
        <div class="flex flex-col items-center justify-center text-white">
          <span class="font-bold">${formatTime(dt_txt)}</span>
          <img src="https://openweathermap.org/img/wn/${
            weather[0].icon
          }.png" alt="weather icon" class="w-[50px] h-[50px] object-cover" />
          <span>${main.temp}°C</span>
          <span>${(wind.speed * 3.6).toFixed(1)} km/h</span>
        </div>
      `;
    })
    .join("");
};

const createWeeklyForecastHTML = (forecastData) => {
  const map = new Map();
  forecastData.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!map.has(date)) {
      map.set(date, []);
    }
    map.get(date).push(item);
  });
  const dateArr = Array.from(map.entries());
  const dailyForecast = dateArr
    .map(([date, dayData]) => {
      const avgTemp =
        dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
      const avgWindSpeed =
        dayData.reduce((sum, item) => sum + item.wind.speed, 0) /
        dayData.length;
      const { icon } = dayData[0].weather[0];
      return {
        date,
        avgTemp: avgTemp.toFixed(1),
        avgWindSpeed: (avgWindSpeed * 3.6).toFixed(1),
        icon,
      };
    })
    .slice(0, 5);

  return dailyForecast
    .map(({ date, avgTemp, avgWindSpeed, icon }) => {
      return `
        <div class="flex flex-col items-center justify-center text-white">
          <span class="font-bold">${formatWeekday(date)}</span> 
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" class="w-[50px] h-[50px] object-cover" />
          <span>${avgTemp}°C</span> 
          <span>${avgWindSpeed} km/h</span> 
        </div>
      `;
    })
    .join("");
};

const updateDisplay = (data) => {
  const { name: cityName } = data.city;
  const { temp: temperature, humidity } = data.list[0].main;
  const { speed: windSpeed } = data.list[0].wind;
  const { description, icon } = data.list[0].weather[0];
  const date = formatDate(data.list[0].dt_txt);
  const iconURL = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const hourlyForecastHTML = createHourlyForecastHTML(data.list.slice(0, 8));
  const weeklyForecastHTML = createWeeklyForecastHTML(data.list);
  displayElement.classList.remove("hidden");
  displayElement.innerHTML = `
  <h1 class="text-center text-white text-4xl sm:text-5xl font-bold mt-10">Weather Details</h1>
  <div class="flex flex-col lg:flex-row justify-around my-10 items-center w-full">
    <div class="flex flex-col text-xl sm:text-2xl lg:text-3xl text-[#EAEAEA] gap-y-2">
      <h2 class="font-bold text-3xl sm:text-4xl text-white">${cityName} - ${date}</h2>
      <span>${capitalize(description)}</span>
      <span>Nhiệt độ: ${temperature}°C</span>
      <span>Độ ẩm: ${humidity}%</span>
      <span>Sức gió: ${(windSpeed * 3.6).toFixed(1)} km/h</span>
    </div>
    <img src="${iconURL}" alt="weather icon" class="w-[150px] sm:w-[200px] lg:w-[250px] h-[200px] sm:h-[200px] lg:h-[250px]  sm:translate-y-[-30px] lg:translate-y-[-50px] object-cover" />
  </div>
  <div class="grid bg-purple-600 w-[90%] min-w-max lg:w-[75%] max-w-full text-sm sm:text-base lg:text-lg h-[400px] min-h-max grid-cols-3 sm:grid-cols-4 gap-4 text-center rounded-lg my-5 py-5">
    ${hourlyForecastHTML}
  </div>
  <div class="grid bg-purple-600 w-[90%] min-w-max lg:w-[75%] max-w-full text-sm sm:text-base lg:text-lg h-[300px] min-h-max grid-cols-3 sm:grid-cols-5 gap-4 text-center rounded-lg my-5 pb-5">
    ${weeklyForecastHTML}
  </div>
`;
};

const fetchData = async (location) => {
  const API_KEY = "0d0f1e506f66f06b2dd7d7584871fca8";
  const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}&lang=vi`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    console.log(data);
    updateDisplay(data);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch weather data. Please try again.");
  }
};

submitBtn.addEventListener("click", handleSubmit);
