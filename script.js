// ==== Каталог товаров (с твоими картинками) ====
const productsData = [
  { id: 1,  name: "610 кристаллов",   price: 550,  category: "crystals", img: "https://i.imgur.com/DcigxIW.png" },
  { id: 2,  name: "1340 кристаллов",  price: 1100, category: "crystals", img: "https://i.imgur.com/olG4qt8.png" },
  { id: 3,  name: "2800 кристаллов",  price: 2100, category: "crystals", img: "https://i.imgur.com/Ye6uHVL.png" },
  { id: 4,  name: "7370 кристаллов",  price: 4600, category: "crystals", img: "https://i.imgur.com/jbx8Ad8.png" },
  { id: 5,  name: "15710 кристаллов", price: 8800, category: "crystals", img: "https://i.imgur.com/8mUjlGR.png" },

  { id: 6,  name: "Пропуск эпизода",     price: 2000, category: "passes",   img: "https://i.imgur.com/1QtabKs.png" },
  { id: 7,  name: "Пропуск эпизода +",   price: 3800, category: "passes",   img: "https://i.imgur.com/1QtabKs.png" },
  { id: 8,  name: "Пропуск завоевания",   price: 1100, category: "passes",   img: "https://i.imgur.com/mHQJlxn.png" },
  { id: 9,  name: "Пропуск завоевания +", price: 3000, category: "passes",   img: "https://i.imgur.com/mHQJlxn.png" },

  { id: 10, name: "Кайбер-жетон",         price: 1600, category: "sets",     img: "https://i.imgur.com/MFICVuR.png" },
  { id: 11, name: "Хромиумный жетон",     price: 1100, category: "sets",     img: "https://i.imgur.com/3Bc8Gvc.png" },
  { id: 12, name: "Бронзиумный жетон",    price: 600,  category: "sets",     img: "https://i.imgur.com/pbmx8XO.png" },
  { id: 13, name: "Календарь энергии",    price: 2000, category: "sets",     img: "https://i.imgur.com/SUKsx7U.png" },
  { id: 14, name: "Календарь кристаллов", price: 2000, category: "sets",     img: "https://i.imgur.com/8QrvXPv.png" },
  { id: 15, name: "Взломанный комплект",  price: 5500, category: "sets",     img: "https://i.imgur.com/mw1u0AG.png" },
];

const productsContainer = document.getElementById("products");
const cartItems   = document.getElementById("cart-items");
const cartTotal   = document.getElementById("cart-total");
const cartCount   = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const cartEl      = document.getElementById("cart");
const cartToggle  = document.querySelector(".cart-toggle");
const overlay     = document.querySelector(".overlay");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(filter = "all") {
  productsContainer.innerHTML = "";
  const list = filter === "all" ? productsData : productsData.filter(p => p.category === filter);

  list.forEach(p => {
    const inCart = cart.find(x => x.id === p.id);
    const qty    = inCart ? inCart.qty : 0;

    const div = document.createElement("div");
    div.className  = "product-card";
    div.dataset.id = p.id;
    div.innerHTML  = `
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
      const id   = +btn.closest(".product-card").dataset.id;
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
    `${count} ${
      count % 10 === 1 && count % 100 !== 11 ? "товар"
      : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14)
        ? "товара" : "товаров"
    }`;

  checkoutBtn.disabled = total === 0;
  cartEl.classList.toggle("scrollable", cart.length > 2);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const active = document.querySelector(".filter-btn.active")?.dataset.category || "all";
  renderProducts(active);
  renderCart();
}

/* Мобильная корзина: плавающая кнопка + дровер */
(function(){
  if(!cartEl || !cartToggle || !overlay) return;

  function openCart(){
    cartEl.classList.add('is-open');
    cartToggle.setAttribute('aria-expanded','true');
    overlay.classList.remove('hidden');
    document.body.style.overflow='hidden';
  }
  function closeCart(){
    cartEl.classList.remove('is-open');
    cartToggle.setAttribute('aria-expanded','false');
    overlay.classList.add('hidden');
    document.body.style.overflow='';
  }

  cartToggle.addEventListener('click', ()=> cartEl.classList.contains('is-open') ? closeCart() : openCart());
  overlay.addEventListener('click', closeCart);

  // свайп-вниз
  let startY=null;
  cartEl.addEventListener('touchstart', e=>{ startY=e.touches[0].clientY; }, {passive:true});
  cartEl.addEventListener('touchmove', e=>{ if(startY===null)return; if(e.touches[0].clientY-startY>60) closeCart(); }, {passive:true});

  // на ПК закрываем дровер при ресайзе
  window.addEventListener('resize',()=>{ if(window.innerWidth>=993) closeCart(); });
})();

/* Фильтры + SEO/FAQ */
document.querySelectorAll(".filter-btn").forEach(b =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderProducts(b.dataset.category);
    renderSeoBlock(b.dataset.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })
);

/* Кнопка оплаты */
checkoutBtn.addEventListener("click", () => {
  const title = "Star Wars: Galaxy of Heroes";
  let msg = `${title}\n\nСодержимое корзины:\n`, total = 0;
  cart.forEach(it => {
    const p = productsData.find(x => x.id === it.id);
    msg += `• ${p.name} × ${it.qty} — ${p.price * it.qty} ₽\n`;
    total += p.price * it.qty;
  });
  msg += `\nИтого: ${total} ₽`;
  window.open(`https://t.me/DonateTeam_support?text=${encodeURIComponent(msg)}`, "_blank");
});

