const expressionInput = document.getElementById("expression");
const resultOutput = document.getElementById("result");
const buttons = document.querySelectorAll("button[data-value]");
const calculateButton = document.getElementById("calculate");
const clearButton = document.getElementById("clear");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    expressionInput.value += button.dataset.value;
    expressionInput.focus();
  });
});


clearButton.addEventListener("click", () => {
  expressionInput.value = "";
  resultOutput.textContent = "Enter an expression to begin.";
  expressionInput.focus();
});

calculateButton.addEventListener("click", calculate);

expressionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    calculate();
  }

  if (event.key === "Escape") {
    clearButton.click();
  }
});

function calculate() {
  const expression = expressionInput.value.trim();

  if (!expression) {
    resultOutput.textContent = "Please enter an expression.";
    return;
  }

  try {
    const value = evaluateExpression(expression);
    resultOutput.textContent = formatResult(value);
  } catch (error) {
    resultOutput.textContent = `Error: ${error.message}`;
  }
}

function evaluateExpression(expression) {
  let cleanExpression = expression
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replace(/\s+/g, "");

  validateExpression(cleanExpression);

  cleanExpression = cleanExpression.replace(/\*\*/g, "^");

  const result = Function(`"use strict"; return (${cleanExpression});`)();

  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("The result must be a finite number.");
  }

  return result;
}

function validateExpression(expression) {
  const allowedCharacters = /^[0-9a-fA-Fxobn+\-*/%&|^~<>().]+$/;

  if (!allowedCharacters.test(expression)) {
    throw new Error("Expression contains unsupported characters.");
  }

  if (expression.includes("&&") || expression.includes("||")) {
    throw new Error("Logical operators are not supported.");
  }

  if (expression.includes("=")) {
    throw new Error("Assignments are not supported.");
  }

  const invalidShift = /<>|<<<?|>>>?/g;
  if (invalidShift.test(expression)) {
    throw new Error("Invalid shift operator.");
  }
}

function formatResult(value) {
  const integerValue = Number.isInteger(value);

  if (!integerValue) {
    return `decimal: ${value}`;
  }

  return [
    `decimal: ${value}`,
    `binary:  ${value < 0 ? "-0b" + Math.abs(value).toString(2) : "0b" + value.toString(2)}`,
    `octal:   ${value < 0 ? "-0o" + Math.abs(value).toString(8) : "0o" + value.toString(8)}`,
    `hex:     ${value < 0 ? "-0x" + Math.abs(value).toString(16) : "0x" + value.toString(16)}`,
  ].join("\n");
}
