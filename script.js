const products = [
  { name: "610 кристаллов", price: 550, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { name: "1340 кристаллов", price: 1100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { name: "2800 кристаллов", price: 2100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { name: "7370 кристаллов", price: 4600, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { name: "15710 кристаллов", price: 8800, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" }
];

const productGrid = document.getElementById("product-grid");
const cartIcon = document.getElementById("cart-icon");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");

let cartData = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts() {
  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p><strong>${p.price} ₽</strong></p>
      <button onclick="addToCart(${i})">Добавить</button>
    `;
    productGrid.appendChild(card);
  });
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach((item, i) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      ${item.name} x${item.qty} — ${item.price * item.qty} ₽
      <button onclick="removeItem(${i})">✖</button>
    `;
    cartItems.appendChild(div);
  });
  cartTotal.textContent = total + " ₽";
  cartCount.textContent = cartData.reduce((a, b) => a + b.qty, 0);
  localStorage.setItem("cart", JSON.stringify(cartData));
}

function addToCart(i) {
  const product = products[i];
  const existing = cartData.find(item => item.name === product.name);
  if (existing) {
    existing.qty++;
  } else {
    cartData.push({ ...product, qty: 1 });
  }
  renderCart();
}

function removeItem(i) {
  cartData.splice(i, 1);
  renderCart();
}

clearCartBtn.addEventListener("click", () => {
  cartData = [];
  renderCart();
});

cartIcon.addEventListener("click", () => {
  cart.style.display = cart.style.display === "block" ? "none" : "block";
});

renderProducts();
renderCart();
