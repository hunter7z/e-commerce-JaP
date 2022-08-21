let catID = localStorage.getItem("catID");
let currentCategoryName = "";
let currentProductsArray = [];

function showCategoryName() {
    let content = `Verás aquí todos los productos de la categoria ${currentCategoryName}.`;
    document.querySelector(".lead").innerHTML = content;
}

function showProductsList() {
    let htmlContentToAppend = "";
    
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];
        
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

        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    getJSONData(PRODUCTS_URL + catID + ".json").then(function(resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products;
            currentCategoryName = resultObj.data.catName
            showCategoryName();
            showProductsList();
        }
  })
});