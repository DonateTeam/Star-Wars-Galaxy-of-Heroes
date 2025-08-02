// script.js

// набор товаров
const productsData = [
  { id: 1, name: "610 кристаллов",   price: 550,  category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { id: 2, name: "1340 кристаллов",  price: 1100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 3, name: "2800 кристаллов",  price: 2100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 4, name: "7370 кристаллов",  price: 4600, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { id: 5, name: "15710 кристаллов", price: 8800, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" },
  { id: 6, name: "Набор джедая",     price: 3200, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 7, name: "Набор ситха",      price: 4100, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 8, name: "Боевой пропуск",   price: 950,  category: "passes",   img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
];

// селекторы
const productsContainer = document.getElementById("products");
const cartItems          = document.getElementById("cart-items");
const cartTotal          = document.getElementById("cart-total");
const cartCount          = document.getElementById("cart-count");
const checkoutBtn        = document.getElementById("checkout-btn");
const clearCartImg       = document.getElementById("clear-cart-img");
const payModal           = document.getElementById("pay-modal");
const closeModalBtn      = document.querySelector(".modal-close");
const tgBtn              = document.querySelector(".messenger-btn.telegram");

// состояние корзины
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// анимация числа
function animateValue(el, start, end, duration = 500) {
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = `${value} ₽`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// рендер товаров
function renderProducts(filter = "all") {
  productsContainer.innerHTML = "";
  const list = filter === "all"
    ? productsData
    : productsData.filter(p => p.category === filter);

  list.forEach(prod => {
    const inCart = cart.find(i => i.id === prod.id);
    const qty    = inCart?.qty || 0;
    const card   = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = prod.id;
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <div class="price">${prod.price} ₽</div>
      ${qty > 0
        ? `<div class="counter">
             <button class="dec">−</button>
             <span class="count">${qty}</span>
             <button class="inc">+</button>
           </div>`
        : `<button class="add-btn">+</button>`
      }
    `;
    productsContainer.appendChild(card);
  });

  // обработчики кнопок
  document.querySelectorAll(".add-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      cart.push({ id, qty: 1 });
      saveAndRepaint();
    })
  );
  document.querySelectorAll(".inc").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      cart.find(i => i.id === id).qty++;
      saveAndRepaint();
    })
  );
  document.querySelectorAll(".dec").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      const item = cart.find(i => i.id === id);
      if (item.qty > 1) item.qty--;
      else cart = cart.filter(i => i.id !== id);
      saveAndRepaint();
    })
  );
}

// рендер корзины
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0, countSum = 0;

  cart.forEach(item => {
    const prod = productsData.find(p => p.id === item.id);
    total += prod.price * item.qty;
    countSum += item.qty;

    const li = document.createElement("li");
    li.className = "cart-item-card";
    li.innerHTML = `
      <div class="item-header">
        <div class="item-name">${prod.name}</div>
        <div class="item-price">${prod.price} ₽</div>
      </div>
      <div class="item-counter">
        <button class="dec">−</button>
        <span class="count">${item.qty}</span>
        <button class="inc">+</button>
      </div>
    `;
    cartItems.appendChild(li);

    li.querySelector(".inc").addEventListener("click", () => {
      item.qty++; saveAndRepaint();
    });
    li.querySelector(".dec").addEventListener("click", () => {
      if (item.qty > 1) item.qty--;
      else cart = cart.filter(i => i.id !== item.id);
      saveAndRepaint();
    });
  });

  const prev = parseInt(cartTotal.dataset.prev) || 0;
  animateValue(cartTotal, prev, total);
  cartTotal.dataset.prev = total;

  const word =
    countSum % 10 === 1 && countSum % 100 !== 11 ? "товар" :
    countSum % 10 >= 2 && countSum % 10 <= 4 && !(countSum % 100 >= 12 && countSum % 100 <= 14) ? "товара" :
    "товаров";
  cartCount.textContent = `${countSum} ${word}`;

  checkoutBtn.disabled = total === 0;
  document.querySelector(".cart")
          .classList.toggle("scrollable", cart.length > 2);
}

// сохранить и перерисовать
function saveAndRepaint() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderProducts(document.querySelector(".filter-btn.active").dataset.category);
  renderCart();
}

// фильтры
document.querySelectorAll(".filter-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  })
);

// модалка оплаты — ОБОРОТКА по наличию элементов:
if (payModal) {
  // открытие
  checkoutBtn.addEventListener("click", e => {
    e.preventDefault();
    if (checkoutBtn.disabled) return;
    payModal.classList.add("open");
  });

  // закрытие по кресту и по фону
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      payModal.classList.remove("open");
    });
    payModal.addEventListener("click", e => {
      if (e.target === payModal) payModal.classList.remove("open");
    });
  }
}

// очистка корзины
clearCartImg.addEventListener("click", () => {
  cart = [];
  saveAndRepaint();
});

// сборка и отправка в Telegram
tgBtn.addEventListener("click", () => {
  const title = document.querySelector(".game-title").textContent.trim();
  let text = `${title}\n\nСодержимое корзины:\n`, total = 0;

  cart.forEach(i => {
    const prod = productsData.find(p => p.id === i.id);
    const sum  = prod.price * i.qty;
    total += sum;
    text += `• ${prod.name} × ${i.qty} — ${sum} ₽\n`;
  });
  text += `\nИтого: ${total} ₽`;

  window.open(
    `https://t.me/DonateTeam_support?text=${encodeURIComponent(text)}`,
    "_blank"
  );
});

// стартовый рендер
renderProducts();
renderCart();
