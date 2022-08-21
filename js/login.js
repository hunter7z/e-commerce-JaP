function runPageWithGoogle() {
    sessionStorage.setItem("hasPageRunBefore", true);
    window.location = "index.html";
}

document.getElementById("userEmail").addEventListener("keydown", ()=> {
    const email = document.getElementById("userEmail");
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
});
document.getElementById("userPass").addEventListener("keydown", ()=> {
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
        document.getElementById("userEmail").classList.add("is-invalid")
        login = false;
    }
    if(!pass){
        document.getElementById("userPass").classList.add("is-invalid")
        login = false;
    }
    if(login){
        sessionStorage.setItem("hasPageRunBefore", true);
        window.location = "index.html";
    }
});