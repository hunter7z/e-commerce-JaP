const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

function runPageWithGoogle(res) {
  // Debo utilizar el parametro que devuelve esta función
  // Para mostrar el usuario en el navbar
  // Especificamente res.credential y parciarlo con una libreria
  localStorage.setItem("email", "Tu Email");
  window.location = "index.html";
}

document.getElementById("userEmail").addEventListener("input", () => {
  const email = document.getElementById("userEmail");
  if (validEmail.test(email.value)) {
    email.classList.add("is-valid");
    email.classList.remove("is-invalid");
  }
});
document.getElementById("userPass").addEventListener("input", () => {
  const pass = document.getElementById("userPass");
  pass.classList.remove("is-invalid");
  pass.classList.add("is-valid");
});

document.getElementById("loginBtn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(element => element.classList.remove("is-invalid"));

  const email = document.getElementById("userEmail").value.trim();
  const pass = document.getElementById("userPass").value.trim();

  let login = true;
  if (!email || !validEmail.test(email)) {
    document.getElementById("userEmail").classList.add("is-invalid");
    login = false;
  }
  if (!pass) {
    document.getElementById("userPass").classList.add("is-invalid");
    login = false;
  }
  if (login) {
    localStorage.setItem("email", email);
    window.location = "index.html";
  }
});
