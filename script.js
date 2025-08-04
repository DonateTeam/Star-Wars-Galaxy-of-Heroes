const productsData = [
  { id: 1,  name: "610 кристаллов",   price: 550,  category: "crystals", img: "https://i.imgur.com/12345.png" },
  { id: 2,  name: "1340 кристаллов",  price: 1100, category: "crystals", img: "https://i.imgur.com/12345.png" },
  { id: 3,  name: "2800 кристаллов",  price: 2100, category: "crystals", img: "https://i.imgur.com/12345.png" },
  { id: 4,  name: "7370 кристаллов",  price: 4600, category: "crystals", img: "https://i.imgur.com/12345.png" },
  { id: 5,  name: "15710 кристаллов", price: 8800, category: "crystals", img: "https://i.imgur.com/12345.png" },
  { id: 6,  name: "Набор джедая",     price: 3200, category: "sets",     img: "https://i.imgur.com/12345.png" },
  { id: 7,  name: "Набор ситха",      price: 4100, category: "sets",     img: "https://i.imgur.com/12345.png" },
  { id: 8,  name: "Боевой пропуск",   price: 950,  category: "passes",   img: "https://i.imgur.com/12345.png" },
  { id: 9,  name:"Пропуск эпизода +",  price:3800,category:  "passes",   img:"https://i.imgur.com/1QtabKs.png" },
  { id: 10, name:"Пропуск завоевания",  price:1100,category:  "passes",  img:"https://i.imgur.com/1QtabKs.png" },
  { id: 11, name:"Пропуск завоевания +",  price:3000,category:  "passes",  img:"https://i.imgur.com/1QtabKs.png" },
];

const productsContainer = document.getElementById("products");
const cartItems          = document.getElementById("cart-items");
const cartTotal          = document.getElementById("cart-total");
const cartCount          = document.getElementById("cart-count");
const checkoutBtn        = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function animateValue(el, start, end, duration = 300) {
  let ts0 = null;
  function step(ts) {
    if (!ts0) ts0 = ts;
    const prog = Math.min((ts - ts0) / duration, 1);
    el.textContent = Math.floor(start + (end - start) * prog) + " ₽";
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderProducts(category = "all") {
  productsContainer.innerHTML = "";
  const list = category === "all" ? productsData : productsData.filter(p => p.category === category);
  list.forEach(p => {
    const inCart = cart.find(x => x.id === p.id);
    const qty = inCart ? inCart.qty : 0;
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
      save();
    })
  );
  document.querySelectorAll(".inc").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      cart.find(x => x.id === id).qty++;
      save();
    })
  );
  document.querySelectorAll(".dec").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = +btn.closest(".product-card").dataset.id;
      const item = cart.find(x => x.id === id);
      if (item.qty > 1) item.qty--; else cart = cart.filter(x => x.id !== id);
      save();
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

    li.querySelector(".inc").onclick = () => { it.qty++; save(); };
    li.querySelector(".dec").onclick = () => {
      if (it.qty > 1) it.qty--; else cart = cart.filter(x => x.id !== it.id);
      save();
    };
  });

  animateValue(cartTotal, +(cartTotal.textContent||0), total);
  cartCount.textContent = `${count} ${count % 10 === 1 && count % 100 !== 11 ? "товар" : count % 10 <=4 && count % 100 < 10 ? "товара" : "товаров"}`;
  checkoutBtn.disabled = !total;
}

function save() {
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
  // сразу отправляем в Telegram
  const title = "Star Wars: Galaxy of Heroes";
  let text = `${title}\n\nСодержимое корзины:\n`;
  let total = 0;
  cart.forEach(it => {
    const p = productsData.find(x => x.id === it.id);
    text += `• ${p.name} × ${it.qty} — ${p.price * it.qty} ₽\n`;
    total += p.price * it.qty;
  });
  text += `\nИтого: ${total} ₽`;
  window.open(`https://t.me/DonateTeam_support?text=${encodeURIComponent(text)}`, "_blank");
});

renderProducts();
renderCart();
