const productID = localStorage.getItem("productID");
let product;
let commentsObj;

function showProduct() {
  let imagesDesktop = "";
  let imagesMobile = "";

  for (let i = 0; i < product.images.length; i++) {
    imagesDesktop += `
    <div class="col-12 col-md-6 col-lg-2 d-none d-md-flex">
      <img src="${product.images[i]}" alt="${product.name}" class="img-fluid border p-1">
    </div>
    `;
    // Condicional para agregar la clase active solo al primer item de el carrusel
    if (i === 0) {
      imagesMobile += `
      <div class="carousel-item active">
        <img src="${product.images[i]}" class="d-block w-100" alt="${product.name}">
      </div>
    `;
    } else {
      imagesMobile += `
      <div class="carousel-item">
        <img src="${product.images[i]}" class="d-block w-100" alt="${product.name}">
      </div>
    `;
    }
  }

  // Generando HTML para la información del producto
  let htmlContentToAppend_productInfo = `
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-sm-4 py-4">
      <h2 class="m-0">${product.name}</h2>
      <div class="mt-2 mt-sm-0 align-self-end">
        <button class="btn btn-success btn-buy">Comprar</button>
        <button class="btn btn-secondary" onclick="window.location = 'products.html'">Volver</button>
      </div>
    </div>
    <div class="row p-2 pt-4 border-top">
      <div class="col">
        <p class="fw-bold mb-0">Precio</p>
        <span>${product.currency}<span> ${product.cost} </span></span>
      </div>
    </div>
    <div class="row p-2">
      <div class="col">
        <p class="fw-bold mb-0">Descripción</p>
        <span>${product.description}</span>
      </div>
    </div>
    <div class="row p-2">
      <div class="col">
        <p class="fw-bold mb-0">Categoría</p>
        <span>${product.category}</span>
      </div>
    </div>
    <div class="row p-2">
      <div class="col">
        <p class="fw-bold mb-0">Cantidad de vendidos</p>
        <span>${product.soldCount}</span>
      </div>
    </div>
    <div class="row p-2">
      <div class="col">
        <p class="fw-bold mb-0">Imágenes ilustrativas</p>
        <div class="row g-3" id="img-container">
          ${imagesDesktop}

        <div id="carouselExampleControls" class="carousel border p-1 slide d-block d-md-none" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${imagesMobile}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span class="carousel-control-prev-icon prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span class="carousel-control-next-icon next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
        </div>
          
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("product-container").innerHTML = htmlContentToAppend_productInfo;
  document.querySelector(".btn-buy").addEventListener("click", () => {
    buyProduct(product.id, product.currency, product.images[0], product.name, product.cost);
  })
}

function relatedProducts() {
  let htmlContentToAppend = "";

  for (const item of product.relatedProducts) {
    const { id, image, name } = item;
    htmlContentToAppend += `
    <div class="col-12 col-md-6 col-lg-4" onclick="changeProduct(${id})">
      <div class="border p-1 mb-2 cursor-active">
        <img src="${image}" class="img-fluid p-1" alt="Producto relacionado">
        <h6 class="ps-4 pt-2">${name}</h6>
      </div>
    </div>
    `;
  }
  document.getElementById("relatedProducts").innerHTML = htmlContentToAppend;
}

function changeProduct(id) {
  localStorage.setItem("productID", id);
  history.scrollRestoration = "manual";
  location.reload();
}

function buyProduct(id, currency, image, name, cost) {
  let cartList = {};
  // Comprueba si ya existe una lista con productos en el LS 
  if (localStorage.getItem("cartList")) {
    cartList = JSON.parse(localStorage.getItem("cartList"));
    // Comprueba si ya se agregó el Producto anteriormente
    if (!cartList[id]) {
      cartList[id] = {
        count: 1,
        currency: currency,
        id: id,
        image: image,
        name: name,
        unitCost: cost
      };
    } else {
      cartList[id].count++;
    }
  } else {
    cartList = {
      [id]: {
        count: 1,
        currency: currency,
        id: id,
        image: image,
        name: name,
        unitCost: cost
      }
    };
  }
  
  localStorage.setItem("cartList", JSON.stringify(cartList));
  // localStorage.setItem("userID", userID);
  // localStorage.setItem("clickedProduct", productID);
  window.location = "cart.html";
}

function showComments(comments = commentsObj) {
  let htmlContentToAppend = "";
  let stars = "";

  for (const comment of comments) {
    stars = getScore(comment.score);
    
    htmlContentToAppend += `
    <div class="col-11 col-sm-12 col-md-12 col-lg-12 border p-2">
    <div class="d-flex">
      <div class="d-flex flex-column flex-sm-row flex-wrap">
        <p class="m-0"><span class="fw-bold pe-1 me-1">${comment.user}</span></p>
        <p class="mb-0 pe-1 me-1 order-5 order-sm-0 fst-italic">${comment.dateTime}</p>
        <div class="ratings">
          ${stars}
        </div>
      </div>
    </div>
    <p class="m-0">${comment.description}</p>  
    </div>
    `;
  }

  document.getElementById("comments-container").innerHTML += htmlContentToAppend;
}

function getScore(stars) {
  let content = "";
  for (let i = 0; i < 5; i++) {
    if (i < stars) {
      content += `
      <i class="fa fa-star checked"></i>
      `;
    } else {
      content += `
      <i class="fa fa-star"></i>
      `;
    }
  }
  return content;
}

document.addEventListener("DOMContentLoaded", () => {
  // Obteniendo los datos de los productos
  getJSONData(PRODUCT_INFO_URL + productID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProduct();
      relatedProducts();
    }
  });
  // Obteniendo los comentarios
  getJSONData(PRODUCT_INFO_COMMENTS_URL + productID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      commentsObj = resultObj.data;
      showComments();
    }
  });
  // Publicar un comentario
  document.getElementById("postComment").addEventListener("click", () => {
    const description = document.getElementById("userComment").value;
    const stars = parseInt(document.getElementById("userScore").value);

    const date = new Date();
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

    // Agregando un cero a la hora, para que no se muestre un solo número
    hour    = ("0" + hour).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    // Creando Comentario
    let userComment = [
      {
        user: localStorage.getItem("userDesignation"),
        description: description,
        score: stars,
        dateTime: `${year}-${month + 1}-${day} ${hour}:${minutes}:${seconds}`,
      },
    ];

    // Mostrando los comentarios, con el comentario nuevo
    document.getElementById("userComment").value = "";
    showComments(userComment);
  });
});
