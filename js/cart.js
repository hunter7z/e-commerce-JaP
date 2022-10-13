const userID = localStorage.getItem("userID") ? localStorage.getItem("userID") : "25801";
const clickedProduct = localStorage.getItem("clickedProduct");
let currentList = [];
let cartItem = {};

function createCartItem(element) { 
  const {currency, id, images, name, cost} = element;

  const cartItem = {
    count: 1,
    currency: currency,
    id: id,
    image: images[0],
    name: name,
    unitCost: cost
  }

  return cartItem;
}

function showCartItems() {
  console.log("Función que muestra el carrito: ", currentList);
  localStorage.setItem("cartList", JSON.stringify(currentList));
}

document.addEventListener("DOMContentLoaded", () => {
  // Obteniendo producto si el usuario anteriormente apretó en uno
  getJSONData(PRODUCT_INFO_URL + clickedProduct + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      cartItem = createCartItem(resultObj.data);
    }
  });

  // Obteniendo los productos que vienen por defecto
  getJSONData(CART_INFO_URL + userID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {

      // Comprueba si existe una lista en el LocalStorage
      if (localStorage.getItem("cartList") === null) {
        // Añadiendo el producto que viene por defecto
        currentList.push(resultObj.data.articles[0]);
      } else {
        currentList = JSON.parse(localStorage.getItem("cartList"));
      }

      // Comprueba si el usuario clicó en un Producto para comprarlo
      if (clickedProduct) {
        // Comprueba si ese Producto ya esta en la lista
        let exist = currentList.some(e => e.id == clickedProduct);

        if (!exist) {
          currentList.push(cartItem);
        } else {
          currentList.forEach(e => {
            if (e.id == clickedProduct) {
              e.count++;
            }
          });
        }

      }

      localStorage.removeItem("clickedProduct");
      showCartItems();
    }
  });
})