function runPageWithGoogle(res) {
    console.log(res.profileObj);
    window.localStorage.setItem("hasPageRunBefore", true);
    // window.location = "index.html";
}

document.getElementById("userEmail").addEventListener("input", ()=> {
    const email = document.getElementById("userEmail");
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
});
document.getElementById("userPass").addEventListener("input", ()=> {
    const pass = document.getElementById("userPass");
    pass.classList.remove("is-invalid");
    pass.classList.add("is-valid");
});

document.getElementById("loginBtn").addEventListener("click", ()=> {
    document.querySelectorAll('input').forEach(element => element.classList.remove("is-invalid"));
    
    const email = document.getElementById("userEmail").value.trim();
    const pass = document.getElementById("userPass").value.trim();
    
    let login = true;
    if(!email){
        document.getElementById("userEmail").classList.add("is-invalid");
        login = false;
    }
    if(!pass){
        document.getElementById("userPass").classList.add("is-invalid");
        login = false;
    }
    if(login){
        window.localStorage.setItem("hasPageRunBefore", true);
        window.localStorage.setItem("userDesignation", email);
        window.location = "index.html";
    }
});