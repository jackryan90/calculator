let inputs = ["", ""];
let inputIdx = 0;
let output = "";
let operator = "";
const maxDigits = 12;

/**
 * Add two numbers.
 * @param {*} a The first addend, as a float.
 * @param {*} b The second addend, as a float.
 * @returns The sum of a and b.
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtract one number from another number.
 * @param {*} a The minuend, as a float.
 * @param {*} b The subtrahend, as a float.
 * @returns The difference of a and b.
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiply two numbers.
 * @param {*} a The first multiplicand, as a float.
 * @param {*} b The second multiplicand, as a float.
 * @returns The product of a and b.
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divide one number by another number.
 * @param {*} a The dividend, as a float.
 * @param {*} b The divisor, as a float.
 * @returns The quotient of a and b.
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return a / b;
}

/**
 * Accept two numbers as strings and one of four operators, then operate
 * on the two numbers accordingly.
 * @param {*} a The first input, as a string.
 * @param {*} b The second input, as a string.
 * @param {*} operator The operator, as a string.
 * @returns The result of the operation.
 */
function operate(a, b, operator) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (operator) {
    case "+":
      return add(a, b).toString();
    case "-":
      return subtract(a, b).toString();
    case "*":
      return multiply(a, b).toString();
    case "/":
      return divide(a, b).toString();
    default:
      throw new Error("Unrecognized operator detected.");
  }
}

/**
 * Clear all previously entered inputs.
 */
function clearAll() {
  inputs = ["", ""];
  inputIdx = 0;
  output = "";
  operator = "";

  renderOutput(inputs[inputIdx]);
}

/**
 * Process the press of a number button. Append the new entry onto the
 * current input, if the input already exists. If not, initialize it.
 * @param {*} newNumber
 * @returns
 */
function processNumberPress(newNumber) {
  // Only used the saved output when the user presses the equals sign
  // button and then immediately hits an operator. If the user starts
  // entering another number, clear saved output.
  output = "";

  // Start a new input.
  if (!inputs[inputIdx]) {
    inputs[inputIdx] = newNumber;
    renderOutput(inputs[inputIdx]);
    return;
  }

  if (inputs[inputIdx] === "0") {
    // If the user enters more than one zero (and nothing else), only
    // save one zero.
    if (newNumber === "0") {
      return;
    }

    // Do not show leading zeros for whole numbers.
    inputs[inputIdx] = newNumber;
    renderOutput(inputs[inputIdx]);
    return;
  }

  // Append to an existing input.
  inputs[inputIdx] += newNumber;
  renderOutput(inputs[inputIdx]);
  return;
}

/**
 * Process the press of the plus, minus, multiply, or division buttons.
 * @param {*} newOperator The operator just pressed, as a string.
 * @returns
 */
function processOperatorPress(newOperator) {
  if (!inputs[0] && !inputs[1]) {
    // If the user presses the equals sign and then immediately presses
    // an operator, use the value in `output` to start a new operation.
    if (output) {
      inputs[0] = output;
      operator = newOperator;
      inputIdx = 1;
      return;
    }

    return;
  }

  // If the user has entered one number and then hits the operator, save
  // the operator and let them enter the second number.
  if (inputs[0] && !inputs[1]) {
    operator = newOperator;
    inputIdx = 1;
    return;
  }

  if (!inputs[0] && inputs[1]) {
    throw new Error("Input 0 is empty, but input 1 is not.");
  }

  // If the user has entered two numbers and then hits an operator,
  // execute the previously saved operation, save its result to the
  // first input, and set up for the new operation.
  inputs[0] = operate(inputs[0], inputs[1], operator);
  renderOutput(inputs[0]);
  inputs[1] = "";
  operator = newOperator;
  inputIdx = 1;
}

/**
 * Process the press of the equal button.
 * @returns
 */
function processEqualPress() {
  if (!inputs[1]) {
    return;
  }

  if (!inputs[0] && inputs[1]) {
    throw new Error("Input 0 is empty, but input 1 is not.");
  }

  output = operate(inputs[0], inputs[1], operator);
  renderOutput(output);
  inputs[0] = inputs[1] = operator = "";
  inputIdx = 0;
}

/**
 * Negate the current input.
 * @returns
 */
