const searchBarEl = document.querySelector(".search-bar");
const cityHistoryEl = $(".city");
const searchbtnEl = document.querySelector(".search-btn")
const cityNameEl = $(".city-info");
const tempEl = $(".temp");
const windEl = $(".wind");
const humidityEL = $(".humidity");
const forecastHeaderEL = $(".five-day-header");
const fiveDayEl = $(".five-day");
const fiveDayDateEl = $("h3");
const invalidEl = $(".invalid");


//Using the setTimeout method to prevent the "preload" class from being applied to the body after a delay of 1 milisecond. This is used to stop the CSS animations from running when the page refreshes.
setTimeout(function(){
    document.body.className="preload";
},1);

//Declaring a function to take the User's input (value) of the search bar element and populates an epmty, previously hidden, div.
//To be called when the user clicks the search button.
//Only populates the next available div, and does not repeat text content if the user searches the same city twice.
//Capitilizes the first letter in each word inputted from the user.
function searchResults(city){
    if(searchBarEl.value == ""){
        return;
    }
    else{
        const searchResult = searchBarEl.value.toLowerCase();
        const uncapitilized = searchResult.split(" ");
        for(let x=0; x<uncapitilized.length; x++){
            uncapitilized[x] = uncapitilized[x][0].toUpperCase()+ uncapitilized[x].substr(1);
        };
        const capWords = uncapitilized.join(" ");
        
        for(let i=0; i<cityHistoryEl.length; i++){
            if(searchResult === cityHistoryEl[i].textContent.toLowerCase()){
                break;
            };
            if(cityHistoryEl[i].textContent){
                continue;
            };
            $(cityHistoryEl[i]).fadeIn();
            cityHistoryEl[i].textContent = city;
            break;
        };
        searchBarEl.value = "";
    };
};


