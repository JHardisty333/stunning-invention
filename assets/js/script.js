var cities = [];
var searchButton = document.getElementById("submit");

var apiKey = "49bc3a88d18916362c6dc4d44e861c92";

// getting the data on the page
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);

    var cityName = $(".list-group");
    console.log(cityName);
    cityName.append("<li>" + city + "</li>");
}

var inputCount = 0;

searchButton.addEventListener("click", function () {
    console.log("click")
    var searchInput = $(".searchInput").val();
    console.log(searchInput);


    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&units=imperial" + "&appid=" + apiKey;

    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&units=imperial" + "&appid=" + apiKey;

    if (searchInput === "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            cities.push(searchInput);
            localStorage.setItem('cities', JSON.stringify(cities));
            console.log(response);
            $('.currentWeather').empty();
            
            var cityName = $(".list-group").addClass("list-group-item");
            cityName.append("<li>" + response.name + "</li>");

            inputCount = inputCount + 1;
            
            var currentCity = $(".currentCity").append("<div>").addClass("card-body");
            currentCity.empty();
            var currentName = currentCity.append("<p>");
           
            currentCity.append(currentName);

            // Date info
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // current temp
            var currentTemp = currentName.append("<p>");
            
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // // Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // UV Index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {

                var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentTemp.append(currentUV);
            });
        });

        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class='fiveDayColor card mr-2'>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");

            })

        });
    }

});