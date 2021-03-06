var searchEl = document.getElementById("search-city");
var locationEl = $(".location-engine");
var searchBtn = document.getElementById("search-button");
var searchHistory = document.createElement("ul");
searchHistory.setAttribute("class", "list-group");
var locationArr = [];
var key = cryptedKey();

// Validating the search input and performing function if not empty
var formSubmitHandler = function (event) {
  event.preventDefault();
  var location = searchEl.value;

  if (location) {
    locationArr.push(location);
    localStorage.setItem("search", JSON.stringify(locationArr));
    searchCity(location);
    renderSearchHistory();
    renderHistoryLocationInfo();

  } else {
    alert("Please enter a city, state or zipcode");
  }
}

//function call to get the current day weather based on the search input
function searchCity(location) {
  // const APIKey = "461d4e8ca0c700411cc91d0030c17356";
  var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + key;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var todayDate = moment().format("MM/DD/YYYY");
      let currentImgEl = $(".current-img");
      currentImgEl.attr("src","https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
      currentImgEl.attr("alt", data.weather[0].description);
      $(".city-name").html(data.name + " (" + todayDate + ")");
      $(".city-name").append(currentImgEl);
      var K = data.main.temp;
      var temperatureVal = ((K-273.15)*1.8)+32;
      temperatureVal = Math.round(temperatureVal * 10) / 10;
      $(".temperature").html("Temperature: " + temperatureVal + " &#176F");
      $(".wind-speed").html("Wind Speed: " + data.wind.speed + " MPH");
      $(".humidity").html("Humidity: " + data.main.humidity + " %");
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      uvIndexDetails(lat, lon);
      fiveDayForcast(location);
    });
}

//Function call to get the uv index values based on latitude and logitude
function uvIndexDetails(lat, lon) {
  var requestUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + key;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let markEl = document.createElement("mark");
      $(".uv-index").html("UV Index: ");
      markEl.textContent = data.value;
      if (data.value >= 3 && data.value <= 5) {
        //yellow = #FFFF00
        markEl.setAttribute("style", "background-color: #FFFF00");
      } else if (data.value >= 6 && data.value <= 7) {
        //orange = #FFA500
        markEl.setAttribute("style", "background-color: #FFA500");
      } else if (data.value >= 8 && data.value <= 10) {
        //red = #FF0000
        markEl.setAttribute("style", "background-color: #FF0000");
      } else {
        //violet = #EE82EE
        markEl.setAttribute("style", "background-color: #EE82EE");
      }
      $(".uv-index").append(markEl);
    });
}

//Function call to get the 5 day weather reports
function fiveDayForcast(location) {
  var requestUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + key;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const forecast = document.querySelectorAll(".forecast");
      for (var i = 0; i < forecast.length; i++) {
        forecast[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;
        const forecastDateEl = document.createElement("p");
        var date = new Date(data.list[forecastIndex].dt * 1000);
        const forecastDay = date.getDate();
        const forecastMonth = date.getMonth() + 1;
        const forecastYear = date.getFullYear();
        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecast[i].appendChild(forecastDateEl);
        const forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastWeatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
        forecast[i].appendChild(forecastWeatherEl);
        const forecastTempEl = document.createElement("p");
        var K = data.list[forecastIndex].main.temp;
        var temperatureVal = ((K-273.15)*1.8)+32;
        temperatureVal = Math.round(temperatureVal * 10) / 10;
        forecastTempEl.innerHTML = "Temp: " + temperatureVal + " &#176F";
        forecast[i].append(forecastTempEl);
        const forecastHumidityEl = document.createElement("p"); 
        forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
        forecast[i].append(forecastHumidityEl);
      }
    });
}

//Function to display the list of search history accessing it from localStorage.
function renderSearchHistory() {
  var storedInitials = JSON.parse(localStorage.getItem("search"));
  locationArr = storedInitials;

  for (var i = 0; i < locationArr.length; i++) {
    var searchHistoryList = document.createElement("li");
    searchHistoryList.setAttribute("class", "list-group-item");
    searchHistoryList.textContent = locationArr[i];
    locationEl.append(searchHistory);
  }
  searchHistory.append(searchHistoryList);
}

//Function to display the weather of the location selected from the search history.
function renderHistoryLocationInfo() {
  var li = $('.list-group').children(".list-group-item");
  for (var i = 0; i < li.length; i++) {
    li[i].addEventListener("click", function (event) {
      var loc = event.target.textContent
      searchCity(loc);
    });
  }
}

//Function to enter secret key
function cryptedKey(){
  key = prompt("Please enter the secret key");
  var bytes = CryptoJS.AES.decrypt("U2FsdGVkX1//PdVDNuJJOlKPaT1AKqn33MUelbyPIxNu+NdqYMV/uChgR+tdmGFy8NL0B1zbc1OMl1omq8Ljbg==", key.toString());
  plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

//Event listener on search icon
searchBtn.addEventListener("click", formSubmitHandler);
