var currentWeatherContainer = document.querySelector(".current-weather");

var getWeatherData = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=cbf23c1f1f5aaf3179f3e715be9b2e92";

    // make request to the url
    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (data) {
                displayWeatherData(cityName, data);
            });
        } else {
            alert("Problem getting weather data!");
        };
    });
};

var getUVIndex = function (latitude, longitude) {
    // get lon & lat from data
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=cbf23c1f1f5aaf3179f3e715be9b2e92&amp;lat=" + latitude + "&amp;lon=" + longitude;

    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (uvData) {
                console.log(uvData.value);
            });
        } else {
            alert("Problem getting UV Index!")
        };
    });

};

var displayWeatherData = function (cityName, data) {
    console.log(data);
    console.log(data.name);
    console.log(data.main.temp + " Degrees");
    console.log(data.wind.speed + " MPH");
    console.log(data.weather[0].icon);

    // create current weather card
    var currentWeatherEl = document.createElement("card");
    currentWeatherEl.classList = "m-2";

    // create h element for current weather title
    var cityDateEl = document.createElement("h3")
    cityDateEl.textContent = data.name + " (Add moment.js to get date here!)";
    currentWeatherEl.appendChild(cityDateEl);

    // create p element for current temp
    var tempEl = document.createElement("p");
    tempEl.textContent = data.main.temp + " Degrees";
    currentWeatherEl.appendChild(tempEl);

    // create p element for current wind speed
    var windEl = document.createElement("p");
    windEl.textContent = data.wind.speed + " MPH";
    currentWeatherEl.appendChild(windEl);

    // create p element for current humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = data.main.humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    // Get uv index from open weather uv api:
    //  a. Store lat and lon into variables to search uv api
    var latitude = data.coord.lat;
    console.log(latitude);
    var longitude = data.coord.lon;
    console.log(longitude);

    // create p element for UV Index
    var uvEl = document.createElement("p");
    // get uv index from lat & lon
    uvEl.textContent = getUVIndex(latitude, longitude);
    currentWeatherEl.appendChild(uvEl);

    // append currentWeatherEl to parent container on screen
    currentWeatherContainer.appendChild(currentWeatherEl);

}

getWeatherData("raleigh");