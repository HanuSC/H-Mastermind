"use strict";
document.addEventListener("DOMContentLoaded", () => {
  //Elementos a usar
  const colors = ["red", "green", "blue", "yellow", "purple", "orange"];
  const game = document.querySelector(".game");
  const gameFlex = document.querySelector(".game-flex");
  const picker = document.querySelector(".picker");

  //Populacion de los blisters
  for (let i = 0; i < 10; i++) {
    let game_clone = game.cloneNode(true);
    gameFlex.appendChild(game_clone);
  }
  //Populacion de los colores en el picker
  for (let i = 0; i < 6; i++) {
    picker.children[i].style.backgroundColor = colors[i];
  }

  const blisters = document.querySelectorAll(".blister");
  const checkers = document.querySelectorAll(".checker");
  let checkBtns = document.querySelectorAll(".game button");
  let duplicateCheck = document.getElementById("Duplicates");

  //otros
  let blisterColors = [4];
  let currentIndex = 0;
  let blisterindex = 0;
  let checkSwitch = false;
  let secretCode = [];
  checkBtns[0].style.display = "block";

  //* -- LOGICA --

  //Generar codigo aleatorio
  const SecretCode = {
    on_duplicates: () => {
      let code = [];
      while (code.length < 4) {
        code.push(colors[Math.floor(Math.random() * 6)]);
      }
      return code;
    },
    off_duplicates: () => {
      let code = [];
      while (code.length < 4) {
        let color = colors[Math.floor(Math.random() * 6)];
        if (!code.find((c) => c === color)) code.push(color);
      }
      return code;
    },
  };

  //Checar que el intento coincida con el codigo

  function checarIntento(intento, codigo) {
    const resultado = [];
    for (let i = 0; i < intento.length; i++) {
      intento[i] === codigo[i]
        ? resultado.push("red")
        : codigo.includes(intento[i])
        ? resultado.push("black")
        : resultado.push("white");
    }
    return resultado;
  }

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
//Checar los resultados
  function checkGame(matches) {
    if (matches.every((match) => match === "red")) {
      return true;
    } else {
      if (blisterindex > 10) return false;
    }
  }

  //* -- INTERFAZ --

  //funcion
  //render results
  function renderResult(result, code) {
    if (result) {
      checkers[10].remove()
      checkBtns[10].textContent = "YOU WON!";
      checkBtns[10].style.display = "block";
      for (let i = 0; i < 4; i++) {
        blisters[10].children[i].style.backgroundColor = code[i];
      }
    } else {
      checkers[10].remove()
      checkBtns[10].textContent = "YOU LOST!";
      checkBtns[10].style.display = "block";
      for (let i = 0; i < 4; i++) {
        blisters[10].children[i].style.backgroundColor = code[i];
      }
      
    }
  }

  //render matches
  function renderMatches(matches) {
    matches = shuffle(matches);
    for (let i = 0; i < secretCode.length; i++) {
      checkers[blisterindex].children[i].style.backgroundColor = matches[i];
    }
  }

  function insertColor(e) {
    let slot_color = e.target.style.backgroundColor;
    /* console.log(`click on ${slot_color}-slot`); */

    // reemplazar el primer color  luego de superar los 4 slots
    function asignarColor() {
      blisterColors[currentIndex] = slot_color;
      blisters[blisterindex].children[currentIndex].style.backgroundColor =
        slot_color;
      currentIndex = (currentIndex + 1) % 4;
    }

    //evento principal
    if (e.target.classList.contains("picker-slot")) {
      if (!checkSwitch) {
        if (
          !duplicateCheck.checked &&
          blisterColors.find((c) => c === slot_color)
        ) {
          e.preventDefault();
        } else {
          asignarColor();
        }
      } else {
        checkSwitch = false;
        currentIndex = 0;
        blisterindex = 0;
      }
    }
  }

  function buttonBehaviour(e) {
    if (e.target.classList.contains("check-button")) {
      if (blisterColors.length < 4) {
        console.error("Epa, llena los colores completos");
      } else {
        let intento = checarIntento(blisterColors, secretCode);
        let partida = checkGame(intento);
        renderMatches(intento);
        renderResult(partida, secretCode)
        blisterindex++;
        e.target.parentElement.nextElementSibling.querySelector(
          "button"
        ).style.display = "block";
        e.target.style.display = "none";
        console.log(blisterColors);
        blisterColors = [];
      }
    }
  }

  function startBehaviour() {
    window.alert("NEW GAME!");
    duplicateCheck.checked
      ? (secretCode = SecretCode.on_duplicates())
      : (secretCode = SecretCode.off_duplicates());
    console.log(secretCode);
  }

  //Event handler
  function eventos() {
    picker.addEventListener("click", insertColor);

    //checkButton event
    checkBtns.forEach((button) => {
      button.addEventListener("click", buttonBehaviour);
    });

    //checkbox
    duplicateCheck.addEventListener("click", startBehaviour);

    //evento de prueba
    document.querySelector(".start").addEventListener("click", startBehaviour);
  }
  /* startBehaviour(); */
  eventos();
});
