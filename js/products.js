const catID = localStorage.getItem("catID");
const min = document.getElementById("rangeFilterCountMin");
const max = document.getElementById("rangeFilterCountMax");
let currentCategoryName = "";
let currentProductsArray = [];

function sortBy(sortFormat) {
    if(sortFormat === "expensive"){
        return currentProductsArray.sort((a, b)=> b.cost - a.cost);
    } else if(sortFormat === "cheap") {
        return currentProductsArray.sort((a, b)=> a.cost - b.cost);
    } else if(sortFormat === "relevance") {
        return currentProductsArray.sort((a, b)=> b.soldCount - a.soldCount);
    }
}

function showCategoryName() {
    let content = `Verás aquí todos los productos de la categoria ${currentCategoryName}.`;
    document.querySelector(".lead").innerHTML = content;
}

function showProductsList(productArray = currentProductsArray) {
    let htmlContentToAppend = "";
    
    for (let i = 0; i < productArray.length; i++) {
      const product = productArray[i];

      if(!(product.cost < parseInt(min.value)) && !(product.cost > parseInt(max.value))) {
          htmlContentToAppend += `
          <div class="list-group-item list-group-item-action cursor-active">
          <div class="row">
              <div class="col-3">
                  <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
              </div>
              <div class="col">
                  <div class="d-flex w-100 justify-content-between">
                      <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                      <small class="text-muted">${product.soldCount} artículos</small>
                  </div>
                      <p class="mb-1">${product.description}</p>
                  </div>
              </div>
          </div>
          `;
      }
      document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
    getJSONData(PRODUCTS_URL + catID + ".json").then(function(resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products;
            currentCategoryName = resultObj.data.catName;
            showCategoryName();
            showProductsList();
        }
  });

//   Escucha de Evento para modificar el Array ajustandolo a la búsqueda del usuario
//   document.getElementById("searchInput").addEventListener("input", ()=> {

//   });

  // Escucha de Evento para modificar el Array ajustandolo al Precio minimo y/o maximo que ingrese el usuario
  document.getElementById("rangeFilterCount").addEventListener("click", ()=> {
    showProductsList();
  });

  // Escucha de Evento para eliminar min y max ingresado por el usuario
  document.getElementById("clearRangeFilter").addEventListener("click", ()=> {
    min.value = null;
    max.value = null;
    showProductsList();
  });

  // Escucha de Evento para ordenar los productos en función al precio más alto primero
  document.getElementById("sortExpensive").addEventListener("click", ()=> {
    showProductsList( sortBy("expensive") );
  });

  // Escucha de Evento para ordenar los productos en función al precio más bajo primero
  document.getElementById("sortCheap").addEventListener("click", ()=> {
    showProductsList( sortBy("cheap") );
  });

  // Escucha de Evento para ordenar los productos en función a la relevancia
  document.getElementById("sortRelevance").addEventListener("click", ()=> {
    showProductsList( sortBy("relevance") );
  });
});