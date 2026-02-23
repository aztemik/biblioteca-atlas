paginas = [];

const Archivos = [
  // Géneros
  "/pages/autores/autor-alan-moore.html",
  "/pages/autores/autor-bram-stoker.html",
  "/pages/autores/autor-grant-morrison.html",
  "/pages/autores/autor-hp-lovecraft.html",
  "/pages/autores/autor-mary-shelley.html",
  "/pages/autores/autor-rowling.html",
  "/pages/autores/autor-stephen-king.html",
  "/pages/autores/autor-tolkien.html",
  "/pages/autores/frank-herbert.html",
  "/pages/autores/index.html",
  "/pages/autores/isaac-asimov.html",
  "/pages/autores/william-gibson.html",
  
  // Libros
  "/pages/generos/ciencia-ficcion.html",
  "/pages/generos/comic.html",
  "/pages/generos/fantasia.html",
  "/pages/generos/terror.html",

  // Autores 
  "/pages/libros/all-star-superman.html",
  "/pages/libros/batman-killing-joke.html",
  "/pages/libros/dracula.html",
  "/pages/libros/dune.html",
  "/pages/libros/el-senor-de-los-anillos.html",
  "/pages/libros/frankenstein.html",
  "/pages/libros/fundacion.html",
  "/pages/libros/harry-potter-piedra-filosofal.html",
  "/pages/libros/index.html",
  "/pages/libros/it.html",
  "/pages/libros/la-llamada-de-cthulhu.html",
  "/pages/libros/neuromante.html",

];

async function leerArchivos() {
  for (let i = 0; i < Archivos.length; i++) {
    let response = await fetch(Archivos[i]);
    let htmlText = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlText, "text/html");

    let titulo = doc.querySelector("title")?.innerText || Archivos[i];
    let palabras = doc.querySelector('meta[name="keywords"]')?.content || "";

    paginas[i] = [Archivos[i], titulo, palabras];
  }
}

// logica del buscador
function normalizar(txt) {
  return (txt || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .trim();
}

function filtrarPaginas(query) {
  const q = normalizar(query);
  if (!q) return [];

  return paginas.filter(([url, titulo, palabras]) => {
    const donde = normalizar(url + " " + titulo + " " + palabras);
    return donde.includes(q);
  });
}

function asegurarContenedorResultados() {
  let box = document.getElementById("searchResults");
  if (!box) {
    const form = document.querySelector('form[role="search"]');
    box = document.createElement("div");
    box.id = "searchResults";
    box.className = "mt-3";
    form?.parentNode?.appendChild(box);
  }
  return box;
}

function mostrarResultados(items, query) {
  const box = asegurarContenedorResultados();
  const q = normalizar(query);

  // caso donde el usuario no escribe nada y da en enter
  if (!q) {
    box.innerHTML = `
      <div class="alert alert-danger mb-0">
        Debes escribir algo para buscar.
      </div>
    `;
    return;
  }

  // caso donde no hay resultados
  if (items.length === 0) {
    box.innerHTML = `
      <div class="alert alert-warning mb-0">
        No se encontraron resultados para <strong>${query}</strong>.
      </div>
    `;
    return;
  }

  // cado donde hay resultados
  const links = items
    .slice(0, 15)
    .map(([url, titulo, palabras]) => {
      return `
        <a href="${url}" class="list-group-item list-group-item-action">
          <div class="fw-semibold">${titulo}</div>
          <div class="small text-muted">${palabras}</div>
        </a>
      `;
    })
    .join("");

  box.innerHTML = `
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white">
        Resultados para <strong>${query}</strong>
        <span class="text-muted">(${items.length})</span>
      </div>
      <div class="list-group list-group-flush">${links}</div>
    </div>
  `;
}


document.addEventListener("DOMContentLoaded", async () => {
  await leerArchivos();

  const input = document.getElementById("search");
  const form = document.querySelector('form[role="search"]');

  const ejecutarBusqueda = () => {
    const q = input.value;
    const resultados = filtrarPaginas(q);
    mostrarResultados(resultados, q);
  };

  // Buscar con Enter
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    ejecutarBusqueda();
  });

  // Búsqueda “en vivo” mientras se escribe
  input?.addEventListener("input", ejecutarBusqueda);
});