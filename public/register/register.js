const kitPrice = document.querySelector("#os-kit-price-quantity");
const kitTotal = document.querySelector("#os-price-total");
const shipping = document.querySelector("#os-shipping-price");

const getCart = () => {
  axios
    .get("/cart")
    .then(displayQuantity)
    .catch((e) => console.log(`Error with getting the cart`, e));
};

const registerUser = () => {
  let body = {};
  const inputContainer = document.querySelector("#input-form");
  const allInputs = inputContainer.querySelectorAll("input");
  allInputs.forEach((element) => {
    body[element.name] = element.value;
  });
  axios.post("/users", body).then(() => {
    window.location.href = "../payment/payment.js";
  });
};

const nextButton = document.querySelector("#next-button");
nextButton.onclick = registerUser;

function displayQuantity(res) {
  let cart = res.data;
  const totalItemCount = cart.reduce((acc, curr) => {
    acc += curr.quantity;
    return acc;
  }, 0);
  if (totalItemCount) {
    kitTotal.textContent = `$${(totalItemCount * 7.99 + 10.99).toFixed(2)}`;
    kitPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`;
    shipping.textContent = `$10.99`;
  } else {
    kitPrice.textContent = `$0.00`;
    kitTotal.textContent = `$0.00`;
    shipping.textContent = `$0.00`;
  }
}

getCart();
