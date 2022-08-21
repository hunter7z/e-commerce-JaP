document.getElementById("loginBtn").addEventListener("click", ()=> {
    document.querySelectorAll('input').forEach(element => element.classList.remove("is-invalid"));
    
    const email = document.getElementById("userEmail").value.trim();
    const pass = document.getElementById("userPass").value.trim();
    
    let login = true;
    if(!email){
        document.querySelector("[type='email']").classList.add("is-invalid")
        login = false;
    }
    if(!pass){
        document.querySelector("[type='password']").classList.add("is-invalid")
        login = false;
    }
    if(login){
        sessionStorage.setItem("hasPageRunBefore", true);
        window.location = "index.html" ;
    }
})