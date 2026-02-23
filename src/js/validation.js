const form = document.getElementById("loginForm");
const email = document.getElementById("emailUTP");
const password = document.getElementById("password");
const matricula = document.getElementById("matricula");

const emailError = document.getElementById("emailError");
const passError = document.getElementById("passError");
const matError = document.getElementById("matError");

// aplica mensaje personalizado
function setFieldValidity(input, message, feedbackEl) {
  input.setCustomValidity(message || "");
  // validation general para validaciones no pensadas
  if (feedbackEl) feedbackEl.textContent = message || "Campo inválido.";
  // Forzar estilos Bootstrap según validez
  input.classList.toggle("is-invalid", !input.checkValidity());
  input.classList.toggle("is-valid", input.checkValidity());
}

// Validación del correo UTP
function validateEmail() {
  email.setCustomValidity(""); // reset

  if (email.validity.valueMissing) {
    setFieldValidity(email, "El correo es obligatorio.", emailError);
    return false;
  }

  if (email.validity.typeMismatch) {
    setFieldValidity(
      email,
      "Escribe un correo válido (formato general).",
      emailError,
    );
    return false;
  }

  if (email.validity.patternMismatch) {
    setFieldValidity(
      email,
      "Correo inválido. Debe ser: utp + 6 dígitos + @alumno.utpuebla.edu.mx",
      emailError,
    );
    return false;
  }

  setFieldValidity(email, "", emailError);
  return true;
}

// Validación de contraseña (longitud mínima)
function validatePassword() {
  password.setCustomValidity("");

  if (password.validity.valueMissing) {
    setFieldValidity(password, "La contraseña es obligatoria.", passError);
    return false;
  }

  if (password.validity.tooShort) {
    setFieldValidity(
      password,
      "La contraseña debe tener mínimo 6 caracteres.",
      passError,
    );
    return false;
  }

  setFieldValidity(password, "", passError);
  return true;
}

// Validación numérica + longitud (matrícula)
function validateMatricula() {
  matricula.setCustomValidity("");

  if (matricula.validity.valueMissing) {
    setFieldValidity(matricula, "La matrícula es obligatoria.", matError);
    return false;
  }

  if (matricula.validity.tooShort || matricula.validity.tooLong) {
    setFieldValidity(
      matricula,
      "La matrícula debe tener exactamente 7 dígitos.",
      matError,
    );
    return false;
  }

  if (matricula.validity.patternMismatch) {
    setFieldValidity(
      matricula,
      "Solo se permiten números (7 dígitos).",
      matError,
    );
    return false;
  }

  setFieldValidity(matricula, "", matError);
  return true;
}

// Eventos "input" para reaccion en vivo
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
matricula.addEventListener("input", validateMatricula);

// evita el envío si hay errores y "navegar" si todo ok
form.addEventListener("submit", (e) => {
  e.preventDefault(); // siempre bloqueamos, y solo redirigimos si todo está bien

  const okEmail = validateEmail();
  const okPass = validatePassword();
  const okMat = validateMatricula();

  // Si algo falla, no navegamos
  if (!(okEmail && okPass && okMat)) return;

  window.location.href = "home.html";
});
