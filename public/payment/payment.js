const cartItemContainer = document.querySelector("#cart-items-container");

const headerTotalMealPrice = document.querySelector("#os-price-total");
const headerKitPrice = document.querySelector("#os-kit-price-quantity");

const addToCart = (meal) => {
  axios
    .post("http://localhost:4004/cart", meal)
    .then((res) => {
      const itemCount = res.data.filter(
        (item) => item.menu_id === meal.menu_id
      ).length;
      const totalItemCount = res.data.length;
      headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99 + 10.99).toFixed(2)}`;
      headerKitPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`;
      if (totalItemCount === 1) {
        const menuItem = document.querySelector(`#menu-item-${meal.menu_id}`);
        menuItem.textContent = `${itemCount} Selected`;
      } else {
        const menuItem = document.querySelector(`#menu-item-${meal.menu_id}`);
        menuItem.textContent = `${itemCount} Selected`;
      }
    })
    .catch((e) => console.log(`Error with adding to the cart`, e));
};

const deleteFromCart = (id) => {
  axios
    .delete(`http://localhost:4004/cart/${id}`)
    .then(getCart)
    .catch((e) => console.log(`Error with deleting from the cart`, e));
};

const getCart = () => {
  axios
    .get("http://localhost:4004/cart")
    .then(displayCart)
    .catch((e) => console.log(`Error with getting the cart`, e));
};

function displayCart(res) {
    cartItemContainer.innerHTML = ''
  let cart = res.data;
  const reducedCart = cart.reduce((acc, obj) => {
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
  const totalItemCount = cart.length;
  reducedCart.forEach((meal) => {
    let itemCount = cart.filter((item) => item.menu_id === meal.menu_id).length;
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
    cartItemContainer.appendChild(mealButton);
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
    selectedData.textContent = `${itemCount} Selected`;
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
    minusButton.addEventListener("click", () => deleteFromCart(meal.menu_id));
  });
  headerTotalMealPrice.textContent = `$${(totalItemCount * 7.99 + 10.99).toFixed(2)}`;
  headerKitPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`;
}

//Preference rules
// calories < 500 = calorie smart
// Protein > 30 = Protein plus
// Keto Where carbohydrates < 30 AND fat > 30 and protein < 44


const modal = document.getElementById("myModal");
const modalButton = document.getElementById("place-order-button");


// When the user clicks on the button, open the modal
modalButton.onclick = function() {
  modal.style.display = "block";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    window.location.href= "../home/home.html"
  }
}
function dateLoad() {
  const week = 1000 * 60 * 60 * 24 * 7;
  const timeElapsed = Date.now() + week;
  const today = new Date(timeElapsed);
  date.innerHTML = today.toDateString();
}

dateLoad()

getCart();
