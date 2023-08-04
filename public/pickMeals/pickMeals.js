const menuItemsContainer = document.querySelector(".menu-items-container");
const date = document.querySelector("#date");
const headerTotalMealQuantity = document.querySelector("#dynamic-meal-quantity");
const headerTotalMealPrice = document.querySelector("#dynamic-meal-price");

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

const getCart = () => {
  return axios.get("http://localhost:4004/cart");
};

const addToCart = (meal) => {
  axios
    .post("http://localhost:4004/cart", meal)
    .then((res) => {
      const itemCount = res.data.filter(
        (item) => item.menu_id === meal.menu_id
      ).length;
      const totalItemCount = res.data.length;

      if (totalItemCount === 1) {
        headerTotalMealQuantity.textContent = `${totalItemCount} Meal selected`;
        headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`
        const menuItem = document.querySelector(`#menu-item-${meal.menu_id}`);
        menuItem.textContent = `${itemCount} Selected`;
      } else {
        const totalItemCount = res.data.length;
        headerTotalMealQuantity.textContent = `${totalItemCount} Meals selected`;
        headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`
        const menuItem = document.querySelector(`#menu-item-${meal.menu_id}`);
        menuItem.textContent = `${itemCount} Selected`;
      }
    })
    .catch((e) => console.log(`Error with adding to the cart`, e));
};

const deleteFromCart = (id) => {
  axios
    .delete(`http://localhost:4004/cart/${id}`)
    .then((res) => {
      const itemCount = res.data.filter((item) => item.menu_id === id).length;
      const totalItemCount = res.data.length;
      if (itemCount !== 0) {
        const menuItem = document.querySelector(`#menu-item-${id}`);
        menuItem.textContent = `${itemCount} Selected`;
      }
      if (totalItemCount > 1) {
        const totalItemCount = res.data.length;
        headerTotalMealQuantity.textContent = `${totalItemCount} Meals selected`;
        headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`
      }
      if (totalItemCount < 1) {
        headerTotalMealQuantity.textContent = `0 Meals selected`;
        headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`
      }
      if (itemCount < 1) {
        const menuItem = document.querySelector(`#menu-item-${id}`);
        menuItem.textContent = `0 Selected`;
      } else {
        headerTotalMealQuantity.textContent = `${totalItemCount} Meal selected`;
        headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`
      }
    })
    .catch((e) => console.log(`Error with deleting from the cart`, e));
};

function displayMenu(res) {
  getCart()
    .then((cartResponse) => {
      menuItemsContainer.innerHTML = ''
      const reducedCart = cartResponse.data.reduce((acc, obj) => {
        // Check if the "name" property of the current object already exists in the accumulator
      const existingObject = acc.find((item) => item.name === obj.name);
      // If the object with the same name is not found in the accumulator, add the current object
      if (!existingObject) {
        acc.push(obj);
      }else{
          existingObject.quantity++
      }
      return acc;
    }, []);
      let totalQuantity = reducedCart.reduce((acc, curr) => {
        acc += curr.quantity;
        return acc;
      }, 0);
      if (totalQuantity !== 1) {
        headerTotalMealQuantity.textContent = `${totalQuantity} Meals selected`;
        headerTotalMealPrice.textContent = `$${(totalQuantity * 7.99).toFixed(2)}`
      } else {
        headerTotalMealQuantity.textContent = `${totalQuantity} Meal selected`;
        headerTotalMealPrice.textContent = `$${(totalQuantity * 7.99).toFixed(2)}`
      }
      let menu = res.data;
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
        const outerButtonContainer = document.createElement("div");
        outerButtonContainer.className = "outer-button-container";
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        const selectedData = document.createElement("span");
        selectedData.className = "selected-data";
        const cartItem = reducedCart.find((item) => item.menu_id === meal.menu_id);
        if (cartItem) {
          selectedData.textContent = `${cartItem.quantity} Selected`;
        } else {
          selectedData.textContent = "0 Selected";
        }
        selectedData.id = `menu-item-${meal.menu_id}`;
        const plusButton = document.createElement("button");
        plusButton.className = "plus-button";
        plusButton.textContent = "+";
        const minusButton = document.createElement("button");
        minusButton.className = "minus-button";
        minusButton.textContent = "-";
        outerButtonContainer.appendChild(buttonContainer);
        buttonContainer.appendChild(minusButton);
        buttonContainer.appendChild(selectedData);
        buttonContainer.appendChild(plusButton);
        mealButton.appendChild(outerButtonContainer);
        plusButton.addEventListener("click", () => addToCart(meal));
        minusButton.addEventListener("click", () =>
          deleteFromCart(meal.menu_id)
        );
      });
    })
    .catch((e) => console.log(`Error with getting the cart`, e));
}

function dateLoad() {
  const week = 1000 * 60 * 60 * 24 * 7;
  const timeElapsed = Date.now() + week;
  const today = new Date(timeElapsed);
  date.innerHTML = today.toDateString();
}

//Preference rules
// calories < 500 = calorie smart
// Protein > 30 = Protein plus
// Keto Where carbohydrates < 30 AND fat > 30 and protein < 44
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

dateLoad();
getMenuItems();