function processPlusMinusPress() {
  const currentInput = inputs[inputIdx];

  if (currentInput === "") {
    output = "";
    renderOutput(currentInput);
    return;
  }

  const ignoredPatterns = /^0$|^0\.$|^0\.0+$/;
  if (ignoredPatterns.test(currentInput)) {
    return;
  }

  if (currentInput[0] === "-") {
    inputs[inputIdx] = currentInput.slice(1);
    renderOutput(inputs[inputIdx]);
    return;
  }

  inputs[inputIdx] = `-${currentInput}`;
  renderOutput(inputs[inputIdx]);
  return;
}

/**
 * Append a decimal to the current input.
 * @returns
 */
function processDecimalPress() {
  const currentInput = inputs[inputIdx];

  if (currentInput.includes(".")) {
    return;
  }

  if (currentInput === "") {
    inputs[inputIdx] = "0.";
    renderOutput(inputs[inputIdx]);
    return;
  }

  inputs[inputIdx] = `${currentInput}.`;
  renderOutput(inputs[inputIdx]);
  return;
}

/**
 * Remove the last character from the current input.
 * @returns
 */
function processBackspacePress() {
  const currentInput = inputs[inputIdx];

  if (currentInput === "") {
      output = "";
      renderOutput(currentInput);
      return;
  }

  inputs[inputIdx] = currentInput.slice(0, -1);

  if (inputs[inputIdx] === "-") {
    inputs[inputIdx] = "";
  }

  renderOutput(inputs[inputIdx]);
  return;
}

/**
 * Check if the input looks like a number.
 * @param {*} input
 * @returns
 */
function isNumberLike(input) {
  return /^-?\d+(\.\d*)?$/.test(input);
}

/**
 * Render the output to the display.
 * @param {*} input
 * @returns
 */
function renderOutput(input) {
  if (!input) {
    display.textContent = input;
    return;
  }

  if (!isNumberLike(input)) {
    throw new Error("The calculator is trying to render a non-number.");
  }

  const numDigits = input.length;
  if (numDigits <= maxDigits) {
    display.textContent = input;
    return;
  }

  if (input.includes(".")) {
    const [wholePart, decimalPart] = input.split(".");

    if (wholePart.length > maxDigits) {
      display.textContent = formatBigNumberAsScientific(wholePart);
      return;
    }

    const numLeadingZeros = (
      Array.from(decimalPart).findIndex((char) => char != "0")
    );
    if (/^(-)?0$/.test(wholePart) && numLeadingZeros >= 3) {
      display.textContent = formatSmallNumberAsScientific(input);
      return;
    }

    display.textContent = truncateDecimalNumber(input);
    return;
  }

  display.textContent = formatBigNumberAsScientific(input);
  return;
}

/**
 * Format a large number in scientific notation. When calculating how
 * many significant digits we can display, reserve one spot for the
 * negative sign (optional), one for the decimal, one for "E", and
 * however many digits the power requires.
 * @param {*} input A whole number greater than one, as a string.
 * @returns A string showing the input in scientific notation.
 */
function formatBigNumberAsScientific(input) {
  const isNegative = input[0] === "-";
  const rawNumber = isNegative ? input.slice(1) : input;

  const power = (rawNumber.length - 1).toString();
  const allowed = (
    isNegative ? maxDigits - power.length - 3 : maxDigits - power.length - 2
  );

  let truncated;
  if (rawNumber.length > allowed) {
    truncated = rawNumber.slice(0, allowed);

    const roundingDigit = parseInt(rawNumber.at(allowed));
    if (roundingDigit >= 5) {
      truncated = (
        truncated.slice(0,-1) + (parseInt(truncated.at(-1)) + 1).toString()
      );
    }
  } else {
    truncated = rawNumber;
  }

  return (
    `${isNegative ? "-" : ""}${truncated.at(0)}.${truncated.slice(1)}E${power}`
  );
}

/**
 * Format a small number in scientific notation. When calculating how
 * many significant digits we can display, reserve one spot for the
 * negative sign (optional), one for the decimal, two for "E-", and
 * however many digits the power requires.
 * @param {*} input A number less than one, as a string.
 * @returns A string showing the input in scientific notation.
 */
function formatSmallNumberAsScientific(input) {
  const [wholePart, decimalPart] = input.split(".");

  const isNegative = wholePart[0] === "-";

  const numLeadingZeros = (
    Array.from(decimalPart).findIndex((char) => char != "0")
  );
  const significantDigits = decimalPart.slice(numLeadingZeros);

  const power = (numLeadingZeros + 1).toString();
  const allowed = (
    isNegative ? maxDigits - power.length - 4 : maxDigits - power.length - 3
  );

  let truncated;
  if (significantDigits.length > allowed) {
    truncated = significantDigits.slice(0, allowed);

    const roundingDigit = parseInt(significantDigits.at(allowed));
    if (roundingDigit >= 5) {
      truncated = (
        truncated.slice(0,-1) + (parseInt(truncated.at(-1)) + 1).toString()
      );
    }
  } else {
    truncated = significantDigits;
  }

  return (
    `${isNegative ? "-" : ""}${truncated[0]}.${truncated.slice(1)}E-${power}`
  )
}

