const API_KEY = "3aae0052ff84b3b5e7951d3e";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".dropdown i");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode] || "UN";
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};

const getExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  if (fromCurr.value === toCurr.value) {
    msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
    return;
  }

  try {
    const URL = `${BASE_URL}/${fromCurr.value}/${toCurr.value}/${amtVal}`;
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result !== "success") throw new Error("API error");

    msg.innerText = `${amtVal} ${fromCurr.value} = ${data.conversion_result.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Unable to fetch exchange rate.";
    console.error(error);
  }
};

swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  getExchangeRate();
});

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  getExchangeRate();
});

window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  getExchangeRate();
});