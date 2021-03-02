var searchEl = $("#search-city");
// var searchEl = document.getElementByC(".search-city");
var locationEl = $(".location-engine");

var searchBtn = document.getElementsByClassName("search-button");
//var searchBtn = $("#search-button");
var locationArr = [];


var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log(searchEl.val());
  
    var location = searchEl.val();

    
  
    if (location) {
        locationArr.push(location);
        localStorage.setItem("search", JSON.stringify(locationArr));

        renderSearchHistory();
        
        searchCity(location);
  
    //   repoContainerEl.textContent = '';
    //   nameInputEl.value = '';
    } else {
      alert('Please enter a city, state or zipcode');
    }
  };

    function searchCity(location){
    const APIKey = "461d4e8ca0c700411cc91d0030c17356";
    var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + location + "&appid=" + APIKey;

    fetch(requestUrl)
    .then(function (response) {
        console.log(response);
        return response.json();
        
      })

    }

    searchBtn.addEventListener("click", formSubmitHandler);

    function renderSearchHistory(){
    var storedInitials = JSON.parse(localStorage.getItem("search"));
    locationArr = storedInitials;

    for (var i = 0; i < locationArr.length; i++){
        var searchHistory = document.createElement("ul");
        searchHistory.setAttribute("class", "list-group")
    
        var searchHistoryList = document.createElement("li");
        searchHistoryList.setAttribute("class", "list-group-item")
        searchHistoryList.textContent = locationArr[i];
        locationEl.append(searchHistory);
    }
    searchHistory.append(searchHistoryList);




    }