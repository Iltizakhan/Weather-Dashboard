// your api key
const API_KEY = "82b61518d0992262ba8a2bd0e99a3aa6";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
    fetchHourly(city);
  }
});

// Fetch current weather
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found!");
    return;
  }

  document.querySelector(".temp").textContent = `${data.main.temp}°C`;
  document.querySelector(".location").textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector(".condition").textContent = data.weather[0].main;

  document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

  renderWeeklyDummy();
}

// Fetch hourly forecast (3-hour interval)
async function fetchHourly(city) {
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== "200") return;

  const labels = data.list.slice(0, 10).map(item =>
    item.dt_txt.split(" ")[1].slice(0, 5)
  );

  const temps = data.list.slice(0, 10).map(item =>
    item.main.temp
  );

  drawHourlyChart(labels, temps);
}

// Draw Chart.js graph
let hourlyChart;

function drawHourlyChart(labels, temps) {
  const ctx = document.getElementById("hourlyChart").getContext("2d");

  if (hourlyChart) hourlyChart.destroy();

  hourlyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderWidth: 4,
        borderColor: "#4dabf7",
        backgroundColor: "rgba(77,171,247,0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }},
      scales: {
        x: {
          grid: {
            display:true,
            color:"rgba(100,190,230,0.45)",
            lineWidth:1
          },
           ticks: { color: "#fff" }
          },
        y:{
          grid: {
            display:true,
            color:"rgba(100,190,230,0.45)",
            lineWidth:1
          },
           ticks: { color: "#fff" }
        } 
      }
    }
  });
}

// Weekly dummy cards
function renderWeeklyDummy() {
  const weekly = document.getElementById("weekly-list");
  weekly.innerHTML = "";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  days.forEach((day) => {
    weekly.innerHTML += `
      <div class="weekly-item">
        <img src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png" />
        <h4>${day}</h4>
        <p>28° / 20°</p>
      </div>`;
  });
}