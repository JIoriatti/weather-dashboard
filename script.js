const searchBarEl = document.querySelector(".search-bar");
const cityHistoryEl = document.querySelectorAll(".city");
const searchbtnEl = document.querySelector(".search-btn")






function searchResults(){
    console.log("Submit is working");
    const searchResult = searchBarEl.value.toLowerCase();
    cityHistoryEl[0].style.visibility = "initial";
    cityHistoryEl[0].textContent = searchResult.toUpperCase();
    localStorage.setItem("Search History", searchResult);
};





searchbtnEl.addEventListener("click", searchResults)
searchBarEl.addEventListener("change", searchResults);