function getWeatherData(cityName){
    const apiKey = "de73034a4588e62fa8aa08f41bebbd0c"
    cityLower = cityName.toLowerCase();
    const geoCord = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityLower + "&limit=1&appid=" + apiKey;
    if(searchBarEl.value ==""){
        return;
    }
    //Had a lot of trouble with this because I couldn't store the return value of a fetch into a variable to be used later, in this case the lat/long coordinates to be placed into the weatherAPI URL.
    //Ended up using async functions instead of .then chaining because syntactically it makes much more sense to me.
    //If we ever want to use/store/manipulate data pulled from another server do we always have to then use .then / async function chaining? Is there no way to store the final product into a global variable?
    else{
        async function fetchGeo(){
            try{
                let response = await fetch(geoCord);
                let data = await response.json();
                return data;
            }
            catch(err){
                searchBarEl.value = "";
                invalidEl.fadeIn(100);
                setInterval(function(){
                invalidEl.fadeOut(1000)
                },5000)
                
            }
            
        }
        async function getCord(){
            try{
                let coOrds = await fetchGeo();
                let latLong = [coOrds[0].lat, coOrds[0].lon];
                return latLong;
            }
            catch(err){
                searchBarEl.value = "";
                invalidEl.fadeIn(100);
                setInterval(function(){
                invalidEl.fadeOut(1000)
                },5000)
                
            }

        }
        async function setWeatherURL(){
            try{
                let cordArray = await getCord();
                let weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cordArray[0] + "&lon=" + cordArray[1] + "&APPID=" + apiKey + "&units=imperial";
                return weatherAPI;
            }
            catch(err){
                searchBarEl.value = "";
                invalidEl.fadeIn(100);
                setInterval(function(){
                invalidEl.fadeOut(1000)
                },5000)
                
            }
        }
        async function fetchWeather(){
            try{
                let weatherData = await setWeatherURL();
                let response = await fetch(weatherData);
                let data = await response.json();
                console.log(data);
                return data;
            }
            catch(err){
                searchBarEl.value = "";
                invalidEl.fadeIn(100);
                setInterval(function(){
                invalidEl.fadeOut(1000)
                },5000)
            }
        }
        async function fetchWeatherIcons(){
            let data = await fetchWeather();
            const weatherIcons =[]
            for(let i=0;i<data.list.length;i++){
            let weatherIconURL = "http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + ".png"
            let weatherIcon = await fetch(weatherIconURL)
            weatherIcons.push(weatherIcon);
        }
        return weatherIcons;
        }
        async function renderWeather(){
            let cityIcons = await fetchWeatherIcons();
            console.log(cityIcons);
            const cityNameEl = $(".city-info");
            let cityData = await fetchWeather();
            let cityName = cityData.city.name;
            let date = cityData.list[0].dt_txt;
            let dateSplit = date.split(" ");
            let weatherIcon = cityIcons[0].url;
            console.log(weatherIcon);
            let iconImage = $("img");
            iconImage[0].setAttribute("src", weatherIcon);
            console.log(iconImage[0]);
            cityNameEl.text(cityName + " (" + dateSplit[0] + ")");
            cityNameEl.fadeIn();
            let cityTemp = cityData.list[0].main.temp;
            tempEl.text("Temperature " + cityTemp + "\u00B0 F");
            tempEl.fadeIn();
            windEl.text("Wind-speed: " + cityData.list[0].wind.speed + " MPH " + "\nWind direction: " + cityData.list[0].wind.deg + "\u00B0" + "\nWind-gust: " + cityData.list[0].wind.gust + " MPH");
            windEl.fadeIn();
            let cityHumidity = cityData.list[0].main.humidity;
            humidityEL.text("Humidity: " + cityHumidity + "%");
            humidityEL.fadeIn();
            forecastHeaderEL.fadeIn();
            fiveDayEl.fadeIn();
            
            // Storage object for 5-day forecast
            let storageFiveDay = {
                name: cityName,
                date: [],
                temp: [],
                windSpeed:[], 
                windDir: [],
                windGust: [],
                humidity: [],
            };
            let dateArray = [];
            for(let b=0; b<cityData.list.length;b++){
                let indexDate = cityData.list[b].dt_txt
                let splitIndex = indexDate.split(" ");
                dateArray.push(splitIndex[0]);
            }
            console.log(dateArray);
            let lastDateOccurance = dateArray.lastIndexOf(dateSplit[0]);
            console.log(lastDateOccurance);
            $(fiveDayDateEl[0]).text(dateArray[lastDateOccurance +1]);
            for(let i=1; i<6; i++){
                if(i<5){
                    let d = cityData.list[i*8].dt_txt;
                    let dSplit = d.split(" ");
                    $(fiveDayDateEl[i]).text(dateArray[(lastDateOccurance +1)+(i*8)]);
                    $(tempEl[i]).text("Temperature " + cityData.list[(i*8)+(lastDateOccurance+1)].main.temp + "\u00B0 F");
                    $(windEl[i]).text("Wind-speed: " + cityData.list[(i*8)+(lastDateOccurance+1)].wind.speed + " MPH " + "\nWind direction: " + cityData.list[(i*8)+(lastDateOccurance+1)].wind.deg + "\u00B0" + "\nWind-gust: " + cityData.list[(i*8)+(lastDateOccurance+1)].wind.gust + " MPH")
                    $(humidityEL[i]).text("Humidity: " + cityData.list[(i*8)+(lastDateOccurance+1)].main.humidity + "%")
                    storageFiveDay.date.push(dSplit[0]);
                    storageFiveDay.temp.push(cityData.list[i*8].main.temp);
                    storageFiveDay.windSpeed.push(cityData.list[i*8].wind.speed);
                    storageFiveDay.windDir.push(cityData.list[i*8].wind.deg);
                    storageFiveDay.windGust.push(cityData.list[i*8].wind.gust);
                    storageFiveDay.humidity.push(cityData.list[i*8].main.humidity);
                    
                }
                //Was getting a bit confused on how I could start the loop at the first occurance of the next unique date, but I think I finally got it. Probably a MUCH easier way of doing this as per usual.
                if(i===5){
                    let d = cityData.list[(i*8)-1].dt_txt;
                    let dSplit = d.split(" ");
                    $(tempEl[i]).text("Temperature " + cityData.list[(i*8)-lastDateOccurance].main.temp + "\u00B0 F");
                    $(windEl[i]).text("Wind-speed: " + cityData.list[(i*8)-lastDateOccurance].wind.speed + " MPH " + "\nWind direction: " + cityData.list[(i*8)-lastDateOccurance].wind.deg + "\u00B0" + "\nWind-gust: " + cityData.list[(i*8)-lastDateOccurance].wind.gust + " MPH")
                    $(humidityEL[i]).text("Humidity: " + cityData.list[(i*8)-lastDateOccurance].main.humidity + "%")

                    storageFiveDay.date.push(dSplit[0]);
                    storageFiveDay.temp.push(cityData.list[(i*8)-1].main.temp);
                    storageFiveDay.windSpeed.push(cityData.list[(i*8)-1].wind.speed);
                    storageFiveDay.windDir.push(cityData.list[(i*8)-1].wind.deg);
                    storageFiveDay.windGust.push(cityData.list[(i*8)-1].wind.gust);
                    storageFiveDay.humidity.push(cityData.list[(i*8)-1].main.humidity);


                }
            }
            // Storage object to be stringified and set into local storage to be called upon later to re-populate the weather data of previsouly searched cities.
            let storageOneDay = {
                name: cityName,
                date: dateSplit,
                temp: cityTemp,
                windSpeed: cityData.list[0].wind.speed,
                windDir: cityData.list[0].wind.deg,
                windGust: cityData.list[0].wind.gust,
                humidity: cityHumidity
            };
            //Setting the storage objects, both single day and 5-day, to local storage using the JSON.stringify method.
            localStorage.setItem(cityName, JSON.stringify(storageOneDay));
            localStorage.setItem(cityName + " 5-day", JSON.stringify(storageFiveDay));
            searchResults(cityData.city.name);
        }
        renderWeather();
    
    };
};






