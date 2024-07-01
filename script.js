
const body = document.body;
let APIkey = '9610559c4b84f3af27cfb09c27d9e9af';
let btn = document.getElementById('btn');
let input = document.getElementById('city-input');

btn.addEventListener('click', getWeather);

function getWeather() {
    let cityName = input.value.toLowerCase();
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert('City not found');
                return;
            }
            let lat = data[0].lat;
            let lon = data[0].lon;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
                .then(response => response.json())
                .then(data => {
                    let weatherDescription = data.weather[0].description;
                    let weatherIcon = data.weather[0].icon;
                    document.getElementById('temp').innerHTML = 'Temperature: ' + Math.round(data.main.temp - 273.15) + '°C';
                    document.getElementById('humidity').innerHTML = 'Humidity: ' + Math.round(data.main.humidity) + '%';
                    document.getElementById('windSpeed').innerHTML = 'Wind Speed: ' + Math.round(data.wind.speed) + ' km/h';
                    document.getElementById('weatherDescription').innerHTML = 'Weather: ' + weatherDescription;
                    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
                    document.getElementById('weatherIcon').alt = weatherDescription;
                });
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`)
                .then(response => response.json())
                .then(data => {
                    let forecastContainer = document.getElementById('forecast');
                    forecastContainer.innerHTML = '';
                    let filteredData = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));

                    filteredData.forEach(entry => {
                        let forecastDate = new Date(entry.dt_txt).toLocaleDateString();
                        let forecastTemp = Math.round(entry.main.temp - 273.15) + '°C';
                        let forecastHumidity = entry.main.humidity + '%';
                        let forecastWindSpeed = Math.round(entry.wind.speed) + ' km/h';
                        let forecastDescription = entry.weather[0].description;
                        let forecastIcon = entry.weather[0].icon;

                        forecastContainer.innerHTML += `
                            <div class="forecast-item">
                                <p>Date: ${forecastDate}</p>
                                <p>Temperature: ${forecastTemp}</p>
                                <p>Humidity: ${forecastHumidity}</p>
                                <p>Wind Speed: ${forecastWindSpeed}</p>
                                <p>Weather: ${forecastDescription}</p>
                                <img src="http://openweathermap.org/img/wn/${forecastIcon}.png" alt="${forecastDescription}">
                            </div>
                        `;
                    });
                });
        });
}
