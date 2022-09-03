var currentWeatherContainer = document.querySelector(".current-weather");

var forecastWeatherContainer = document.querySelector(".forecast-weather");

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
                getUVIndex(weatherData, latitude, longitude);
            });
        } else {
            alert("Problem getting weather data!");
        };
    });
};

var getUVIndex = function (weatherData, latitude, longitude) {
    // get lon & lat from data
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=cbf23c1f1f5aaf3179f3e715be9b2e92&amp;lat=" + latitude + "&amp;lon=" + longitude;

    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (uvData) {
                displayWeatherData(weatherData, uvData, latitude, longitude);
            });
        } else {
            alert("Problem getting UV Index!")
        };
    });

};

var getForecastData = function (latitude, longitude) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=cbf23c1f1f5aaf3179f3e715be9b2e92";
    // get forecast data from api
    fetch(apiUrl).then(function (response) {
        response.json().then(function (forecastData) {
            displayForecastData(forecastData);
        })
    })
};

var displayForecastData = function (forecastData) {
    console.log(forecastData);
    // loop through forecast array dates

    // set current 'add day' value for date display
    var d = 1
    for (var i = 4; i <= 36; i = i + 8) {
        console.log(forecastData.list[i])
        var currentForecastDay = forecastData.list[i];

        // create card for current forecasted day
        var forecastDataEl = document.createElement("card");
        forecastDataEl.classList = "forecast-card"

        // create h element for forecast date
        var forecastTitleEl = document.createElement("h4");
        forecastTitleEl.textContent = moment().add(d, "day").format("MM/DD/YYYY");
        forecastDataEl.appendChild(forecastTitleEl);
        // add 1 to d so so that the following day is displayed
        d++;

        // create p element for forecasted temp
        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = "Temp: " + currentForecastDay.main.temp;
        forecastDataEl.appendChild(forecastTempEl);

        // create p element for forecast wind
        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + currentForecastDay.wind.speed;
        forecastDataEl.appendChild(forecastWindEl);

        // create p element for forecast humidity
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + currentForecastDay.main.humidity;
        forecastDataEl.appendChild(forecastHumidityEl);

        forecastWeatherContainer.appendChild(forecastDataEl);

    };


}

var displayWeatherData = function (weatherData, uvData, latitude, longitude) {
    console.log(weatherData);
    console.log(weatherData.name);
    console.log(weatherData.main.temp + " ºF");
    console.log(weatherData.wind.speed + " MPH");
    console.log(weatherData.weather[0].icon);

    // create current weather card
    var currentWeatherEl = document.createElement("card");
    currentWeatherEl.classList = "d-flex flex-column p-2 m-2 w-100";

    // create h element for current weather title
    var cityDateEl = document.createElement("h3")
    cityDateEl.textContent = weatherData.name + " (" + moment().format("MM/DD/YYYY") + ")";
    currentWeatherEl.appendChild(cityDateEl);

    // create p element for current temp
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + weatherData.main.temp + " ºF";
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

    getForecastData(latitude, longitude);
};

getWeatherData("raleigh");