if (localStorage.getItem("email") === null) {
  window.location = "login.html";
} else {
  // Creando <li> para el email del usuario en el navbar
  document.addEventListener("DOMContentLoaded", () => {
    let email = localStorage.getItem("email");
    let li = `
    <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle active-white" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      ${email}
    </a>
    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="userDropdown">
      <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
      <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
      <li><a class="dropdown-item" href="login.html" onclick="localStorage.removeItem('email')">Cerrar sessión</a></li>
    </ul>
    </li>
    `;
    document.querySelectorAll(".nav-item")[3].innerHTML = li;
  });
}