const userID = localStorage.getItem("userID") ? localStorage.getItem("userID") : "25801";
const cartList = localStorage.getItem("cartList") ? localStorage.getItem("cartList") : undefined;
const cartContainer = document.getElementById("cartContainer");
let userCart = [];

function showCartItems() {
  let cart;

  for (const item of userCart[0].articles) {
    cartContainer.innerHTML += `
    <div class="row align-items-center border-bottom p-2">
      <div class="col"><img src="${item.image}" class="img-thumbnail" alt"Producto"></div>
      <div class="col">${item.name}</div>
      <div class="col unitCost">${item.unitCost}</div>
      <div class="col"><input type="number" min="1" class="form-control w-50 p-0 inputsToCalc" value="${item.count}"></input></div>
      <div class="col">${item.currency} <span class="total">${item.count * item.unitCost}</span></div>
      <div class="col"></div>
    </div>
    `;
  }

  // Añadiendo los otros productos dependiendo si existen
  if (cartList) {
    cart = JSON.parse(cartList);
    for (const item in cart) {
      cartContainer.innerHTML += `
      <div class="row align-items-center border-bottom p-2">
        <div class="col"><img src="${cart[item].image}" class="img-thumbnail" alt"Producto"></div>
        <div class="col">${cart[item].name}</div>
        <div class="col unitCost">${cart[item].unitCost}</div>
        <div class="col"><input type="number" min="1" class="form-control w-50 p-0 inputsToCalc" value="${cart[item].count}"></input></div>
        <div class="col">${cart[item].currency} <span class="total">${cart[item].count * cart[item].unitCost}</span></div>
        <div class="col"></div>
      </div>
      `;
    }
  }

  // Escucha de evento para calcular el subtotal
  document.querySelectorAll("input.inputsToCalc").forEach((e, i) => {
    e.addEventListener("input", (e) => {
      let quantity = document.querySelectorAll("input.inputsToCalc")[i].value;
      let unitCost = document.querySelectorAll("div.unitCost")[i].innerHTML;

      if (quantity > 0) {
        document.querySelectorAll("span.total")[i].innerHTML = quantity * unitCost;
      } else {
        document.querySelectorAll("span.total")[i].innerHTML = 0;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Obteniendo los productos que vienen por defecto
  getJSONData(CART_INFO_URL + userID + ".json")
  .then(function (resultObj) {
    if (resultObj.status === "ok") {
      userCart.push(resultObj.data);
      showCartItems();
    }
  });
});



