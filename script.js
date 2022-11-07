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
function searchResults(){
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
            cityHistoryEl[i].textContent = capWords;
            localStorage.setItem("City" + (i+1), cityHistoryEl[i].textContent);
            break;
        };
        searchBarEl.value = "";
    };
};


function getWeatherData(){
    const apiKey = "de73034a4588e62fa8aa08f41bebbd0c"
    const cityName = searchBarEl.value.toLowerCase();
    const geoCord = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
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
                // console.log(data);
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
        // fetchWeather();
        async function renderWeather(){
            const cityNameEl = $(".city-info");
            let cityData = await fetchWeather();
            let cityName = cityData.city.name;
            let date = cityData.list[0].dt_txt;
            let dateSplit = date.split(" ");
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
            for(let i=1; i<6; i++){
                if(i<5){
                    let d = cityData.list[i*8].dt_txt;
                    let dSplit = d.split(" ");
                    $(fiveDayDateEl[i-1]).text(dSplit[0]);
                    $(tempEl[i]).text("Temperature " + cityData.list[i*8].main.temp + "\u00B0 F");
                    $(windEl[i]).text("Wind-speed: " + cityData.list[i*8].wind.speed + " MPH " + "\nWind direction: " + cityData.list[i*8].wind.deg + "\u00B0" + "\nWind-gust: " + cityData.list[i*8].wind.gust + " MPH")
                    $(humidityEL[i]).text("Humidity: " + cityData.list[i*8].main.humidity + "%")
                }
                if(i===5){
                    let d = cityData.list[(i*8)-1].dt_txt;
                    let dSplit = d.split(" ");
                    $(fiveDayDateEl[i-1]).text(dSplit[0]);
                    $(tempEl[i]).text("Temperature " + cityData.list[(i*8)-1].main.temp + "\u00B0 F");
                    $(windEl[i]).text("Wind-speed: " + cityData.list[(i*8)-1].wind.speed + " MPH " + "\nWind direction: " + cityData.list[(i*8)-1].wind.deg + "\u00B0" + "\nWind-gust: " + cityData.list[(i*8)-1].wind.gust + " MPH")
                    $(humidityEL[i]).text("Humidity: " + cityData.list[(i*8)-1].main.humidity + "%")
                }
            }
            searchResults();
        }
        renderWeather();
    
    };
};






//Using jquery .on method instead of addeventlistener that will call searchResults() function when the user releases the "enter" key within the search bar element.
$('.search-bar').on('keyup', function(event){
    if(event.key === 'enter' || event.keyCode === 13){
        getWeatherData();
        
       
    };
});
$('.search-btn').on('click', function(event){
    event.preventDefault();
    getWeatherData();
    
})