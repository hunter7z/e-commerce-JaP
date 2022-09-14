const productID = localStorage.getItem("productID");
let product;

function showProduct() {
    let htmlContentToAppend = `
        <div class="p-4">
            <h2>${product.name}</h2>
        </div>
        <div class="row border-top">
            <div class="col">
                
            </div>
        </div>
    `;

    document.getElementById("product-container").innerHTML = htmlContentToAppend;
}

document.addEventListener('DOMContentLoaded', ()=> {
    getJSONData(PRODUCT_INFO_URL + productID + ".json").then(function(resultObj) {
        if (resultObj.status === "ok") {
            console.log(resultObj.data);
            product = resultObj.data;
            showProduct();
        }
  });
});