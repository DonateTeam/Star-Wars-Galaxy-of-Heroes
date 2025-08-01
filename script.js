const productsData = [
  { id:1, name:"610 кристаллов",    price:550,  category:"crystals", img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { id:2, name:"1340 кристаллов",   price:1100, category:"crystals", img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id:3, name:"2800 кристаллов",   price:2100, category:"crystals", img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id:4, name:"7370 кристаллов",   price:4600, category:"crystals", img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { id:5, name:"15710 кристаллов",  price:8800, category:"crystals", img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" },
  { id:6, name:"Набор джедая",      price:3200, category:"sets",     img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id:7, name:"Набор ситха",       price:4100, category:"sets",     img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id:8, name:"Боевой пропуск",    price:950,  category:"passes",   img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" }
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
  const filtered = filter==="all" ? productsData : productsData.filter(p=>p.category===filter);

  filtered.forEach(prod=>{
    const inCart = cart.find(i=>i.id===prod.id);
    const qty    = inCart?.qty||0;

    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = prod.id;

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <div class="price">${prod.price} ₽</div>
      ${qty>0
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

  // навесим события на вновь созданные кнопки
  document.querySelectorAll(".add-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = +btn.closest(".product-card").dataset.id;
      cart.push({id,qty:1});
      saveAndRepaint();
    });
  });
  document.querySelectorAll(".inc").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = +btn.closest(".product-card").dataset.id;
      const item = cart.find(i=>i.id===id);
      item.qty++;
      saveAndRepaint();
    });
  });
  document.querySelectorAll(".dec").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = +btn.closest(".product-card").dataset.id;
      const item = cart.find(i=>i.id===id);
      if(item.qty>1) item.qty--;
      else cart = cart.filter(i=>i.id!==id);
      saveAndRepaint();
    });
  });
}

// сохранить в localStorage и обновить всё
function saveAndRepaint() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderProducts(document.querySelector(".filter-btn.active").dataset.category);
  renderCart();
}

// Рендер корзины и блокировка кнопки
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item=>{
    const prod = productsData.find(p=>p.id===item.id);
    const sum  = prod.price * item.qty;
    total += sum;
    const li = document.createElement("li");
    li.innerHTML = `<span>${prod.name} × ${item.qty} — ${sum} ₽</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `${total} ₽`;
  checkoutBtn.disabled  = total===0;
}

// Удаление из корзины
function removeFromCart(id) {
  cart = cart.filter(i=>i.id!==id);
  saveAndRepaint();
}

// Фильтры
document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

// Модалка оплаты
checkoutBtn.addEventListener("click",e=>{
  e.preventDefault();
  if(checkoutBtn.disabled) return;
  payModal.classList.add("open");
});
closeModalBtn.addEventListener("click",()=>{
  payModal.classList.remove("open");
});
payModal.addEventListener("click",e=>{
  if(e.target===payModal) payModal.classList.remove("open");
});

// Telegram-сообщение
tgBtn.addEventListener("click",()=>{
  const title = document.querySelector(".game-title").textContent.trim();
  let text = `${title}\n\nСодержание корзины:\n`, total=0;
  cart.forEach(i=>{
    const prod = productsData.find(p=>p.id===i.id);
    const sum  = prod.price*i.qty;
    total += sum;
    text += `• ${prod.name} × ${i.qty} — ${sum} ₽\n`;
  });
  text += `\nИтого: ${total} ₽`;
  window.open(`https://t.me/DonateTeam_support?text=${encodeURIComponent(text)}`, "_blank");
});

// Старт
renderProducts();
renderCart();
