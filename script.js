const currenceFirstEl = document.getElementById('currence-first');

const worthFirstEl = document.getElementById('worth-first');

const currenceSecondEl =document.getElementById('currence-second');
const worthSecondEl = document.getElementById('worth-second');
const exchangeRate = document.getElementById('exchange-rate');
 function updateRate() {
   fetch(`https://v6.exchangerate-api.com/v6/96b9c5d322e5fb3819af4c23/latest/${currenceFirstEl.value}`).then((res) => res.json()).then((data) => {
     const rate = data.conversion_rates[currenceSecondEl.value];
     console.log(rate);
     exchangeRate.innerText = `1${currenceFirstEl.value} = ${rate}${currenceSecondEl.value}`;
     worthSecondEl.value = (worthFirstEl.value * rate).toFixed(2);
   });
 }

 currenceFirstEl.addEventListener("change",updateRate); 
  currenceSecondEl.addEventListener("change",updateRate); 
  worthFirstEl.addEventListener("input",updateRate);