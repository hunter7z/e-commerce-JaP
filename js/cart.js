const userID = localStorage.getItem("userID");
let currentList = [];

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(CART_INFO_URL + userID + ".json").then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentList.push(resultObj.data.articles[0]);
    }
  });
})