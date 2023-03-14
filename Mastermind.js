"use strict";
document.addEventListener('DOMContentLoaded', () => {

//* -- INTERFAZ --

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
let checkBtns = document.querySelectorAll(".game button");
let duplicateCheck = document.getElementById("Duplicates");

//otros
let blisterColors = [4];
let currentIndex = 0;
let blisterindex = 0;
let checkSwitch = false;
checkBtns[0].style.display = "block";

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
  let slot_color = e.target.style.backgroundColor;
  console.log(`click on ${slot_color}-slot`);

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

//* -- LOGICA --



})
