const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbolsString = "~!@#$%^&*()_+={[}]|:;<>,.?/";

// Starting values
let password = "";
let passwordLength = 10;
let checkedCount = 0;
setIndicator("#ccc");

//Handling the slider
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

handleSlider();

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 10px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRandomInteger(0, 9);
}

function getRandomLowerCase() {
  let asciiValue = getRandomInteger(97, 123);
  return String.fromCharCode(asciiValue);
}

function getRandomUpperCase() {
  let asciiValue = getRandomInteger(65, 91);
  return String.fromCharCode(asciiValue);
}

function getSymbol() {
  let index = getRandomInteger(0, symbolsString.length);
  return symbolsString[index];
}

function calculateStrength() {
  let hasUpperCase = false;
  let hasLowerCase = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpperCase = true;
  if (lowercaseCheck.checked) hasLowerCase = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (
    hasUpperCase &&
    hasLowerCase &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (hasLowerCase || hasUpperCase) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#0ff0");
  } else {
    setIndicator("#f00");
  }
}

//Copy the password to clipboard

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (err) {
    copyMsg.innerText = "failed";
  }

  //To make copy span visible
  copyMsg.classList.add("active");

  //To remove the span after 2 second
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(passwordArray) {
  //Fisher Yates Algorithm to shuffle
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = passwordArray[i];
    passwordArray[i] = passwordArray[j];
    passwordArray[j] = temp;
  }
  return passwordArray.join("");
}

// Handling the checkbox
function handleCheckBoxChange() {
  checkedCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCount++;
    }
  });

  //Special condition for password length
  if (passwordLength < checkedCount) {
    passwordLength = checkedCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (event) => {
  passwordLength = event.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", (event) => {
  if (passwordDisplay.value != "") {
    copyContent();
  }
});

//Generate the Password

generateBtn.addEventListener("click", () => {
  //If none of the checkBox is selected
  if (checkedCount <= 0) return;

  if (passwordLength < checkedCount) {
    passwordLength = checkedCount;
    handleSlider();
  }

  //Let's generate new password

  //Remove the old password
  password = "";

  //Let's put the stuff mentioned by the checkboxes
  const functionsArray = [];

  if (uppercaseCheck.checked) {
    functionsArray.push(getRandomUpperCase);
  }
  if (lowercaseCheck.checked) {
    functionsArray.push(getRandomLowerCase);
  }
  if (numbersCheck.checked) {
    functionsArray.push(getRandomNumber);
  }
  if (symbolsCheck) {
    functionsArray.push(getSymbol);
  }

  //Compulsory Addition
  for (let i = 0; i < functionsArray.length; i++) {
    password += functionsArray[i]();
  }

  for (let i = password.length; i < passwordLength; i++) {
    let randomIndex = getRandomInteger(0, functionsArray.length);
    password += functionsArray[randomIndex]();
  }

  //Now Shuffle the password
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calculateStrength();
});
