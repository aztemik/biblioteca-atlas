export const norm = (v) => (v ?? "").toString().trim();


/* establecemos reglas */
export const rules = {
  required: (v) => norm(v).length > 0,
  minLength: (v, n) => norm(v).length >= n,
  numeric: (v) => /^-?\d+(\.\d+)?$/.test(norm(v)),
};

/* Mostrar errores */
export const setFieldError = (input, message) => {
  input.classList.add("is-invalid");

  // Para input-group, buscamos/creamos un invalid-feedback cerca
  let fb =
    input.closest(".input-group")?.querySelector(".invalid-feedback") ||
    input.parentElement?.querySelector(".invalid-feedback");

  if (!fb) {
    fb = document.createElement("div");
    fb.className = "invalid-feedback";
    (input.closest(".input-group") || input.parentElement).appendChild(fb);
  }

  fb.textContent = message;
};

export const clearFieldError = (input) => {
  input.classList.remove("is-invalid");
  const fb =
    input.closest(".input-group")?.querySelector(".invalid-feedback") ||
    input.parentElement?.querySelector(".invalid-feedback");
  if (fb) fb.textContent = "";
};

