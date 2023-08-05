const kitPrice = document.querySelector("#os-kit-price-quantity");
const kitTotal = document.querySelector('#os-price-total');
const shipping = document.querySelector('#os-shipping-price');




const getCart = () => {
    axios
      .get("http://localhost:4004/cart")
      .then(displayQuantity)
      .catch((e) => console.log(`Error with getting the cart`, e));
  };

  function displayQuantity(res){
    let cart = res.data;
    const totalItemCount = cart.reduce((acc, curr) => {
      acc += curr.quantity;
      return acc;
    }, 0);
    if(totalItemCount){
      kitTotal.textContent = `$${(totalItemCount * 7.99 + 10.99).toFixed(2)}`;
      kitPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`;
      shipping.textContent = `$10.99`;
    }else{
        kitPrice.textContent = `$0.00`;
        kitTotal.textContent = `$0.00`;
        shipping.textContent = `$0.00`;
    }
  }

  getCart()