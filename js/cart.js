const userID = localStorage.getItem("userID") || "25801";
const cartListResponse = localStorage.getItem("cartList") || undefined;
const cartContainer = document.getElementById("cartContainer");
let response = [];
let cart = {};
let total = 0;

function validateShippingAddress() {
  const street = document.getElementById("street");
  const numberStreet = document.getElementById("number-street");

  if (street.value.trim()) {
    street.setCustomValidity("");
  } else {
    street.setCustomValidity(false);
  }
  if (numberStreet.value.trim()) {
    numberStreet.setCustomValidity("");
  } else {
    numberStreet.setCustomValidity(false);
  }

  street.addEventListener("input", () => {
    street.setCustomValidity("");
  })
  
  numberStreet.addEventListener("input", () => {
    numberStreet.setCustomValidity("");
  })
}

function validateShippingType() {
  let radioBtnValidate = document.querySelector('input[name="shippingType"]:checked');
  let allRadioBtn = document.querySelectorAll('input[name="shippingType"]');

  if (radioBtnValidate != null) {
    allRadioBtn
    .forEach(e => e.setCustomValidity(""));
  } else {
    allRadioBtn
    .forEach(e => e.setCustomValidity(false));
  }
}

function updateLocalStorage() {
  localStorage.setItem("cartList", JSON.stringify(cart));
}

function calcCosts() {
  let dolar = 0.025; 
  let shippingCostWithTaxes = 0;
  let shippingCost = document.querySelector('input[name="shippingType"]:checked');
  let allSubtotals = 0;


  for (const item in cart) {
    if (cart[item].id) {
      if (cart[item].currency == "UYU") {
        let unitCostDolar = Number(cart[item].unitCost) * dolar;
        allSubtotals += Number(cart[item].count) * unitCostDolar;
      } else {
        allSubtotals += Number(cart[item].count) * Number(cart[item].unitCost);
      }
    }
  }
  
  if (shippingCost != null) {
    let premium  = shippingCost.value == "premium"  ? (allSubtotals * 0.15).toFixed(2) : undefined;
    let express  = shippingCost.value == "express"  ? (allSubtotals * 0.07).toFixed(2) : undefined;
    let standard = shippingCost.value == "standard" ? (allSubtotals * 0.05).toFixed(2) : undefined;

    shippingCostWithTaxes = premium || express || standard;
    document.getElementById("shipping-cost").innerHTML = shippingCostWithTaxes;
  } else {
    document.getElementById("shipping-cost").innerHTML = 0;
  }

  total = (Number(allSubtotals) + Number(shippingCostWithTaxes)).toFixed(2);
  document.getElementById("total").innerHTML = total;
  document.getElementById("all-subtotal").innerHTML = allSubtotals.toFixed(2);
}

function deleteItem(id) {
  if (!cart[id].hasOwnProperty("userCart")) {
    delete cart[id];
  } else {
    cart[id].userCart = true;
    delete cart[id].id;
  }
  updateLocalStorage();
  calcCosts();
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

      calcCosts();
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
  // Evento de los botones de radio
  let allRadioBtn = document.querySelectorAll('input[name="shippingType"]');
  allRadioBtn
  .forEach(e => {
    e.addEventListener("input", () => {
      calcCosts();
    });
  });

  // Validación de formulario
  (function () {
    'use strict'
  
    let form = document.getElementById("form");
    form.addEventListener('submit', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Validación => Tipo de envio
      validateShippingType();  

      // Validación => Dirección de envío
      validateShippingAddress();


      if (form.checkValidity()) {
        const formdata = new FormData(form);
        formdata.append("totalPrice", total);
        for (const item of formdata) {
          console.log(item[0] + ": " + item[1]);
        }
        alert("Nice!!")
      }

      form.classList.add('was-validated')
    }, false)

  })();

  // Obteniendo los productos que vienen por defecto
  getJSONData(CART_INFO_URL + userID + ".json")
  .then(function (resultObj) {
    if (resultObj.status === "ok") {
      response.push(resultObj.data);
      createCartList();
      showCartList();
      calcSubTotal();
      calcCosts();
    }
  });
});



