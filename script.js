const searchBarEl = document.querySelector(".search-bar");
const cityHistoryEl = $(".city");
const searchbtnEl = document.querySelector(".search-btn")





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
//Using the setTimeout method to prevent the "preload" class from being applied to the body after a delay of 1 milisecond. This is used to stop the CSS animations from running when the page refreshes.
setTimeout(function(){
    document.body.className="preload";
},1);

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
            let response = await fetch(geoCord);
            let data = await response.json();
            return data;
        }
        async function getCord(){
            let coOrds = await fetchGeo();
            let latLong = [coOrds[0].lat, coOrds[0].lon];
            return latLong;
        }
        async function setWeatherURL(){
            let cordArray = await getCord();
            let weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cordArray[0] + "&lon=" + cordArray[1] + "&APPID=" + apiKey;
            return weatherAPI;
        }
        async function fetchWeather(){
            let weatherData = await setWeatherURL();
            let response = await fetch(weatherData);
            let data = await response.json();
            return data;
        }
        async function renderWeather(){

        }





    // fetch(geoCord)
    //     .then(function (response) {
    //     return response.json();
    //     })
    //     .then(function (data) {
    //         var latLong = [];
    //         latLong.push(data[0].lat);
    //         latLong.push(data[0].lon);
    //         console.log(latLong);
    //         return latLong;
            
    //     }
    //     )

    };
};



//Using jquery .on method instead of addeventlistener that will call searchResults() function when the user releases the "enter" key within the search bar element.
$('.search-bar').on('keyup', function(event){
    if(event.key === 'enter' || event.keyCode === 13){
        getWeatherData();
        searchResults();
        
       
    };
});
$('.search-btn').on('click', function(event){
    event.preventDefault();
    getWeatherData();
    searchResults();
    
})