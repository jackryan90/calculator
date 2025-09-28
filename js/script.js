function add(a, b) {
  // Add two numbers.
  return a + b;
}

function subtract(a, b) {
  // Subtract two numbers.
  return a - b;
}

function multiply(a, b) {
  // Multiply two numbers.
  return a * b;
}

function divide(a, b) {
  // Divide two numbers.
  return a / b;
}

function operate(a, b, operator) {
  // Accept two numbers as strings and one of four operators, then
  // operate on the two numbers accordingly.
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

let inputs = [undefined, undefined];
let inputIdx = 0;
let operator;
const maxDigits = 9;

function updateAndRender(newNumber) {
  // Append a new number onto an existing input, if the input already
  // exists. If not, initialize it. Both the input and the new number
  // are strings.
  if (!inputs[inputIdx]) {
    inputs[inputIdx] = newNumber;
  } else {
    inputs[inputIdx] += newNumber;
  }

  renderOutput();
  return;
}

function isNumberLike(input) {
  /* Check if the input looks like a number. */
  return /^-?\d+(\.\d+)?$/.test(input);
}

function renderOutput() {
  /* Render the output to the display. */
  const input = inputs[inputIdx];

  // Double-check that the input looks like a number.
  if (!isNumberLike(input)) {
    display.textContent = "ERROR";
    return;
  }

  // If the number of digits is less than or equal to the number
  // available, just render the input as-is.
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
    if (wholePart === "-0" && numLeadingZeros >= 3) {
      display.textContent = formatSmallNumberAsScientific(input);
      return;
    }

    try {
      display.textContent = truncateDecimalNumber(input);
    } catch (err) {
      console.log(err);
      display.textContent = "ERROR";
    }
    return;
  }

  // Big positive or negative number, no decimal.
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
      truncated = (parseInt(truncated) + 1).toString();
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
      truncated = (parseInt(truncated) + 1).toString();
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
      "The number must be small enough to capture its entire whole part in the"
      + " output."
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
      truncated = (parseInt(truncated) + 1).toString();
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

const numberButtons = document.querySelectorAll(".number-row button");
numberButtons.forEach(
  (button) => button.addEventListener(
    "click", (event) => updateAndRender(event.target.value)
  )
);

const display = document.querySelector("#display");
