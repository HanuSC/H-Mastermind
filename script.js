"use strict;";
document.addEventListener("DOMContentLoaded", () => {
  //Objeto con la logica del juego
  const Mastermind = {
    colors: ["red", "green", "blue", "yellow", "purple", "aqua"],
    blisterColors: [],
    currentIndex: 0,
    blisterindex: 0,
    duplicatesSwitch: false,
    startSwitch: true,
    SecretCode: {
      on_duplicates: () => {
        let code = [];
        while (code.length < 4) {
          code.push(Mastermind.colors[Math.floor(Math.random() * 6)]);
        }
        return code;
      },
      off_duplicates: () => {
        let code = [];
        while (code.length < 4) {
          let color = Mastermind.colors[Math.floor(Math.random() * 6)];
          if (!code.find((c) => c === color)) code.push(color);
        }
        return code;
      },
    },
    insertarColor: (slot_color) => {
      if (!Mastermind.duplicatesSwitch) {
        if (Mastermind.blisterColors.find((c) => c === slot_color)) {
          return;
        }
        Mastermind.blisterColors[Mastermind.currentIndex] = slot_color;
        Mastermind.currentIndex = (Mastermind.currentIndex + 1) % 4;
        return;
      }
      Mastermind.blisterColors[Mastermind.currentIndex] = slot_color;
      Mastermind.currentIndex = (Mastermind.currentIndex + 1) % 4;
    },
    checarIntento: (intento, codigo) => {
      const resultado = [];
      for (let i = 0; i < intento.length; i++) {
        intento[i] === codigo[i]
          ? resultado.push("black")
          : codigo.includes(intento[i])
          ? resultado.push("white")
          : resultado.push("transparent");
      }
      return resultado;
    },
    checarPartida: (chequeoIntento, nroIntento) => {
      if (chequeoIntento.every((match) => match === "black")) {
        return true;
      }
      return false;
    },
  };
  

  //codigo secreto al cargar la pag
  let secretCode = [];
  function setCode() {
    Mastermind.duplicatesSwitch
      ? (secretCode = shuffle(Mastermind.SecretCode.on_duplicates()))
      : (secretCode = shuffle(Mastermind.SecretCode.off_duplicates()));
  }
  setCode();

  //Creacion de dinamica de elementos del juego
  const game = document.querySelector(".game");
  const gameFlex = document.querySelector(".game-flex");
  for (let i = 1; i < 10; i++) {
    //Numero de intentos a inyectar
    let game_clone = game.cloneNode(true);
    gameFlex.appendChild(game_clone);
  }
  const pickerSlots = document.querySelectorAll(".picker-slot");
  //Colores en el picker
  renderColors(Mastermind.colors, pickerSlots);
  //Mas elementos
  const blisters = document.querySelectorAll(".blister");
  const checkers = document.querySelectorAll(".checker");
  const checkButtons = document.querySelectorAll(".check-button");
  const startButton = document.querySelector(".start");
  const duplicates = document.querySelector("#Duplicates");
  const backspace = document.querySelector(".back");

  //Funciones externas al HTML
  //shuffle an array
  function shuffle(array) {
    const newArray = [...array];
    const length = newArray.length;

    for (let start = 0; start < length; start++) {
      const randomPosition = Math.floor(
        (newArray.length - start) * Math.random()
      );
      const randomItem = newArray.splice(randomPosition, 1);

      newArray.push(...randomItem);
    }

    return newArray;
  }

  //Inyectar colores del picker al blister
  function agregarColor(e) {
    Mastermind.insertarColor(e.target.style.backgroundColor);
    renderColors(
      Mastermind.blisterColors,
      blisters[Mastermind.blisterindex].children
    );
   
    if (Mastermind.blisterColors.length === 4) {
      checkButtons[Mastermind.blisterindex].style.display = "block";
    }
  }
  //inyectar colores en cada blister y checker
  function renderColors(colores, elemento) {
    for (let i = 0; i < elemento.length; i++) {
      elemento[i].style.backgroundColor = colores[i];
    }
  }
  //Alertas (Partida Ganada, Perdida, Errores)
  function alerta(texto, color) {
    let alerta = document.createElement("P");
    alerta.classList.add("alerta");
    alerta.style.backgroundColor = color;
    alerta.style.borderRadius = "5px";
    alerta.style.padding= "5px";
    alerta.style.font
    alerta.style.color = "whitesmoke";
    alerta.style.maxWidth = "280px";
    alerta.style.alignSelf = "center";
    alerta.style.textAlign = "center";
    alerta.textContent = texto;
    gameFlex.appendChild(alerta);
  }

  //revelar el codigo secreto al principio del board
  function mostrarResultados() {
    let code = blisters[0].cloneNode(true);
    code.classList.add("result");
    code.style.alignSelf = "center";
    renderColors(secretCode, code.children);
    gameFlex.appendChild(code);
  }
  //Alerta especial para partidas ganadas o perdidas
  function resultados(texto, color) {
    alerta(texto, color);
    mostrarResultados();
    checkButtons.forEach((btn) => (btn.style.display = "none"));
  }

  //Chequeo de intento
  function nextChance(e) {
    e.preventDefault();
    let intento = shuffle(Mastermind.checarIntento(
      Mastermind.blisterColors,
      secretCode
    ));

    if (Mastermind.blisterColors.length < 4) {
      alerta("Debes llenarlo completamente", "red");
      setTimeout(() => {
        document.querySelector(".alerta").remove();
      }, 3000);
      return;
    }

    //muestra de matches
    renderColors(intento, checkers[Mastermind.blisterindex].children);
    if (Mastermind.checarPartida(intento, Mastermind.blisterindex)) {
      resultados("GANASTE!", "green");
      return;
    }
    if (Mastermind.blisterindex >= 9) {
      resultados("PERDISTE!", "purple");
      return;
    }
    //siguiente intento
    Mastermind.blisterindex++;
    checkButtons[Mastermind.blisterindex].style.display = "block";
    checkButtons[Mastermind.blisterindex - 1].style.display = "none";
    Mastermind.blisterColors = [];
    Mastermind.currentIndex = 0;
  }

  //eliminar el color
  function limpiarIntento() {
    console.log("limpiando...", Mastermind.blisterindex);
    Mastermind.blisterColors = ["white", "white", "white", "white"];
    renderColors(
      Mastermind.blisterColors,
      blisters[Mastermind.blisterindex].children
    );
    Mastermind.blisterColors = [];
    Mastermind.currentIndex = 0;
  }

  //funcion para limpiar todos los elementos
  function clean() {
    document.querySelectorAll(".alerta").forEach((alerta) => alerta.remove());
    document.querySelectorAll(".result").forEach((result) => result.remove());
    Mastermind.blisterindex = 0;
    Mastermind.blisterColors = [];
    document
      .querySelectorAll(".blister-slot")
      .forEach((slot) => (slot.style.backgroundColor = "white"));
    document
      .querySelectorAll(".checker-slot")
      .forEach((slot) => (slot.style.backgroundColor = "transparent"));
    checkButtons.forEach((btn) => (btn.style.display = "none"));
  }

  //resetear la partida
  function restart() {
    clean();
    setCode();
    Mastermind.currentIndex = 0;
    console.log(secretCode)
  }

  //activar duplicados
  function enableDuplicate(e) {
    Mastermind.duplicatesSwitch = e.target.checked;
    restart();
  }

  //Eventos

  function eventos() {
    duplicates.addEventListener("click", enableDuplicate);
    startButton.addEventListener("click", restart);
    pickerSlots.forEach((slot) => slot.addEventListener("click", agregarColor));
    checkButtons.forEach((btn) => btn.addEventListener("click", nextChance));
    backspace.addEventListener("click", limpiarIntento);
  }

  eventos();
});
