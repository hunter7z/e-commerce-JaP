if(window.localStorage.getItem("userDesignation") === null) {
    window.location = "login.html";
} else {
    document.addEventListener("DOMContentLoaded", ()=> {
        let userDesignation = window.localStorage.getItem("userDesignation");
        let li = `
            <a class="nav-link active" href="#">${userDesignation}</a>
        `;
        document.querySelectorAll(".nav-item")[3].innerHTML = li;
    })
}