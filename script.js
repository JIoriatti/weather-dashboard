const searchBarEl = document.querySelector(".search-bar");
const cityHistoryEl = $(".city");
const searchbtnEl = document.querySelector(".search-btn")





//Declaring a function to take the User's input (value) of the search bar element and populates an epmty, previously hidden, div.
//To be called when the user clicks the search button.
//Only populates the next available div, and does not repeat text content if the user searches the same city twice.
//Capitilizes the first letter in each word inputted from the user.
function searchResults(){
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
//Using the setTimeout method to prevent the "preload" class from being applied to the body after a delay of 500 miliseconds. This is used to stop the CSS animations from running when the page refreshes.
setTimeout(function(){
    document.body.className="preload";
},500);

function getWeatherData(){

};




//Using jquery .on method instead of addeventlistener that will call searchResults() function when the user releases the "enter" key within the search bar element.
$('.search-bar').on('keyup', function(event){
    if(event.key === 'enter' || event.keyCode === 13){
        searchResults();
    };
});
searchbtnEl.addEventListener("click", searchResults);