/**
 * Truncate a number with a whole part and a decimal part to fit within
 * maxDigits.
 * @param {*} input A number with a decimal, as a string.
 * @returns
 */
function truncateDecimalNumber(input) {
  const [wholePart, decimalPart] = input.split(".");
  const isNegative = wholePart[0] === "-";
  const rawNumber = (
    isNegative ? wholePart.slice(1) + decimalPart : wholePart + decimalPart
  );

  if (wholePart.length > maxDigits) {
    throw new Error(
      `The number must be small enough to capture its entire whole part in the
      output.`
    );
  }

  let allowed;
  if (wholePart.length === maxDigits) {
    allowed = isNegative ? maxDigits - 1 : maxDigits;
  } else {
    allowed = isNegative ? maxDigits - 2 : maxDigits - 1;
  }

  let truncated;
  if (rawNumber.length > allowed) {
    truncated = rawNumber.slice(0, allowed);

    const roundingDigit = parseInt(rawNumber.at(allowed));
    if (roundingDigit >= 5) {
      truncated = (
        truncated.slice(0,-1) + (parseInt(truncated.at(-1)) + 1).toString()
      );
    }
  } else {
    truncated = rawNumber;
  }

  if (wholePart.length === maxDigits) {
    return `${isNegative ? "-" : ""}${truncated}`;
  }

  const decimalIdx = isNegative ? wholePart.length - 1 : wholePart.length;
  let result = (
    `${isNegative ? "-" : ""}${truncated.slice(0, decimalIdx)}`
    + `.${truncated.slice(decimalIdx, allowed)}`
  )

  // Do not allow the number to end in a decimal.
  return result.at(-1) === "." ? result.slice(0, -1) : result;
}

/**
 * Handle calculator errors.
 * @param {*} error
 * @returns
*/
function handleError(error) {
  console.error(error);
  display.textContent = "ERROR";
  console.error(inputs);

  inputs[0] = inputs[1] = operator = "";
  inputIdx = 0;
  return;
}

const display = document.querySelector("#display");

const numberButtons = (
  Array.from(document.querySelectorAll(".number-row button"))
  .filter((button) => !(button.value == "plus-minus" || button.value == "."))
)
numberButtons.forEach(
  (button) => button.addEventListener(
    "click", (event) => {
      try {
        processNumberPress(event.target.value);
      } catch (error) {
        handleError(error);
      }
    }
  )
);

const clearButton = document.querySelector("#all-clear");
clearButton.addEventListener("click", () => clearAll());

const divideButton = document.querySelector("#divide");
const multiplyButton = document.querySelector("#multiply");
const minusButton = document.querySelector("#minus");
const plusButton = document.querySelector("#plus");
[divideButton, multiplyButton, minusButton, plusButton].forEach(
  (button) => button.addEventListener(
    "click", (event) => {
      try {
        processOperatorPress(event.target.value);
      } catch (error) {
        handleError(error);
      }
    }
  )
);

const equalButton = document.querySelector("#equal");
equalButton.addEventListener(
  "click", () => {
    try {
      processEqualPress();
    } catch (error) {
      handleError(error);
    }
  }
);

const plusMinusButton = document.querySelector("#plus-minus");
plusMinusButton.addEventListener("click", () => processPlusMinusPress());

const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", () => processDecimalPress());

const backspaceButton = document.querySelector("#backspace");
backspaceButton.addEventListener("click", () => processBackspacePress());

// Keyboard support
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    processBackspacePress();
    return;
  }

  let numbers = [];
  for (i = 0; i < 10; i++) {
    numbers.push(i.toString());
  }
  if (numbers.includes(event.key)) {
    processNumberPress(event.key);
    return;
  }

  if (event.altKey && event.code === "Minus") {
    processPlusMinusPress();
    return;
  }

  if (event.key === ".") {
    processDecimalPress();
    return;
  }

  const operators = ["/", "*", "-", "+"];
  if (operators.includes(event.key)) {
    processOperatorPress(event.key);
    return;
  }

  if (event.key === "Enter") {
    processEqualPress();
    return;
  }

  return;
})