const userID = localStorage.getItem("userID") || "25801";
const cartListResponse = localStorage.getItem("cartList") || undefined;
const cartContainer = document.getElementById("cartContainer");
let response = [];
let cart = {};
let total = 0;

function updateLocalStorage() {
  localStorage.setItem("cartList", JSON.stringify(cart));
}

function updateTotal() {
  let dolar = 0.025; 
  total = 0;
  for (const item in cart) {
    if (cart[item].id) {
      if (cart[item].currency == "UYU") {
        let unitCostDolar = parseInt(cart[item].unitCost) * dolar;
        total += parseInt(cart[item].count) * unitCostDolar;
      } else {
        total += parseInt(cart[item].count) * parseInt(cart[item].unitCost);
      }
    }
  }
  console.log(total);
}

function deleteItem(id) {
  if (!cart[id].hasOwnProperty("userCart")) {
    delete cart[id];
  } else {
    cart[id].userCart = true;
    delete cart[id].id;
  }
  updateLocalStorage();
  updateTotal();
  showCartList();
}

// Añade una escucha de evento para calcular el subtotal
function calcSubTotal() {
  document.querySelectorAll("input.subtotal").forEach((e, i) => {
    e.addEventListener("input", (e) => {
      let unitCost = document.querySelectorAll("div.unitCost")[i].innerHTML;
      let quantity = document.querySelectorAll("input.subtotal")[i].value;
      let spanTotal = document.querySelectorAll("span.total")[i];
      let id = document.querySelectorAll("input.subtotal")[i].id;

      if (!quantity > 0) {
        quantity = 1;
      }

      spanTotal.innerHTML = quantity * unitCost;
      cart[id].count = quantity;

      updateTotal();
      updateLocalStorage();
    });
  });
}

function showCartList() {
  cartContainer.innerHTML = "";
  for (const item in cart) {
    if (!(cart[item].userCart)) {
      cartContainer.innerHTML += `
      <div class="row align-items-center border-bottom p-2">
        <div class="col"><img src="${cart[item].image}" class="img-thumbnail" alt"Producto"></div>
        <div class="col">${cart[item].name}</div>
        <div class="col unitCost">${cart[item].unitCost}</div>
        <div class="col"><input type="number" min="1" class="form-control w-50 p-0 subtotal" value="${cart[item].count}" id="${cart[item].id}"></input></div>
        <div class="col">${cart[item].currency} <span class="total">${cart[item].count * cart[item].unitCost}</span></div>
        <div class="col d-flex justify-content-center">
          <button class="btn btn-outline-danger" onclick="deleteItem(${cart[item].id})">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
      `;
    }
  }
}

function createCartList() {
  // Comprueba si existe una lista en el LS
  if (cartListResponse) {
    cart = JSON.parse(cartListResponse);
  }
  
  // Añade el producto precargado al Carrito
  for (const item of response[0].articles) {
    if (!cart[item.id]) {
      cart[item.id] = {
        count: item.count,
        currency: item.currency,
        id: item.id,
        image: item.image,
        name: item.name,
        unitCost: item.unitCost,
        userCart: false
      };
    }
  }

}

document.addEventListener("DOMContentLoaded", () => {
  // Obteniendo los productos que vienen por defecto
  getJSONData(CART_INFO_URL + userID + ".json")
  .then(function (resultObj) {
    if (resultObj.status === "ok") {
      response.push(resultObj.data);
      createCartList();
      showCartList();
      calcSubTotal();
      updateTotal();
    }
  });
});



