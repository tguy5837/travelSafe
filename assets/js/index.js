var currentWeatherContainer = document.querySelector(".weather-results");

var getWeatherData = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=cbf23c1f1f5aaf3179f3e715be9b2e92";

    // make request to the url
    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (weatherData) {
                // store lat & lon in variables for uv search
                var latitude = weatherData.coord.lat;
                console.log(latitude);
                var longitude = weatherData.coord.lon;
                console.log(longitude);

                // get uv index from uv api
                getUVIndex(latitude, longitude, weatherData);
            });
        } else {
            alert("Problem getting weather data!");
        };
    });
};

var getUVIndex = function (latitude, longitude, weatherData) {
    // get lon & lat from data
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=cbf23c1f1f5aaf3179f3e715be9b2e92&amp;lat=" + latitude + "&amp;lon=" + longitude;

    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (uvData) {
                displayWeatherData(weatherData, uvData);
            });
        } else {
            alert("Problem getting UV Index!")
        };
    });

};

var displayWeatherData = function (weatherData, uvData) {
    console.log(weatherData);
    console.log(weatherData.name);
    console.log(weatherData.main.temp + " Degrees");
    console.log(weatherData.wind.speed + " MPH");
    console.log(weatherData.weather[0].icon);

    // create current weather card
    var currentWeatherEl = document.createElement("card");
    currentWeatherEl.classList = "d-flex flex-column border border-dark p-2 m-2 w-100";

    // create h element for current weather title
    var cityDateEl = document.createElement("h3")
    cityDateEl.textContent = weatherData.name + " (" + moment().format("MM/DD/YYYY") + ")";
    currentWeatherEl.appendChild(cityDateEl);

    // create p element for current temp
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + weatherData.main.temp + " Degrees";
    currentWeatherEl.appendChild(tempEl);

    // create p element for current wind speed
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + weatherData.wind.speed + " MPH";
    currentWeatherEl.appendChild(windEl);

    // create p element for current humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    // create p element for UV Index
    var uvEl = document.createElement("p");
    uvEl.textContent = "UV Index: " + uvData.value;
    currentWeatherEl.appendChild(uvEl);

    // append currentWeatherEl to parent container on screen
    currentWeatherContainer.appendChild(currentWeatherEl);

}

getWeatherData("raleigh");