const products = [
  { id: 1, name: "Супер пропуск", price: 386, img: "images/pass.webp" },
  { id: 2, name: "Набор Супер пропуска", price: 721, img: "images/pass-set.webp" },
  { id: 3, name: "Недельная карта", price: 77, img: "images/week-card.webp" },
  { id: 4, name: "Месячная карта", price: 770, img: "images/month-card.webp" },
  { id: 5, name: "100 звёзд", price: 75, img: "images/100-stars.webp" },
  { id: 6, name: "310 звёзд", price: 178, img: "images/310-stars.webp" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button onclick="addToCart(${p.id})">Добавить</button>
    `;
    container.appendChild(card);
  });
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalElem = document.getElementById("cart-total");
  const countElem = document.getElementById("cart-count");

  list.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.quantity} – ${item.price * item.quantity} ₽
      <button onclick="removeFromCart(${item.id})">❌</button>`;
    list.appendChild(li);
  });

  totalElem.textContent = total;
  countElem.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((i) => i.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function toggleCart() {
  const cartElem = document.getElementById("cart");
  cartElem.style.display = cartElem.style.display === "block" ? "none" : "block";
}

renderProducts();
renderCart();
