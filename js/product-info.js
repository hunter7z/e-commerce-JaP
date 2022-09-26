const productID = localStorage.getItem("productID");
let product;
let commentsObj;

function showProduct() {
  let images = "";
  for (const image of product.images) {
    images += `
    <div class="col-12 col-md-6 col-lg-2">
      <img src="${image}" alt="${product.name}" class="img-fluid border p-1">
    </div>
        `;
  }

  // Generando HTML para la información del producto
  let htmlContentToAppend_productInfo = `
    <div class="p-4">
      <h2>${product.name}</h2>
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
          ${images}
        </div>
      </div>
    </div>
  `;

  // Generando HTML para mostrar los productos relacionados

  let htmlContentToAppend_relatedProduct = "";
  for (const item of product.relatedProducts) {
    const { id, image, name } = item;
    htmlContentToAppend_relatedProduct += `
    <div class="col-12 col-md-6 col-lg-4" onclick="changeProduct(${id})">
      <div class="border p-1 mb-2 pointer-cursor">
        <img src="${image}" class="img-fluid p-1" alt="Producto relacionado">
        <h6 class="ps-4 pt-2">${name}</h6>
      </div>
    </div>
    `;
  }

  document.getElementById("product-container").innerHTML = htmlContentToAppend_productInfo;
  document.getElementById("relatedProducts").innerHTML = htmlContentToAppend_relatedProduct;
}

function changeProduct(id) {
  localStorage.setItem("productID", id);
  location.reload();
}

function showComments(comments = commentsObj) {
  let htmlContentToAppend = "";
  let stars = "";

  for (const comment of comments) {
    stars = getScore(comment.score);
    
    htmlContentToAppend += `
    <div class="col-11 col-sm-12 col-md-12 col-lg-12 border p-2">
    <div class="d-flex">
      <div class="d-flex flex-wrap">
        <p class="m-0"><span class="fw-bold pe-1 me-1">${comment.user}</span></p>
        <p class="mb-0 pe-1 me-1">${comment.dateTime}</p>
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
  let retorno = "";
  for (let i = 0; i < 5; i++) {
    if (i < stars) {
      retorno += `
      <i class="fa fa-star checked"></i>
      `;
    } else {
      retorno += `
      <i class="fa fa-star"></i>
      `;
    }
  }
  return retorno;
}

document.addEventListener("DOMContentLoaded", () => {
  // Obteniendo los datos de los productos
  getJSONData(PRODUCT_INFO_URL + productID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      product = resultObj.data;
      showProduct();
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
    hour = ("0" + hour).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    // Creando Comentario
    let userComment = [
      {
        user: window.localStorage.getItem("userDesignation"),
        description: description,
        score: stars,
        dateTime: `${year}-${month + 1}-${day} ${hour}:${minutes}:${seconds}`,
      },
    ];

    // Mostrando los comentarios, con el comentario nuevo
    showComments(userComment);
  });
});
