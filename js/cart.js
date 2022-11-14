const userID = localStorage.getItem("userID") || "25801";
const cartListResponse = localStorage.getItem("cartList") || undefined;
const cartContainer = document.getElementById("cartContainer");
let response = [];
let method = "No ha seleccionado";
let cart = {};
let total = 0;

function validateMethodPayment() {
  let missingData = false;
  let paymentMethodSelected = document.querySelector("input[name='payment-method-selected']:checked");
  const form = document.getElementById("form");
  const cardNumber = document.getElementById("card-number");
  const securityCode = document.getElementById("security-code");
  const expirationDate = document.getElementById("expiration-date");
  const accountNumber = document.getElementById("account-number");

  if (paymentMethodSelected != null) {

    if (paymentMethodSelected.id == "radio-btn-method") {
      // Comprobación de la forma de pago dentro del modal
      if (cardNumber.value.trim()) {
        cardNumber.setCustomValidity("");
      } else {
        missingData = true;
        cardNumber.setCustomValidity(false);
  
      }
      // Comprobación de la forma de pago dentro del modal
      if (securityCode.value.trim()) {
        securityCode.setCustomValidity("");
      } else {
        missingData = true;
        securityCode.setCustomValidity(false);
      }
      // Comprobación de la forma de pago dentro del modal
      if (expirationDate.value.trim()) {
        expirationDate.setCustomValidity("");
      } else {
        missingData = true;
        expirationDate.setCustomValidity(false);
      }
    } else {
      // Comprobación de la forma de pago dentro del modal
      if (accountNumber.value.trim()) {
        accountNumber.setCustomValidity("");
      } else {
        missingData = true;
        expirationDate.setCustomValidity(false);
      }
    }

    // Escuchas de evento para mostrar que el dato ingresado es correcto
    cardNumber.addEventListener("input", () => {
      cardNumber.setCustomValidity("");
      document.querySelector(".payment-method").classList.remove("text-danger");
    });
    securityCode.addEventListener("input", () => {
      securityCode.setCustomValidity("");
      document.querySelector(".payment-method").classList.remove("text-danger");
    });
    expirationDate.addEventListener("input", () => {
      expirationDate.setCustomValidity("");
      document.querySelector(".payment-method").classList.remove("text-danger");
    });
    accountNumber.addEventListener("input", () => {
      accountNumber.setCustomValidity("");
      document.querySelector(".payment-method").classList.remove("text-danger");
    });


    // Le muestra feedback al usuario, en caso de falta de información

    if (missingData && form.classList.contains("was-validated")) {
      document.querySelector(".payment-method").classList.add("text-danger");
    } else {
      document.querySelector(".payment-method").classList.remove("text-danger");
    }

    document.querySelector(".payment-method").innerHTML = method;
    document.querySelector(".invalid-feedback-payment").classList.add("d-none");
  } else {
    document.querySelector(".invalid-feedback-payment").classList.add("d-block");
  }
}

function validateShippingAddress() {
  const street = document.getElementById("street");
  const numberStreet = document.getElementById("number-street");
  const cornerStreet = document.getElementById("corner-street");

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
  if (cornerStreet.value.trim()) {
    cornerStreet.setCustomValidity("");
  } else {
    cornerStreet.setCustomValidity(false);
  }

  street.addEventListener("input", () => {
    street.setCustomValidity("");
  });
  
  numberStreet.addEventListener("input", () => {
    numberStreet.setCustomValidity("");
  });

  cornerStreet.addEventListener("input", () => {
    cornerStreet.setCustomValidity("");
  });
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
  delete cart[id];
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

      // if (quantity <= 0) {
      //   quantity = 1;
      // }

      spanTotal.innerHTML = quantity * unitCost;
      cart[id].count = quantity;

      calcCosts();
      updateLocalStorage();
    });
  });
}

