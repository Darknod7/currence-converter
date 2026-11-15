const currenceFirstEl = document.getElementById('currence-first');

const worthFirstEl = document.getElementById('worth-first');

const currenceSecondEl =document.getElementById('currence-second');
const worthSecondEl = document.getElementById('worth-second');
const exchangeRate = document.getElementById('exchange-rate');
const themeToggle = document.getElementById("theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
let latestRequestId = 0;

const currencyRegions = {
  USD: "US",
  RUB: "RU",
  UZS: "UZ",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  CNY: "CN",
  INR: "IN",
  CAD: "CA",
  AUD: "AU",
  CHF: "CH",
  TRY: "TR",
  KZT: "KZ",
  AED: "AE",
  KRW: "KR",
  SGD: "SG",
};

function updateCurrencyBadge(select) {
  select.parentElement.querySelector(".currency-badge").innerText = currencyRegions[select.value];
}

for (const select of [currenceFirstEl, currenceSecondEl]) {
  updateCurrencyBadge(select);
  select.addEventListener("change", () => updateCurrencyBadge(select));
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Yorug' rejimni yoqish" : "Qora rejimni yoqish");
  themeToggle.querySelector(".theme-toggle-icon").innerText = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle-label").innerText = isDark ? "Yorug' rejim" : "Qora rejim";
  themeMeta.setAttribute("content", isDark ? "#10131d" : "#f4f7ff");
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("currency-converter-theme") || "light";
} catch (error) {
  console.warn("Mavzu sozlamasini o'qib bo'lmadi:", error);
}
setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  try {
    localStorage.setItem("currency-converter-theme", theme);
  } catch (error) {
    console.warn("Mavzu sozlamasini saqlab bo'lmadi:", error);
  }
});

async function updateRate() {
  const requestId = ++latestRequestId;
  const fromCurrency = currenceFirstEl.value;
  const toCurrency = currenceSecondEl.value;
  const amount = worthFirstEl.valueAsNumber;

  worthSecondEl.value = "";
  exchangeRate.classList.remove("exchange-rate--error");

  if (!Number.isFinite(amount) || amount < 0) {
    exchangeRate.innerText = "Iltimos, 0 yoki undan katta summa kiriting.";
    exchangeRate.classList.add("exchange-rate--error");
    return;
  }

  exchangeRate.innerText = "Kurs yuklanmoqda...";

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/96b9c5d322e5fb3819af4c23/latest/${fromCurrency}`);
    if (!response.ok) {
      throw new Error(`Kurs API so'rovi muvaffaqiyatsiz: HTTP ${response.status}`);
    }

    const data = await response.json();
    const rate = data && data.conversion_rates && data.conversion_rates[toCurrency];
    if (data.result !== "success" || !Number.isFinite(rate)) {
      throw new Error("Kurs API kutilmagan javob qaytardi.");
    }

    if (requestId !== latestRequestId) return;

    worthSecondEl.value = (amount * rate).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    exchangeRate.innerText = `1 ${fromCurrency} = ${rate.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${toCurrency}`;
  } catch (error) {
    if (requestId !== latestRequestId) return;

    worthSecondEl.value = "";
    exchangeRate.innerText = "Kursni yuklab bo'lmadi. Internetni tekshirib qayta urinib ko'ring.";
    exchangeRate.classList.add("exchange-rate--error");
    console.error("Valyuta kursini yuklashda xatolik:", error);
  }
}

currenceFirstEl.addEventListener("change", updateRate);
currenceSecondEl.addEventListener("change", updateRate);
worthFirstEl.addEventListener("input", updateRate);
updateRate();
