const kitPrice = document.querySelector("#os-kit-price-quantity");
const kitTotal = document.querySelector('#os-price-total');




const getCart = () => {
    axios
      .get("http://localhost:4004/cart")
      .then(displayQuantity)
      .catch((e) => console.log(`Error with getting the cart`, e));
  };

  function displayQuantity(res){
    let cart = res.data;
    const totalItemCount = cart.length;
    if(cart.length !== `$0.00`){
    kitPrice.textContent = `$${(totalItemCount * 7.99).toFixed(2)}`;}
    if(kitPrice.textContent !== 0){
    kitTotal.textContent = `$${(totalItemCount * 7.99 + 10.99).toFixed(2)}`;
    }else{
        kitPrice.textContent = `$0.00`;
        kitTotal.textContent = `$0.00`;
    }
  }

  getCart()