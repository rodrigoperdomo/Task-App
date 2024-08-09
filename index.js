//Variables
let titulo = document.getElementById("titulo");
let descripcion = document.getElementById("descripcion");
let botonAgregar = document.getElementById("agregar");
let espacioCards = document.getElementById("card-container");
let cartaSeleccionada;
let cartaEditada;
let items = JSON.parse(localStorage.getItem("tareas"));
let id = items?.length >0 ? parseInt(items[items.length-1].id+1) : 1

//Clase Task tiene atributos y metodos
class Task {
  constructor(id,titulo, descripcion) {
    this.id = id;
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
    if (array && array.length > 0) {
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
                        <button class='btn btn-warning' id='${item.id}'>Edit</button>
                        <button class='btn btn-danger' id='${item.id}'>Delete</button>
                    </div>
                </div>
            </div>`;
      });
    }
  };

  eliminarCarta = (cartaSeleccionada) => {
    let arrayFromLocalStorage = JSON.parse(localStorage.getItem("tareas"));
    arrayFromLocalStorage.forEach((item,i)=>{
      if(item.id == cartaSeleccionada){
        arrayFromLocalStorage.splice(i,1)
      }
    })
    localStorage.setItem("tareas",JSON.stringify(arrayFromLocalStorage))
    this.mostrarCardsLocalStorage(arrayFromLocalStorage)
  };

  editarCarta = () => {
    let arrayFromLocalStorage = JSON.parse(localStorage.getItem("tareas"));
    arrayFromLocalStorage.forEach(item=>{
      if(item.id==cartaEditada.id){
        item.titulo = titulo.value
        item.descripcion = descripcion.value
      }
    })
    localStorage.setItem("tareas",JSON.stringify(arrayFromLocalStorage))
  }
};


//A partir que el usuario clickee el boton agregar tenemos los datos de la clase Task
//y mostramos por pantalla
botonAgregar.addEventListener("click", (e) => {
  e.preventDefault();
  let tituloTask = titulo.value;
  let descripcionTask = descripcion.value;
  let newId = id ++;
  let ui = new UI();
  if (e.target.innerText === "Add Task") {
    let newTask = new Task(newId,tituloTask, descripcionTask);
    let array = [];
    array.push(newTask);
    newTask.agregar(array);
    titulo.value = "";
    descripcion.value = "";
    let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
    ui.mostrarCardsLocalStorage(arrayLocalStorage);
  } else {
    ui.editarCarta(cartaSeleccionada);
    let arrEditada = JSON.parse(localStorage.getItem("tareas"))
    ui.mostrarCardsLocalStorage(arrEditada)
    titulo.value = ""
    descripcion.value = ""
    botonAgregar.innerText="Add Task"
  }
});

//Seleccionamos una card para luego eliminarla o editarla dependiendo el id
document.addEventListener("click", (e) => {
  let texto = e.target.innerText
  let ui = new UI();
  cartaSeleccionada = e.target.id;
  if(texto === "Delete"){
    ui.eliminarCarta(cartaSeleccionada)
  }else{
    let arrayFromLocal = JSON.parse(localStorage.getItem("tareas"));
    let cartaSeleccionadaFormulario =  arrayFromLocal?.length > 0 && arrayFromLocal.find(it => it.id ==  cartaSeleccionada)
    if(cartaSeleccionadaFormulario){
      titulo.value = cartaSeleccionadaFormulario.titulo;
      descripcion.value = cartaSeleccionadaFormulario.descripcion;
      cartaEditada = cartaSeleccionadaFormulario
      botonAgregar.innerText = "Edit Task";
    }
  }
});

//Al cargar la pagina mostramos las cartas de las tareas si es que en el localStorage estan
//guardadas
window.addEventListener("load", () => {
  let arrayLocalStorage = JSON.parse(localStorage.getItem("tareas"));
  titulo.value = ""
  descripcion.value = ""
  cartaSeleccionada = null;
  cartaEditada = null;
  let ui = new UI();
  if(arrayLocalStorage && arrayLocalStorage.length>0){
    ui.mostrarCardsLocalStorage(arrayLocalStorage);
  }
});
