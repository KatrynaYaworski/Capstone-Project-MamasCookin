const menuItemsContainer = document.querySelector(".menu-items-container");

const proteinButton = document.querySelector("#protein-plus-button");
const ketoButton = document.querySelector("#keto-button");
const mostPopularButton = document.querySelector("#most-popular-button");
const calorieSmartButton = document.querySelector("#calorie-smart-button");
const carbSmartButton = document.querySelector("#carb-smart-button");
const clearFilter = document.querySelector('#clear-filter');

const allFilterButtons = document.querySelectorAll(".filter-button");

const getMenuItems = (preferenceQuery = "") => {
  axios
    .get(`http://localhost:4004/menu_items${preferenceQuery}`)
    .then(displayMenu)
    .catch((e) => console.log(`Error with getting the menu items`, e));
};

function displayMenu(res) {
  let menu = res.data;
  menuItemsContainer.innerHTML = "";
  menu.forEach((meal) => {
    const preferencesContainer = document.createElement("div");
    preferencesContainer.className = "preference-container";
    const calorieSmart = document.createElement("span");
    calorieSmart.className = "preferences";
    calorieSmart.id = "calorie-smart";
    const proteinPlus = document.createElement("span");
    proteinPlus.className = "preferences";
    proteinPlus.id = "protein-plus";
    const keto = document.createElement("span");
    keto.className = "preferences";
    keto.id = "keto";
    const carbSmart = document.createElement("span");
    carbSmart.className = "preferences";
    carbSmart.id = "carb-smart";
    const populars = document.createElement("span");
    populars.className = "preferences";
    populars.id = "populars";
    const mealTitle = document.createElement("h6");
    const mealButton = document.createElement("button");
    mealButton.className = "meal-buttons";
    const menuImage = document.createElement("img");
    menuImage.className = "menu-image";
    menuImage.setAttribute("src", meal.image_url);
    mealButton.appendChild(menuImage);
    menuItemsContainer.appendChild(mealButton);
    mealTitle.textContent = meal.name;
    mealTitle.className = "meal-title";
    mealButton.appendChild(mealTitle);

    if (meal.carbohydrates < 30 && meal.fat > 30 && meal.protein < 44) {
      preferencesContainer.appendChild(keto);
      keto.textContent = "Keto";
    }
    if (meal.calories < 500) {
      preferencesContainer.appendChild(calorieSmart);
      calorieSmart.textContent = "Calorie Smart";
    }
    if (meal.protein > 40) {
      preferencesContainer.appendChild(proteinPlus);
      proteinPlus.textContent = "Protein Plus";
    }
    if (meal.carbohydrates < 20) {
      preferencesContainer.appendChild(carbSmart);
      carbSmart.textContent = "Carb Smart";
    }
    if (preferencesContainer.childElementCount === 0) {
      preferencesContainer.appendChild(populars);
      populars.textContent = "Most Popular";
    }
    mealButton.appendChild(preferencesContainer);
  });
}

proteinButton.onclick = (e) => {
  changeFilterButtons(e);
  getMenuItems("?preference=protein");
};
ketoButton.onclick = (e) => {
  changeFilterButtons(e);
  getMenuItems("?preference=keto");
};
mostPopularButton.onclick = (e) => {
  changeFilterButtons(e);
  getMenuItems("?preference=popular");
};
calorieSmartButton.onclick = (e) => {
  changeFilterButtons(e);
  getMenuItems("?preference=calorie");
};
carbSmartButton.onclick = (e) => {
  changeFilterButtons(e);
  getMenuItems("?preference=carb");
};
clearFilter.onclick = () => {
    changeFilterButtons();
  getMenuItems();
}

function changeFilterButtons(e) {
    console.log(allFilterButtons)
  allFilterButtons.forEach((button) => {
    button.classList.remove("filter-button-white");
  });
  if(e){
  e.target.classList.add("filter-button-white");
  }
}

//Preference rules
// calories < 500 = calorie smart
// Protein > 30 = Protein plus
// Keto Where carbohydrates < 30 AND fat > 30 and protein < 44

getMenuItems();
