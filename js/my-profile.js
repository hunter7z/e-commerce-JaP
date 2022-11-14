const firstName = document.getElementById("first-name");
const secondName = document.getElementById("second-name");
const firstLastname = document.getElementById("first-lastname");
const secondLastname = document.getElementById("second-lastname");
const email = document.getElementById("email");
const tel = document.getElementById("tel");
const fileInput = document.getElementById("img-file");
const imgContainer = document.getElementById("userImage");
const saveChanges = document.getElementById("save-changes");
const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

function changeImage() {
  const fr = new FileReader();
  if (
    fileInput.files[0].type != "image/png" &&
    fileInput.files[0].type != "image/jpeg"
    ) {
    fileInput.classList.add("is-invalid");
  } else {
    fileInput.classList.remove("is-invalid");
    fr.readAsDataURL(fileInput.files[0]);
    // Escucha para FileReder
    fr.addEventListener("load", () => {
      const url = fr.result;
      imgContainer.src = url;
      localStorage.setItem("userImage", url);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let emailValue = localStorage.getItem("email");
  // Precargando los valores en el Localstorage
  let names = JSON.parse(localStorage.getItem("names")) || [];
  let lastnames = JSON.parse(localStorage.getItem("lastnames")) || [];


  firstName.value  = names[0] || "";
  secondName.value = names[1] || "";
  firstLastname.value  = lastnames[0] || "";
  secondLastname.value = lastnames[1] || "";
  imgContainer.src = localStorage.getItem("userImage") || "/img/img_perfil.png";
  tel.value = localStorage.getItem("tel") || "";
  email.value = localStorage.getItem("email");
  
  // Añadiendo escucha de validar los campos
  saveChanges.addEventListener("click", () => {
    let isValid = true;

    if (firstName.value.trim()) {
      firstName.classList.add("is-valid");
    } else {
      firstName.classList.add("is-invalid");
      isValid = false;
    }

    if (firstLastname.value.trim()) {
      firstLastname.classList.add("is-valid");
    } else {
      firstLastname.classList.add("is-invalid");
      isValid = false;
    }

    if (email.value.trim() && validEmail.test(email.value)) {
      email.classList.add("is-valid");
    } else {
      email.classList.add("is-invalid");
      isValid = false;
    }

    if (tel.value.trim() && Number(tel.value)) {
      tel.classList.add("is-valid");
    } else {
      tel.classList.add("is-invalid");
      isValid = false;
    }

    // Darle feedback al usuario en caso de que todos los campos necesarios estén correctos
    // Guardar en el LS los valores ingresados
    if(isValid) {
      localStorage.setItem("names", JSON.stringify([firstName.value, secondName.value]));
      localStorage.setItem("lastnames", JSON.stringify([firstLastname.value, secondLastname.value]));
      localStorage.setItem("email", email.value);
      localStorage.setItem("tel", tel.value);
      
      document.getElementById("isValid").classList.add("alert-success");
      document.getElementById("isValid").classList.remove("d-none");
      document.getElementById("isValid").classList.add("d-block");
      document.getElementById("isValid").classList.add("show");
      
      setTimeout(() => {
        document.getElementById("isValid").classList.add("d-none");
        document.getElementById("isValid").classList.remove("d-block");
        document.getElementById("isValid").classList.remove("show");
      }, 2000);
      
      // Cambia la imagen del usuario
      changeImage();
    }

    // Añadiendo escuchas para darle feedback al usuario
    firstName.addEventListener("input", () => {
      firstName.classList.remove("is-invalid");
      firstName.classList.add("is-valid");
    });

    email.addEventListener("input", () => {
      email.classList.remove("is-invalid");
      email.classList.add("is-valid");
    });

    firstLastname.addEventListener("input", () => {
      firstLastname.classList.remove("is-invalid");
      firstLastname.classList.add("is-valid");
    });

    tel.addEventListener("input", () => {
      tel.classList.remove("is-invalid");
      tel.classList.add("is-valid");
    });
  });

  fileInput.addEventListener("change", () => {

  })
});