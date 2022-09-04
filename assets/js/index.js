var currentWeatherContainer = document.querySelector(".current-weather");

var forecastWeatherContainer = document.querySelector(".forecast-weather");

// target search elements
var searchBox = document.querySelector(".search-box");
var cityInput = document.querySelector("#city-input")

// target search history container
var searchHistoryContainer = document.querySelector(".search-history");


var getWeatherData = function (cityName, event) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=cbf23c1f1f5aaf3179f3e715be9b2e92";

    // make request to the url
    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (weatherData) {
                // save city name to local storage if there was no click event
                if (!event) {
                    saveSearch(weatherData.name);
                };
                // store lat & lon in variables for uv search
                var latitude = weatherData.coord.lat;
                // console.log(latitude);
                var longitude = weatherData.coord.lon;
                // console.log(longitude);

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=cbf23c1f1f5aaf3179f3e715be9b2e92&amp;lat=" + latitude + "&amp;lon=" + longitude;

    fetch(apiUrl).then(function (response) {
        // response was successful
        if (response.ok) {
            response.json().then(function (uvData) {
                console.log(uvData);
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
            cityInput.textContent = "";
        })
    })
};

var displayForecastData = function (forecastData) {
    console.log(forecastData);

    // clear old data
    forecastWeatherContainer.textContent = "";

    // loop through forecast array dates

    // set current 'add day' value for date display
    var d = 1
    for (var i = 0; i <= 32; i = i + 8) {
        var currentForecastDay = forecastData.list[i];
        console.log(currentForecastDay);

        // create card for current forecasted day
        var forecastDataEl = document.createElement("card");
        forecastDataEl.classList = "forecast-card d-block col-5 col-md-2"

        // create h element for forecast date
        var forecastTitleEl = document.createElement("h4");
        forecastTitleEl.textContent = moment().add(d, "day").format("MM/DD/YYYY");
        forecastDataEl.appendChild(forecastTitleEl);
        // add 1 to d so so that the following day is displayed next rotation
        d++;

        // create img element for forecast icon
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/w/" + currentForecastDay.weather[0].icon + ".png");
        forecastDataEl.appendChild(forecastIcon);

        // create p element for forecasted temp
        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = "Temp: " + currentForecastDay.main.temp + " ºF";
        forecastDataEl.appendChild(forecastTempEl);

        // create p element for forecast wind
        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + currentForecastDay.wind.speed + " MPH";
        forecastDataEl.appendChild(forecastWindEl);

        // create p element for forecast humidity
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + currentForecastDay.main.humidity + "%";
        forecastDataEl.appendChild(forecastHumidityEl);

        forecastWeatherContainer.appendChild(forecastDataEl);
    };
};


var loadSearches = function (cityName) {
    // make sure local storage is not empty
    if ((localStorage.getItem("searchHistory"))) {
        var storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        // console.log(storedSearchHistory);

        // clear array for reload
        searchHistoryContainer.textContent = "";

        for (var i = 0; i < storedSearchHistory.length && i < 10; i++) {
            // create button element
            var recentSearchEl = document.createElement("button");
            // give it a data-name
            recentSearchEl.setAttribute("data-name", cityName);
            // set text content to city name
            recentSearchEl.textContent = storedSearchHistory[i];
            // style button
            recentSearchEl.classList = "btn btn-secondary my-2";
            // append to search history container
            searchHistoryContainer.appendChild(recentSearchEl);
        }

    }

};



var saveSearch = function (cityName) {
    console.log(cityName);
    // create empty array for search history
    var currentSearch = [];

    // push city name to searchHistory array
    currentSearch.push(cityName);
    // console.log(currentSearch);

    if (localStorage.getItem("searchHistory")) {
        var storedSearches = JSON.parse(localStorage.getItem("searchHistory"));
        // console.log(storedSearches)
        var searchHistory = currentSearch.concat(storedSearches);
        // console.log(searchHistory);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        loadSearches(cityName);
    } else {
        localStorage.setItem("searchHistory", JSON.stringify(currentSearch));
        loadSearches(cityName);
    }
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInput.value.trim();

    if (city) {
        getWeatherData(city);
        cityInput.value = "";
    } else {
        alert("Please enter a city.")
    };
};

var buttonClickHandler = function (event) {
    event.preventDefault();
    var target = event.target;
    console.log(target.getAttribute("data-name"));
    if (target.getAttribute("data-name")) {
        getWeatherData(target.textContent, event);
    }
};

var displayWeatherData = function (weatherData, uvData, latitude, longitude) {
    // console.log(weatherData);
    // console.log(weatherData.name);
    // console.log(weatherData.main.temp + " ºF");
    // console.log(weatherData.wind.speed + " MPH");

    // clear old data
    currentWeatherContainer.textContent = "";

    // create current weather card
    var currentWeatherEl = document.createElement("card");
    currentWeatherEl.classList = "border border-dark d-flex flex-column p-2 m-2 w-100";

    // create h element for current weather title
    var cityDateEl = document.createElement("h3")
    // create img element for icon
    var currentWeatherIcon = document.createElement("img");
    currentWeatherIcon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png");
    cityDateEl.textContent = weatherData.name + " (" + moment().format("MM/DD/YYYY") + ") ";
    // append icon to h3
    cityDateEl.appendChild(currentWeatherIcon);
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

    // create div for UV items
    var uvEl = document.createElement("div");
    // set uv element as flex-row
    uvEl.classList = "d-flex flex-row"
    // create p for title
    var uvTitle = document.createElement("p");
    uvTitle.classList = "mr-1";
    // create p for uvNumber
    var uvNumber = document.createElement("p");

    // set title content
    uvTitle.textContent = "UV Index: "

    // put uv index in a variable
    var uvIndex = Math.round((uvData.value - 3) * 100) / 100;

    // set uv number
    uvNumber.textContent = uvIndex;

    // append title to uv el
    uvEl.appendChild(uvTitle);
    uvEl.appendChild(uvNumber);
    if (uvIndex < 2.5) {
        uvNumber.classList = "uv uv-low";
    } else if (uvIndex >= 2.5 && uvIndex < 5.5) {
        uvNumber.classList = "uv uv-moderate";
    } else if (uvIndex >= 5.5 && uvIndex < 7.5) {
        uvNumber.classList = "uv uv-high";
    } else if (uvIndex >= 7.5 && uvIndex < 10.5) {
        uvNumber.classList = "uv uv-very-high";
    } else if (uvIndex > 10.5) {
        uvNumber.classList = "uv uv-extreme";
    };
    currentWeatherEl.appendChild(uvEl);

    // append currentWeatherEl to parent container on screen
    currentWeatherContainer.appendChild(currentWeatherEl);

    getForecastData(latitude, longitude);
};

loadSearches("cityName");

searchBox.addEventListener("submit", formSubmitHandler);

searchHistoryContainer.addEventListener("click", buttonClickHandler);