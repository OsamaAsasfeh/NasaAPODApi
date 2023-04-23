const resultsNav = document.getElementById("resultNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const savedConfiremd = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

//NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let reslutsArray = [];
let favorites = {};
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? reslutsArray : Object.values(favorites);
  console.log("Current Array", page);
  currentArray.forEach((result) => {
    //card container
    const card = document.createElement("div");
    card.classList.add("card");
    //link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    //Imge
    const imge = document.createElement("img");
    imge.src = result.url;
    imge.alt = "Nasa Picture of The Day";
    imge.loading = "lazy";
    imge.classList.add("card-img-top");
    //Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    //Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add To Favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    //Card Text
    const CardText = document.createElement("p");
    CardText.textContent = result.explanation;
    //Footer Container
    const footer = document.createElement("Strong");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("small");
    date.textContent = result.date;
    //Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `${copyrightResult}`;

    //Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, CardText, footer);
    link.appendChild(imge);
    card.append(link, cardBody);
    imagesContainer.append(card);
    console.log(card);
  });
}
function updateDOM(page) {
  //Get Favorites from localStoreg
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    console.log("favorite for localStor", favorites);
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}
//Add result to Favorites
function saveFavorite(itemUrl) {
  //Loop through REsults Array to select Favarites
  reslutsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      console.log(JSON.stringify(favorites));
      //show Save Convfirmation for 2s
      savedConfiremd.hidden = false;
      setTimeout(() => {
        savedConfiremd.hidden = true;
      }, 2000);
      //set favorites to localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}
//Remove item from fivrate
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}
function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}
//Get 14 Imges from NASA API
async function getNasaPictures() {
  //show lodaer
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    reslutsArray = await response.json();
    updateDOM("results");
    console.log(reslutsArray);
  } catch (error) {
    alert(error);
  }
}
getNasaPictures();
