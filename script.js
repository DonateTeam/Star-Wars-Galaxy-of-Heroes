const productsData = [
  { id: 1, name: "610 кристаллов", price: 550, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { id: 2, name: "1340 кристаллов", price: 1100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 3, name: "2800 кристаллов", price: 2100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 4, name: "7370 кристаллов", price: 4600, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { id: 5, name: "15710 кристаллов", price: 8800, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" },
  { id: 6, name: "Набор джедая",     price: 3200, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 7, name: "Набор ситха",      price: 4100, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 8, name: "Боевой пропуск",   price: 950,  category: "passes",   img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
];

const productsContainer = document.getElementById("products");
const cartItems          = document.getElementById("cart-items");
const cartTotal          = document.getElementById("cart-total");
const checkoutBtn        = document.getElementById("checkout-btn");
const payModal           = document.getElementById("pay-modal");
const closeModalBtn      = payModal.querySelector(".modal-close");
const tgBtn              = document.querySelector(".messenger-btn.telegram");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Рендер списка товаров
function renderProducts(filter = "all") {
  productsContainer.innerHTML = "";
  const filtered = filter === "all"
    ? productsData
    : productsData.filter(p => p.category === filter);

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} ₽</p>
      <button onclick="addToCart(${product.id})">Добавить</button>
    `;
    productsContainer.appendChild(card);
  });
}

// Добавить в корзину
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Удалить из корзины
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Рендер корзины и блокировка кнопки
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const product = productsData.find(p => p.id === item.id);
    const sum = product.price * item.qty;
    total += sum;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${product.name} × ${item.qty} — ${sum} ₽</span>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `${total} ₽`;
  checkoutBtn.disabled = total === 0;
}

// Фильтрация товаров
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

// Модалка
checkoutBtn.addEventListener("click", e => {
  e.preventDefault();
  if (checkoutBtn.disabled) return;
  payModal.classList.add("open");
});
closeModalBtn.addEventListener("click", () => {
  payModal.classList.remove("open");
});
payModal.addEventListener("click", e => {
  if (e.target === payModal) payModal.classList.remove("open");
});

// Наполнение Telegram-сообщения
tgBtn.addEventListener("click", () => {
  const gameTitle = document.querySelector(".game-title").textContent.trim();
  let text = `${gameTitle}\n\nСодержание корзины:\n`;
  let total = 0;

  cart.forEach(item => {
    const product = productsData.find(p => p.id === item.id);
    const sum = product.price * item.qty;
    total += sum;
    text += `• ${product.name} × ${item.qty} — ${sum} ₽\n`;
  });
  text += `\nИтого: ${total} ₽`;

  const tgLink = 'https://t.me/DonateTeam_support?text=' + encodeURIComponent(text);
  window.open(tgLink, '_blank');
});

// Инициализация
renderProducts();
renderCart();