//Using jquery .on method instead of addeventlistener that will call searchResults() function when the user releases the "enter" key within the search bar element.
$('.search-bar').on('keyup', function(event){
    if(event.key === 'enter' || event.keyCode === 13){
        getWeatherData(searchBarEl.value);
        
       
    };
});
$('.search-btn').on('click', function(event){
    event.preventDefault();
    getWeatherData(searchBarEl.value);
    
})

//Creating a click event on the seach history divs to re-populate the weather data container
$('.city').on('click', function (event){
    target = event.target.textContent
    let historyObj = JSON.parse(localStorage.getItem(target));
    console.log(historyObj);
    cityNameEl.text(historyObj.name + " (" + historyObj.date[0] + ")");
    tempEl.text("Temperature " + historyObj.temp + "\u00B0 F");
    windEl.text("Wind-speed: " + historyObj.windSpeed + " MPH " + "\nWind direction: " + historyObj.windDir + "\u00B0" + "\nWind-gust: " + historyObj.windGust + " MPH");
    humidityEL.text("Humidity: " + historyObj.humidity + "%");

    let historyFiveDay = JSON.parse(localStorage.getItem(target + " 5-day"));
    for(let i=1; i<6; i++){
        if(i<5){
            $(fiveDayDateEl[i-1]).text(historyFiveDay.date[i-1]);
            $(tempEl[i]).text("Temperature " + historyFiveDay.temp[i-1] + "\u00B0 F");
            $(windEl[i]).text("Wind-speed: " + historyFiveDay.windSpeed[i-1] + " MPH " + "\nWind direction: " + historyFiveDay.windDir[i-1] + "\u00B0" + "\nWind-gust: " + historyFiveDay.windGust[i-1] + " MPH")
            $(humidityEL[i]).text("Humidity: " + historyFiveDay.humidity[i-1] + "%");
            
        }
        if(i===5){
            $(fiveDayDateEl[i-1]).text(historyFiveDay.date[i-1]);
            $(tempEl[i]).text("Temperature " + historyFiveDay.temp[i-1] + "\u00B0 F");
            $(windEl[i]).text("Wind-speed: " + historyFiveDay.windSpeed[i-1] + " MPH " + "\nWind direction: " + historyFiveDay.windDir[i-1] + "\u00B0" + "\nWind-gust: " + historyFiveDay.windGust[i-1] + " MPH")
            $(humidityEL[i]).text("Humidity: " + historyFiveDay.humidity[i-1] + "%");
        }
    }

})