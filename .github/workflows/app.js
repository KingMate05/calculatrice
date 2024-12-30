let displayValue = "";

function uptade_display() {
  const display = document.getElementById("dash");
  display.textContent = displayValue || "0";
}

function number(num) {
  displayValue += num;
}

function number_one() {
  if (display.textContent === "0") {
    display.textContent = "1";
    result = "1";
  } else {
    result = result + "1";
    display.textContent = result;
  }
}
function number_two() {}
function number_three() {}
function number_four() {}
function number_five() {}
function number_six() {}
function number_seven() {}
function number_eight() {}
function number_nine() {}
function number_reset() {
  display.textContent = "0";
}
function number_del() {}
function number_mod() {}
function number_div() {}
function number_mult() {}
function number_sub() {}
function number_add() {
  if (display.textContent === "0") {
    display.textContent = "+";
    result = "+";
  } else {
    result = result + "+";
    display.textContent = result;
  }
}
function number_zero() {}
function number_period() {}
function number_equal() {
  let calc = result.split(/([=+-/%])/);
  let signe = calc.filter((_, index) => index % 2 === 1);
  let r = 0;
  let num = "";
  let cpt = 0;
  for (let sign of signe) {
    if (sign == "+") {
      for (let nbr of calc) {
        if (nbr != "+") {
          num += nbr;
          console.log(num);
          nbrInt = parseInt(num);
          console.log(nbrInt);
          r += nbrInt;
          num = 0;
        } else {
          nbrInt = parseInt(num);
          console.log(nbrInt);
          r += nbrInt;
          num = 0;
        }
        cpt++;
      }
    }
  }
  display.textContent = r;
}
