"use strict";
//*INTERFAZ
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

//Otros elementos luego de la populacion
const blisters = document.querySelectorAll(".blister");
let checkBtns = document.querySelectorAll(".game button");
let duplicateCheck = document.getElementById("Duplicates");

// 
let blisterColors = [4];
let currentIndex = 0;
let blisterindex = 0;
let checkSwitch = false;
checkBtns[0].style.display = https://github.com/HanuSC/Mastermind.git"block";

eventos();
//Eventos
function eventos() {
  picker.addEventListener("click", insertColor);
  //checkButton event
  checkBtns.forEach((button) => {
    button.addEventListener("click", buttonBehaviour);
  });

  //checkbox
  duplicateCheck.addEventListener("click", () => {
    console.log(`Duplicados: ${duplicateCheck.checked}`);
  });
}

//funcion
function insertColor(e) {
  console.log("click on color-picker");
  function asignarColor() {
    blisterColors[currentIndex] = e.target.style.backgroundColor;
    blisters[blisterindex].children[currentIndex].style.backgroundColor =
      e.target.style.backgroundColor;
    currentIndex = (currentIndex + 1) % 4;
  }

  if (e.target.classList.contains("picker-slot")) {
    if (!checkSwitch) {
      if (
        !duplicateCheck.checked &&
        blisterColors.find((color) => color === e.target.style.backgroundColor)
      ) {
        e.preventDefault();
      } else {
        asignarColor();
      }
    } else {
      checkSwitch = false;
      currentIndex = 0;
    }
  }
}

function buttonBehaviour(e) {
  if (e.target.classList.contains("check-button")) {
    if (blisterColors.length < 4) {
      console.error("Epa, llena los colores completos");
    } else {
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

//* LOGICA
