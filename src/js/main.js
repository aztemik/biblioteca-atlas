const rutas = [
  { ruta: "/index.html", nombre: "Inicio", id: "pag" },
  {
    ruta: "/pages/generos/ciencia-ficcion.html",
    nombre: "Ciencia Ficción",
    id: "pag1",
  },
  { ruta: "/pages/libros/dune.html", nombre: "Dune", id: "pag11" },
  {
    ruta: "/pages/autores/frank-herbert.html",
    nombre: "Frank Herbert",
    id: "pag111",
  },
  { ruta: "/pages/libros/fundacion.html", nombre: "Fundación", id: "pag12" },
  {
    ruta: "/pages/autores/isaac-asimov.html",
    nombre: "Isaac Asimov",
    id: "pag121",
  },
  { ruta: "/pages/libros/neuromante.html", nombre: "Neuromante", id: "pag13" },
  {
    ruta: "/pages/autores/william-gibson.html",
    nombre: "William Gibson",
    id: "pag131",
  },
  { ruta: "/pages/generos/comic.html", nombre: "Cómic", id: "pag2" },
  {
    ruta: "/pages/libros/batman-killing-joke.html",
    nombre: "Batman: Killing Joke",
    id: "pag21",
  },
  {
    ruta: "/pages/autores/autor-alan-moore.html",
    nombre: "Alan Moore",
    id: "pag211",
  },
  { ruta: "/pages/libros/all-star-superman.html", nombre: "All-Star Superman", id: "pag22" },
  {
    ruta: "/pages/autores/autor-grant-morrison.html",
    nombre: "Grant Morrison",
    id: "pag221",
  },
  { ruta: "/pages/generos/fantasia.html", nombre: "Fantasía", id: "pag3" },
  {
    ruta: "/pages/libros/el-senor-de-los-anillos.html",
    nombre: "El Señor de los Anillos",
    id: "pag31",
  },
  {
    ruta: "/pages/autores/autor-tolkien.html",
    nombre: "J.R.R. Tolkien",
    id: "pag311",
  },
  {
    ruta: "/pages/libros/harry-potter-piedra-filosofal.html",
    nombre: "Harry Potter y la piedra filosofal",
    id: "pag32",
  },
  {
    ruta: "/pages/autores/autor-rowling.html",
    nombre: "J.K. Rowling",
    id: "pag321",
  },
  { ruta: "/pages/generos/terror.html", nombre: "Terror", id: "pag4" },
  { ruta: "/pages/libros/dracula.html", nombre: "Drácula", id: "pag41" },
  {
    ruta: "/pages/autores/autor-bram-stoker.html",
    nombre: "Bram Stoker",
    id: "pag411",
  },
  {
    ruta: "/pages/libros/frankenstein.html",
    nombre: "Frankenstein",
    id: "pag42",
  },
  {
    ruta: "/pages/autores/autor-mary-shelley.html",
    nombre: "Mary Shelley",
    id: "pag421",
  },
  { ruta: "/pages/libros/it.html", nombre: "It", id: "pag43" },
  {
    ruta: "/pages/autores/autor-stephen-king.html",
    nombre: "Stephen King",
    id: "pag431",
  },
  {
    ruta: "/pages/libros/la-llamada-de-cthulhu.html",
    nombre: "La llamada de Cthulhu",
    id: "pag44",
  },
  {
    ruta: "/pages/autores/autor-hp-lovecraft.html",
    nombre: "H.P. Lovecraft",
    id: "pag441",
  },
  { ruta: "/pages/autores/index.html", nombre: "Autores", id: "pag5" },
  { ruta: "/pages/libros/index.html", nombre: "Libros", id: "pag6" },
];

console.table(rutas);


const breadcrumb = document.querySelector(".bc");
const lista = document.createElement("ol");
lista.classList.add("breadcrumb");

let ruta_buscar = breadcrumb.id;

while (ruta_buscar.length >= 3) {
  const rutaActual = rutas.find((ruta) => ruta.id === ruta_buscar);

  if (!rutaActual) break;

  const li = document.createElement("li");
  li.classList.add("breadcrumb-item");

  const a = document.createElement("a");
  a.href = rutaActual.ruta;
  a.textContent = rutaActual.nombre;

  if (ruta_buscar === breadcrumb.id) {
    a.removeAttribute("href");
    li.classList.add("active");
  }

  li.append(a);
  lista.prepend(li);

  console.table(rutaActual);
  
  ruta_buscar = ruta_buscar.slice(0, -1);
}

breadcrumb.append(lista);
