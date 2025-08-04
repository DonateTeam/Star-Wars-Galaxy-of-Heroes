const productsData = [
  { id: 1,  name: "610 кристаллов",        price: 550,  category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { id: 2,  name: "1340 кристаллов",       price: 1100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 3,  name: "2800 кристаллов",       price: 2100, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 4,  name: "7370 кристаллов",       price: 4600, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { id: 5,  name: "15710 кристаллов",      price: 8800, category: "crystals", img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" },
  { id: 6,  name: "Набор джедая",          price: 3200, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id: 7,  name: "Набор ситха",           price: 4100, category: "sets",     img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id: 8,  name: "Пропуск эпизода",       price: 2000, category: "passes",   img: "https://i.imgur.com/12345.png" },
  { id: 9,  name: "Пропуск эпизода +",     price: 3800, category: "passes",   img: "https://i.imgur.com/1QtabKs.png" },
  { id: 10, name: "Пропуск завоевания",     price: 1100, category: "passes",   img: "https://i.imgur.com/1QtabKs.png" },
  { id: 11, name: "Пропуск завоевания +",   price: 3000, category: "passes",   img: "https://i.imgur.com/1QtabKs.png" },
];

const productsContainer = document.getElementById("products");
const cartItems          = document.getElementById("cart-items");
const cartTotal          = document.getElementById("cart-total");
const cartCount          = document.getElementById("cart-count");
const checkoutBtn        = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(filter = "all") {
  productsContainer.innerHTML = "";
  const list = filter === "all"
    ? productsData
    : productsData.filter(p => p.category === filter);

  list.forEach(p => {
    const inCart = cart.find(x => x.id === p.id);
    const qty    = inCart ? inCart.qty : 0;
    const div = document.createElement("div");
    div.className = "product-card";
    div.dataset.id = p.id;
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${p.price} ₽</div>
      ${qty > 0
        ? `<div class="counter">
             <button class="dec">−</button>
             <span class="count">${qty}</span>
             <button class="inc">+</button>
           </div>`
        : `<button class="add-btn">+</button>`
      }
    `;
    productsContainer.appendChild(div);
  });

  document.querySelectorAll(".add-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      cart.push({ id, qty: 1 });
      saveCart();
    })
  );
  document.querySelectorAll(".inc").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      cart.find(x => x.id === id).qty++;
      saveCart();
    })
  );
  document.querySelectorAll(".dec").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      const item = cart.find(x => x.id === id);
      if (item.qty > 1) item.qty--; else cart = cart.filter(x => x.id !== id);
      saveCart();
    })
  );
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(it => {
    const p = productsData.find(x => x.id === it.id);
    total += p.price * it.qty;
    count += it.qty;

    const li = document.createElement("li");
    li.className = "cart-item-card";
    li.innerHTML = `
      <div class="item-name">${p.name}</div>
      <div class="item-price">${p.price} ₽</div>
      <div class="item-counter">
        <button class="dec">−</button>
        <span class="count">${it.qty}</span>
        <button class="inc">+</button>
      </div>
    `;
    cartItems.appendChild(li);

    li.querySelector(".inc").onclick = () => { it.qty++; saveCart(); };
    li.querySelector(".dec").onclick = () => {
      if (it.qty > 1) it.qty--; else cart = cart.filter(x => x.id !== it.id);
      saveCart();
    };
  });

  cartTotal.textContent = `${total} ₽`;
  cartCount.textContent = 
    `${count} ${count % 10 === 1 && count % 100 !== 11 ? "товар"
           : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14)
             ? "товара" : "товаров"}`;

  checkoutBtn.disabled = total === 0;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const active = document.querySelector(".filter-btn.active").dataset.category;
  renderProducts(active);
  renderCart();
}

document.querySelectorAll(".filter-btn").forEach(b =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderProducts(b.dataset.category);
  })
);

checkoutBtn.addEventListener("click", () => {
  const title = "Star Wars: Galaxy of Heroes";
  let msg = `${title}\n\nСодержимое корзины:\n`;
  let total = 0;

  cart.forEach(it => {
    const p = productsData.find(x => x.id === it.id);
    msg += `• ${p.name} × ${it.qty} — ${p.price * it.qty} ₽\n`;
    total += p.price * it.qty;
  });
  msg += `\nИтого: ${total} ₽`;
  window.open(`https://t.me/DonateTeam_support?text=${encodeURIComponent(msg)}`, "_blank");
});

renderProducts();
renderCart();
