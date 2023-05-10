//Variables
let titulo = document.getElementById("titulo");
let descripcion = document.getElementById("descripcion");
let botonAgregar = document.getElementById("agregar");
let espacioCards = document.getElementById("card-container");
let cartaSeleccionada;
let cartaEditada;

//Clase Task tiene atributos y metodos
class Task {
  constructor(titulo, descripcion) {
    this.titulo = titulo;
    this.descripcion = descripcion;
  }

  //Agregar Tareas al Local Storage
  agregar = (array) => {
    if (JSON.parse(localStorage.getItem("tareas")) == null) {
      localStorage.setItem("tareas", JSON.stringify(array));
    } else {
      let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
      let arrayCombined = arrayLocalStorage.concat(array);
      localStorage.setItem("tareas", JSON.stringify(arrayCombined));
    }
  };
}

//Clase UI tiene solo metodos
class UI {
  mostrarCardsLocalStorage = (array) => {
    espacioCards.innerHTML = "";
    if (array.length > 0) {
      array.forEach((item) => {
        espacioCards.innerHTML += `
            <div class='card mt-2'>
                <div class='card-header bg-dark>
                    <h3 class='tex-white'>${item.titulo}</h3>
                </div>
                <div class='card-body'>
                    <div class='form-group'>
                        <p>${item.descripcion}</p>
                    </div>
                    <div class="form-group">
                        <button class='btn btn-warning' id="editar">Edit</button>
                        <button class='btn btn-danger' id='${item.titulo}'>Delete</button>
                    </div>
                </div>
            </div>`;
      });
    }
  };

  eliminarCarta = () => {
    let array = JSON.parse(localStorage.getItem("tareas"));
    if (array.length > 0) {
      array.forEach((item, i) => {
        if (item.titulo === cartaSeleccionada) {
          array.splice(i, 1);
        }
        localStorage.setItem("tareas", JSON.stringify(array));
      });
    }
  };

  editarCarta = (card, titulo, descripcion) => {
    let arrayFromLocal = JSON.parse(localStorage.getItem("tareas"));
    if (arrayFromLocal.length > 0) {
      arrayFromLocal.forEach((item) => {
        if (item.titulo === card.tituloTask) {
          item.titulo = titulo;
          item.descripcion = descripcion;
        }
        localStorage.setItem("tareas", JSON.stringify(arrayFromLocal));
      });
    }
  };
}

//A partir que el usuario clickee el boton agregar tenemos los datos de la clase Task
//y mostramos por pantalla
botonAgregar.addEventListener("click", (e) => {
  e.preventDefault();
  let tituloTask = titulo.value;
  let descripcionTask = descripcion.value;
  let ui = new UI();
  if (e.target.innerText === "Add Task") {
    let newTask = new Task(tituloTask, descripcionTask);
    let array = [];
    array.push(newTask);
    newTask.agregar(array);
    titulo.value = "";
    descripcion.value = "";
    let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
    ui.mostrarCardsLocalStorage(arrayLocalStorage);
  } else {
    ui.editarCarta(cartaEditada, tituloTask, descripcionTask);
    let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
    ui.mostrarCardsLocalStorage(arrayLocalStorage);
    titulo.value = "";
    descripcion.value = "";
    botonAgregar.innerText = "Add Task";
  }
});

//Seleccionamos una card para luego eliminarla o editarla dependiendo el id
document.addEventListener("click", (e) => {
  cartaSeleccionada = e.target.id;
  let ui = new UI();
  ui.eliminarCarta();
  let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
  ui.mostrarCardsLocalStorage(arrayLocalStorage);
  if (e.target.id === "editar") {
    let tituloCarta =
      e.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].data.replace(
        "\n",
        ""
      );
    let descripcionCarta =
      e.target.parentElement.parentElement.childNodes[1].childNodes[1]
        .innerText;
    titulo.value = tituloCarta.trim();
    descripcion.value = descripcionCarta;
    botonAgregar.innerText = "Edit";
    cartaEditada = {
      tituloTask: tituloCarta.trim(),
      descripcionTask: descripcionCarta,
    };
  }
});

//Al cargar la pagina mostramos las cartas de las tareas si es que en el localStorage estan
//guardadas
window.addEventListener("load", () => {
  let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
  let ui = new UI();
  ui.mostrarCardsLocalStorage(arrayLocalStorage);
});
