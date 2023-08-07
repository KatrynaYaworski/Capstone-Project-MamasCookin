let menuItemsQuery = ""; // to keep filters and search persistent when page loads

// Grab the container that holds the menu items
const menuItemsContainer = document.querySelector(".menu-items-container");

// grab search and filter elements
const searchForm = document.querySelector("#search-form");
const clearFilter = document.querySelector("#clear-filter");
const proteinButton = document.querySelector("#protein-plus-button");
const ketoButton = document.querySelector("#keto-button");
const mostPopularButton = document.querySelector("#most-popular-button");
const calorieSmartButton = document.querySelector("#calorie-smart-button");
const carbSmartButton = document.querySelector("#carb-smart-button");
const allFilterButtons = document.querySelectorAll(".filter-button");

//ajax request to grab menu items to include the query for search and filter.
const getMenuItems = () => {
  axios
    .get(`/menu_items${menuItemsQuery}`)
    .then(displayMenu)
    .catch((e) => console.log(`Error with getting the menu items`, e));
};

function displayMenu(res) {
  let menu = res.data;
  menuItemsContainer.innerHTML = ""; // to prevent menu items from appending continuously.
  menu.forEach((meal) => {
    // looping through all menu items on the response to create
    const preferencesContainer = document.createElement("div");
    const preferencesContainerModal = document.createElement("span");
    preferencesContainer.className = "preference-container";
    preferencesContainerModal.className = "preference-container-modal";
    const kcalData = document.createElement("span");
    kcalData.className = "kcal-data";
    kcalData.textContent = `${meal.calories}kcal`;
    const kcalDataImage = document.createElement("i");
    kcalDataImage.className = "fa-brands fa-nutritionix fa-bounce";
    preferencesContainerModal.appendChild(kcalDataImage);
    preferencesContainerModal.appendChild(kcalData);
    const calorieSmart = document.createElement("span");
    calorieSmart.className = "preferences";
    calorieSmart.id = "calorie-smart";
    const calorieSmartModal = document.createElement("span");
    calorieSmartModal.className = "preferences";
    calorieSmartModal.id = "calorie-smart-modal";
    const proteinPlus = document.createElement("span");
    proteinPlus.className = "preferences";
    proteinPlus.id = "protein-plus";
    const proteinPlusModal = document.createElement("span");
    proteinPlusModal.className = "preferences";
    proteinPlusModal.id = "protein-plus-modal";
    const keto = document.createElement("span");
    keto.className = "preferences";
    keto.id = "keto";
    const ketoModal = document.createElement("span");
    ketoModal.className = "preferences";
    ketoModal.id = "keto-modal";
    const carbSmart = document.createElement("span");
    carbSmart.className = "preferences";
    carbSmart.id = "carb-smart";
    const carbSmartModal = document.createElement("span");
    carbSmartModal.className = "preferences";
    carbSmartModal.id = "carb-smart-modal";
    const populars = document.createElement("span");
    populars.className = "preferences";
    populars.id = "populars";
    const popularsModal = document.createElement("span");
    popularsModal.className = "preferences";
    popularsModal.id = "populars-modal";
    const mealTitle = document.createElement("h6");
    const mealButton = document.createElement("button");
    mealButton.className = "meal-buttons";
    const menuImage = document.createElement("img");
    menuImage.className = "menu-image";
    menuImage.setAttribute("src", meal.image_url);
    const menuImageModal = document.createElement("img");
    menuImageModal.className = "modal-image";
    menuImageModal.setAttribute("src", meal.image_url);
    mealButton.appendChild(menuImage);
    menuItemsContainer.appendChild(mealButton);
    mealTitle.textContent = meal.name;
    mealTitle.className = "meal-title";
    const mealTitleModal = document.createElement("span");
    mealTitleModal.textContent = meal.name;
    mealTitleModal.className = "meal-title-modal";
    mealButton.appendChild(mealTitle);

    //Preference rules
    // calories < 500 = calorie smart
    // Protein > 30 = Protein plus
    // Keto Where carbohydrates < 30 AND fat > 30 and protein < 44

    if (meal.carbohydrates < 30 && meal.fat > 30 && meal.protein < 44) {
      preferencesContainer.appendChild(keto);
      preferencesContainerModal.appendChild(ketoModal);
      keto.textContent = "Keto";
      ketoModal.textContent = "Keto";
    }
    if (meal.calories < 500) {
      preferencesContainer.appendChild(calorieSmart);
      calorieSmart.textContent = "Calorie Smart";
      preferencesContainerModal.appendChild(calorieSmartModal);
      calorieSmartModal.textContent = "Calorie Smart";
    }
    if (meal.protein > 40) {
      preferencesContainer.appendChild(proteinPlus);
      proteinPlus.textContent = "Protein Plus";
      preferencesContainerModal.appendChild(proteinPlusModal);
      proteinPlusModal.textContent = "Protein Plus";
    }
    if (meal.carbohydrates < 20) {
      preferencesContainer.appendChild(carbSmart);
      carbSmart.textContent = "Carb Smart";
      preferencesContainerModal.appendChild(carbSmartModal);
      carbSmartModal.textContent = "Carb Smart";
    }
    if (preferencesContainer.childElementCount === 0) {
      preferencesContainer.appendChild(populars);
      populars.textContent = "Most Popular";
    }
    if (preferencesContainerModal.childElementCount === 0) {
      preferencesContainerModal.appendChild(popularsModal);
      popularsModal.textContent = "Most Popular";
    }
    mealButton.appendChild(preferencesContainer);

    // Grab modal elements
    const modal = document.getElementById("myModal");

    const modalHeaderContainer = document.getElementById(
      "modal-header-container"
    );
    const modalMiddleLeftContainer = document.querySelector(
      "#modal-middle-left-container"
    );

    const modalCaloriesText = document.querySelector("#calories-modal");
    const modalFatText = document.querySelector("#fat-modal");
    const modalCarbsText = document.querySelector("#carbs-modal");
    const modalCProteinText = document.querySelector("#protein-modal");
    const modalSodiumText = document.querySelector("#sodium-modal");
    const modalIngredients = document.querySelector("#modal-ingredients");

    // Get the element that closes the modal
    const span = document.getElementById("close-span");

    // When the user clicks on the button, open the modal
    mealButton.onclick = function () {
      modalMiddleLeftContainer.innerHTML = "";
      modalHeaderContainer.innerHTML = "";
      modalHeaderContainer.appendChild(mealTitleModal);
      modalMiddleLeftContainer.appendChild(menuImageModal);
      modalMiddleLeftContainer.appendChild(preferencesContainerModal);
      modalCaloriesText.textContent = `${meal.calories}kcal`;
      modalFatText.textContent = `${meal.fat}g`;
      modalCarbsText.textContent = `${meal.carbohydrates}g`;
      modalCProteinText.textContent = `${meal.protein}g`;
      modalSodiumText.textContent = `${meal.sodium}g`;
      modalIngredients.textContent = `Ingredients: ${meal.ingredients}`;

      modal.style.display = "block";
    };

    // When the user clicks on the exit button, close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });
}

//filter and search event listeners.

proteinButton.onclick = (e) => {
  searchInput.value = "";
  menuItemsQuery = "?preference=protein";
  changeFilterButtons(e);
  getMenuItems();
};
ketoButton.onclick = (e) => {
  searchInput.value = "";
  menuItemsQuery = "?preference=keto";
  changeFilterButtons(e);
  getMenuItems();
};
mostPopularButton.onclick = (e) => {
  searchInput.value = "";
  menuItemsQuery = "?preference=popular";
  changeFilterButtons(e);
  getMenuItems();
};
calorieSmartButton.onclick = (e) => {
  searchInput.value = "";
  menuItemsQuery = "?preference=calorie";
  changeFilterButtons(e);
  getMenuItems();
};
carbSmartButton.onclick = (e) => {
  searchInput.value = "";
  menuItemsQuery = "?preference=carb";
  changeFilterButtons(e);
  getMenuItems();
};
clearFilter.onclick = () => {
  searchInput.value = "";
  menuItemsQuery = "";
  searchInput.value = "";
  changeFilterButtons();
  getMenuItems();
};
searchForm.onsubmit = (e) => {
  e.preventDefault();
  searchInput = document.querySelector("#search-input");
  menuItemsQuery = `?search=${searchInput.value}`;
  changeFilterButtons();
  getMenuItems();
  menuItemsQuery = "";
};

function changeFilterButtons(e) {
  allFilterButtons.forEach((button) => {
    button.classList.remove("filter-button-white");
  });
  if (e) {
    e.target.classList.add("filter-button-white");
  }
}

getMenuItems();
