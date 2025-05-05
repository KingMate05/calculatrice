const screen = document.getElementById("result");
const save_result = document.getElementById("save_result_container");
const touches = document.querySelectorAll(".touche");
const toucheEquals = document.getElementById("equals");
const toucheAC = document.getElementById("ac");
const toucheDelete = document.getElementById("delete");
const clockIcon = document.querySelector(".fa-clock-rotate-left");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearHistory");
const leftArrow = document.querySelector(".fa-arrow-left");
const rightArrow = document.querySelector(".fa-arrow-right");

const clickSound = new Audio("click.mp3");

let history = JSON.parse(localStorage.getItem("calcul_history")) || [];
let historyIndex = history.length - 1;

let errorMode = false;
let afterEqual = false;

function resultat_sauvgarder(expression, result) {
  if (result && result !== "Error") {
    const entry = { expression, result };
    history.push(entry);
    localStorage.setItem("calcul_history", JSON.stringify(history));
    historyIndex = history.length - 1;
    afficherDernierCalcul(entry);
  }
}

function afficherDernierCalcul(entry) {
  save_result.textContent = `${entry.expression} = ${entry.result}`;
}

touches.forEach((touche) => {
  touche.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    let value = touche.textContent;

    // Conversion des emojis en vrais opérateurs mathématiques
    const conversion = {
      "➕": "+",
      "➖": "-",
      "✖": "*",
      "➗": "/",
      "%": "%",
      ",": ".",
    };
    value = conversion[value] || value;

    if (value === "AC") {
      screen.textContent = "";
      save_result.textContent = "";
      errorMode = false;
      afterEqual = false;
      return;
    }

    if (value === "❌") {
      screen.textContent = screen.textContent.slice(0, -1);
      return;
    }

    if (value === "=") {
      try {
        const expression = screen.textContent;
        const result = eval(expression);
        screen.textContent = result;
        resultat_sauvgarder(expression, result);
        errorMode = false;
        afterEqual = true;
      } catch {
        screen.textContent = "Error";
        errorMode = true;
        afterEqual = false;
      }
      return;
    }

    if (afterEqual) {
      if (/[0-9]/.test(value)) {
        screen.textContent = value;
        afterEqual = false;
      } else if ("+-*/".includes(value)) {
        screen.textContent += value;
        afterEqual = false;
      } else {
        return;
      }
      return;
    }

    if (errorMode) {
      if (/[0-9]/.test(value)) {
        screen.textContent = value;
        errorMode = false;
      } else {
        return;
      }
      return;
    }

    screen.textContent += value;
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (screen.textContent === "Error") {
    screen.textContent = "";
    errorMode = false;
  }

  if (e.code === "Numpad0" && e.getModifierState("Shift")) {
    screen.textContent += "00";
    return;
  }

  if ("0123456789/+-*".includes(key)) {
    if (afterEqual && /[0-9]/.test(key)) {
      screen.textContent = key;
      afterEqual = false;
    } else if (afterEqual && "+-*/".includes(key)) {
      screen.textContent += key;
      afterEqual = false;
    } else if (errorMode && /[0-9]/.test(key)) {
      screen.textContent = key;
      errorMode = false;
    } else if (!errorMode) {
      screen.textContent += key;
    }
  } else if (key === "." || key === ",") {
    if (!errorMode) screen.textContent += ".";
  } else if (key === "Backspace") {
    screen.textContent = screen.textContent.slice(0, -1);
  } else if (key === "Enter" || key === "=") {
    try {
      const expression = screen.textContent;
      const result = eval(expression);
      screen.textContent = result;
      resultat_sauvgarder(expression, result);
      errorMode = false;
      afterEqual = true;
    } catch {
      screen.textContent = "Error";
      errorMode = true;
      afterEqual = false;
    }
  } else if (key === " " || key === "Escape") {
    screen.textContent = "";
    save_result.textContent = "";
    errorMode = false;
    afterEqual = false;
  } else if (key === "h" || key === "H") {
    historyPanel.classList.toggle("open");
    afficherHistorique();
  } else if (key === "ArrowLeft") {
    if (history.length > 0 && historyIndex > 0) {
      historyIndex--;
      const entry = history[historyIndex];
      screen.textContent = entry.result;
      afficherDernierCalcul(entry);
    }
  } else if (key === "ArrowRight") {
    if (history.length > 0 && historyIndex < history.length - 1) {
      historyIndex++;
      const entry = history[historyIndex];
      screen.textContent = entry.result;
      afficherDernierCalcul(entry);
    }
  }
});

clockIcon.addEventListener("click", () => {
  historyPanel.classList.toggle("open");
  afficherHistorique();
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("calcul_history");
  historyList.innerHTML = "";
  history = [];
  historyIndex = -1;
});

function afficherHistorique() {
  historyList.innerHTML = "";
  const savedHistory = JSON.parse(localStorage.getItem("calcul_history")) || [];

  savedHistory
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">${item.result}</div>
    `;
      li.addEventListener("click", () => {
        screen.textContent = item.result;
        afficherDernierCalcul(item);
        historyPanel.classList.remove("open");
      });
      historyList.appendChild(li);
    });
}

document.addEventListener("click", (e) => {
  const isInsidePanel = historyPanel.contains(e.target);
  const isClockIcon = clockIcon.contains(e.target);

  if (!isInsidePanel && !isClockIcon) {
    historyPanel.classList.remove("open");
  }
});

leftArrow.addEventListener("click", () => {
  if (history.length === 0 || historyIndex <= 0) return;
  historyIndex--;
  const entry = history[historyIndex];
  screen.textContent = entry.result;
  afficherDernierCalcul(entry);
});

rightArrow.addEventListener("click", () => {
  if (history.length === 0 || historyIndex >= history.length - 1) return;
  historyIndex++;
  const entry = history[historyIndex];
  screen.textContent = entry.result;
  afficherDernierCalcul(entry);
});