/* Первичный рендер */
renderProducts();
renderCart();

/* ===== SEO/FAQ ===== */
const seoBlocks = {
  all: { title:"Описание игры",
    intro:`Star Wars: Galaxy of Heroes — коллекционная ролевая RPG от EA и Lucasfilm, где вы собираете команду легендарных героев, прокачиваете их и сражаетесь в эпических баталиях по всей Галактике.`,
    extra:`<h3>Какие виды пополнения в Galaxy of Heroes?</h3>
      <ul>
        <li><strong>Кристаллы</strong> — внутриигровая валюта для ускорения прогресса и разблокировки героев.</li>
        <li><strong>Наборы персонажей</strong> — фрагменты легендарных героев и бонусы к прокачке.</li>
        <li><strong>Боевые пропуски</strong> — доступ к эксклюзивным наградам за еженедельные и сезонные задания.</li>
      </ul>
      <h3>Что выбрать?</h3>
      <p>Новичкам — кристаллы, фанатам коллекционных героев — наборы персонажей, активным игрокам — боевой пропуск.</p>
      <h3>Почему DonateTeam?</h3>
      <p>DonateTeam — ваш надёжный партнёр по пополнению Galaxy of Heroes: быстрые платежи, 24/7 поддержка и лучшие цены на все виды доната.</p>`,
    faqs:[
      {q:"Как быстро происходит донат в Star Wars Galaxy of Heroes?",a:"Донат занимает обычно 5–10 минут. В зависимости от загруженности."},
      {q:"Меня не забанят в Star Wars Galaxy of Heroes?",a:"Оплата проходит через официальный магазин игры. Ваша учётная запись в безопасности при соблюдении всех инструкций."}
    ]},
  crystals:{ title:"Кристаллы в Star Wars: Galaxy of Heroes",
    intro:`Кристаллы — основная игровая валюта для прокачки, ускорения развития, покупки героев и ускорителей прогресса.`,
    extra:`<h3>Для чего нужны кристаллы?</h3>
      <ul><li>Покупка героев и ресурсов.</li><li>Ускорение прокачки.</li><li>Эксклюзивные предметы и возможности.</li></ul>
      <p>Кристаллы подойдут как новичкам, так и продвинутым игрокам!</p>`,
    faqs:[
      {q:"Что дают кристаллы?",a:"За кристаллы можно покупать героев, энергию, ускорять прогресс и многое другое."},
      {q:"Можно ли купить кристаллы дешевле?",a:"Через DonateTeam вы получаете скидку и быструю поддержку."}
    ]},
  sets:{ title:"Наборы в Galaxy of Heroes",
    intro:`Наборы персонажей и ресурсы содержат ценные предметы для ускоренного развития вашей команды и получения редких героев.`,
    extra:`<h3>Что можно найти в наборах?</h3>
      <ul><li>Фрагменты героев, прокачка, уникальные жетоны.</li><li>Энергия, кредиты и другие ресурсы.</li></ul>
      <p>Отличный выбор для коллекционеров и тех, кто хочет ускорить прогресс!</p>`,
    faqs:[
      {q:"Что входит в наборы?",a:"Наборы содержат героев, ресурсы, жетоны и бонусы для прокачки."},
      {q:"Можно ли купить несколько наборов сразу?",a:"Да, вы можете выбрать нужное количество и оформить заказ через корзину."}
    ]},
  passes:{ title:"Пропуски в Galaxy of Heroes",
    intro:`Боевые пропуски открывают доступ к премиальным наградам, заданиям и эксклюзивным бонусам.`,
    extra:`<h3>Зачем покупать пропуск?</h3>
      <ul><li>Доступ к лучшим наградам за события и сезонные активности.</li><li>Эксклюзивные предметы и герои только для владельцев пропуска.</li></ul>
      <p>Лучшее решение для самых активных игроков!</p>`,
    faqs:[
      {q:"Для чего нужны пропуски?",a:"Пропуски дают доступ к сезонным ивентам и эксклюзивным наградам."},
      {q:"На сколько хватает пропуска?",a:"Обычно пропуск действует на сезон или определённый период, указанный в описании."}
    ]}
};

function renderFaqBlock(faqs = []) {
  const faqList = document.querySelector('.faq-list');
  if (!faqList) return;
  faqList.innerHTML = '';
  faqs.forEach(({ q, a }) => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <button class="faq-question">
        <span>${q}</span>
        <span class="faq-toggle">+</span>
      </button>
      <div class="faq-answer">${a}</div>
    `;
    faqList.appendChild(item);
  });

  faqList.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      faqList.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function renderSeoBlock(category = "all") {
  const block = seoBlocks[category] || seoBlocks.all;
  document.querySelector('.seo-title').textContent = block.title;
  document.querySelector('.seo-intro').innerHTML = block.intro;
  document.querySelector('.seo-extra').innerHTML = block.extra;
  document.querySelector('.seo-extra').classList.add('hidden');
  document.querySelector('.seo-toggle').setAttribute("aria-expanded", "false");
  renderFaqBlock(block.faqs || []);
}

// SEO toggle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".seo-toggle");
  const extra = document.querySelector(".seo-extra");
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    extra.classList.toggle("hidden", expanded);
  });
  renderSeoBlock("all");
});