function showCartList() {
  cartContainer.innerHTML = "";
  if (Object.entries(cart).length == 0) {
    document.getElementById("main-container").innerHTML = `
    <div class="d-flex flex-column align-items-center">
      <h2 class="text-center text-secondary">El carrito esta vació</h2>
      <button class="btn btn-secondary text-center" onclick="window.location = 'categories.html'">Buscar productos</button>
    </div>
    `;
  } else {
    for (const item in cart) {
      cartContainer.innerHTML += `
      <div class="row align-items-center border-bottom p-2">
        <div class="col"><img src="${cart[item].image}" class="img-thumbnail" alt"Producto"></div>
        <div class="col">${cart[item].name}</div>
        <div class="col unitCost">${cart[item].unitCost}</div>
        <div class="col"><input type="number" form="form" min="1" class="form-control w-50 p-0 subtotal" value="${cart[item].count}" id="${cart[item].id}"></input></div>
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
        unitCost: item.unitCost
      };
    }
  }

}

document.addEventListener("DOMContentLoaded", () => {
  // Evento de los botones de radio del tipo de Envió
  let allRadioBtn = document.querySelectorAll('input[name="shippingType"]');
  allRadioBtn
  .forEach(e => {
    e.addEventListener("input", () => {
      calcCosts();
      // Cada vez que el usuario cambie el tipo de envió
      // se llama a la función para volver a calcular los costos
    });
  });

  // Eventos de los botones de radio de las formas de pago
  let methodOne = document.getElementById("radio-btn-method");
  methodOne
  .addEventListener("input", () => {
    // Mostrando el método de pago seleccionado
    let removeDisableAttribute = document.getElementById("payment-method-1");
    removeDisableAttribute.querySelectorAll("input[type='text'], input[type='month']")
    .forEach(e => e.removeAttribute("disabled"));

    // Deshabilitando el otro método de pago
    let addDisabledAttribute = document.getElementById("payment-method-2");
    addDisabledAttribute.querySelectorAll("input[type='text']")
    .forEach(e => e.setAttribute("disabled", ""));

    method = methodOne.nextElementSibling.innerHTML;
    validateMethodPayment();
  });

  let methodTwo = document.getElementById("radio-btn-method-2");
  methodTwo
  .addEventListener("input", () => {
    // Mostrando el método de pago seleccionado
    let removeDisableAttribute = document.getElementById("payment-method-2");
    removeDisableAttribute.querySelectorAll("input[type='text']")
    .forEach(e => e.removeAttribute("disabled"));

    // Deshabilitando el otro método de pago
    let addDisabledAttribute = document.getElementById("payment-method-1");
    addDisabledAttribute.querySelectorAll("input[type='text'], input[type='month']")
    .forEach(e => e.setAttribute("disabled", ""));

    method = methodTwo.nextElementSibling.innerHTML;
    validateMethodPayment();
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

      // Validación => Forma de pago
      validateMethodPayment();

      // Validación => Cantidad de Artículos
      for (const item in cart) {
        if (cart[item].count > 0) {
          document.getElementById(cart[item].id).setCustomValidity("");
        } else {
          document.getElementById("no-delete").classList.add("alert-danger");
          document.getElementById("no-delete").classList.remove("d-none");
          document.getElementById("no-delete").classList.add("d-block");
          document.getElementById("no-delete").classList.add("show");
          
          setTimeout(() => {
            document.getElementById("no-delete").classList.add("d-none");
            document.getElementById("no-delete").classList.remove("d-block");
            document.getElementById("no-delete").classList.remove("show");
          },1500)
            
            document.getElementById(cart[item].id).setCustomValidity(false);
        }
      } 

      if (form.checkValidity()) {
        document.getElementById("alertResult").classList.add("alert-success");
        document.getElementById("alertResult").classList.remove("d-none");
        document.getElementById("alertResult").classList.add("d-block");
        document.getElementById("alertResult").classList.add("show");
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
      updateLocalStorage();
      showCartList();
      calcSubTotal();
      calcCosts();
    }
  });
});



