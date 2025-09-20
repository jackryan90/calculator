function add(a, b) {
  // Adds two numbers.
  return a + b;
}

function subtract(a, b) {
  // Subtracts two numbers.
  return a - b;
}

function multiply(a, b) {
  // Multiplies two numbers.
  return a * b;
}

function divide(a, b) {
  // Divides two numbers.
  return a / b;
}

let a;
let b;
let operator;

function operate(a, b, operator) {
  // Accepts two numbers as strings and one of four operators, then
  // operates on the two numbers accordingly.
  a = parseInt(a);
  b = parseInt(b);

  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }

  return undefined;
}