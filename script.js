// данные
const productsData = [
  { id:1,name:"610 кристаллов",price:550,category:"crystals",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
  { id:2,name:"1340 кристаллов",price:1100,category:"crystals",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id:3,name:"2800 кристаллов",price:2100,category:"crystals",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id:4,name:"7370 кристаллов",price:4600,category:"crystals",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png" },
  { id:5,name:"15710 кристаллов",price:8800,category:"crystals",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png" },
  { id:6,name:"Набор джедая",price:3200,category:"sets",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png" },
  { id:7,name:"Набор ситха",price:4100,category:"sets",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png" },
  { id:8,name:"Боевой пропуск",price:950,category:"passes",img:"https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png" },
];

// селекторы
const productsContainer = document.getElementById("products");
const cartItems         = document.getElementById("cart-items");
const cartTotal         = document.getElementById("cart-total");
const cartCount         = document.getElementById("cart-count");
const checkoutBtn       = document.getElementById("checkout-btn");
const clearCartImg      = document.getElementById("clear-cart-img");
const payModal          = document.getElementById("pay-modal");
const closeModalBtn     = document.querySelector(".modal-close");
const tgBtn             = document.querySelector(".messenger-btn.telegram");
const descToggle        = document.querySelector(".desc-toggle");
const moreDesc          = document.querySelector(".more-desc");

// состояние
let cart = JSON.parse(localStorage.getItem("cart"))||[];

// анимация числа
function animateValue(el,start,end,dur=500){
  let st=null;
  function step(ts){
    if(!st) st=ts;
    const prog=Math.min((ts-st)/dur,1);
    el.textContent=`${Math.floor(prog*(end-start)+start)} ₽`;
    if(prog<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// рендер товаров
function renderProducts(filter="all"){
  productsContainer.innerHTML="";
  const list=(filter==="all"?productsData:productsData.filter(p=>p.category===filter));
  list.forEach(p=>{
    const inCart=cart.find(i=>i.id===p.id);
    const qty=inCart?inCart.qty:0;
    const card=document.createElement("div");
    card.className="product-card";
    card.dataset.id=p.id;
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${p.price} ₽</div>
      ${qty>0?
        `<div class="counter">
           <button class="dec">−</button>
           <span class="count">${qty}</span>
           <button class="inc">+</button>
         </div>`:
        `<button class="add-btn">+</button>`
      }
    `;
    productsContainer.appendChild(card);
  });
  // обработчики
  document.querySelectorAll(".add-btn").forEach(b=>b.onclick=()=>{
    const id=+b.closest(".product-card").dataset.id;
    cart.push({id,qty:1});
    saveAndRepaint();
  });
  document.querySelectorAll(".inc").forEach(b=>b.onclick=()=>{
    const id=+b.closest(".product-card").dataset.id;
    cart.find(i=>i.id===id).qty++;
    saveAndRepaint();
  });
  document.querySelectorAll(".dec").forEach(b=>b.onclick=()=>{
    const id=+b.closest(".product-card").dataset.id;
    const it=cart.find(i=>i.id===id);
    if(it.qty>1) it.qty--; else cart=cart.filter(x=>x.id!==id);
    saveAndRepaint();
  });
}

// рендер корзины
function renderCart(){
  cartItems.innerHTML="";
  let total=0,cnt=0;
  cart.forEach(it=>{
    const p=productsData.find(x=>x.id===it.id);
    total+=p.price*it.qty;
    cnt+=it.qty;
    const li=document.createElement("li");
    li.className="cart-item-card";
    li.innerHTML=`
      <div class="item-header">
        <div class="item-name">${p.name}</div>
        <div class="item-price">${p.price} ₽</div>
      </div>
      <div class="item-counter">
        <button class="dec">−</button>
        <span class="count">${it.qty}</span>
        <button class="inc">+</button>
      </div>
    `;
    cartItems.appendChild(li);
    li.querySelector(".inc").onclick=()=>{it.qty++; saveAndRepaint();};
    li.querySelector(".dec").onclick=()=>{if(it.qty>1)it.qty--;else cart=cart.filter(x=>x.id!==it.id); saveAndRepaint();};
  });
  const prev=parseInt(cartTotal.dataset.prev)||0;
  animateValue(cartTotal,prev,total);
  cartTotal.dataset.prev=total;
  const word=cnt%10===1&&cnt%100!==11?"товар":cnt%10>=2&&cnt%10<=4&&!((cnt%100)>=12&&(cnt%100)<=14)?"товара":"товаров";
  cartCount.textContent=`${cnt} ${word}`;
  checkoutBtn.disabled = total===0;
  document.querySelector(".cart").classList.toggle("scrollable",cart.length>2);
}

// сохранить+рендер
function saveAndRepaint(){
  localStorage.setItem("cart",JSON.stringify(cart));
  renderProducts(document.querySelector(".filter-btn.active").dataset.category);
  renderCart();
}

// фильтры
document.querySelectorAll(".filter-btn").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  renderProducts(b.dataset.category);
});

// checkout->modal
checkoutBtn.onclick=e=>{
  e.preventDefault();
  if(!checkoutBtn.disabled) payModal.classList.remove("hidden");
};

// закрыть modal
closeModalBtn?.addEventListener("click",()=>payModal.classList.add("hidden"));
payModal?.addEventListener("click",e=>{ if(e.target===payModal)payModal.classList.add("hidden"); });

// очистить корзину
clearCartImg.onclick=()=>{ cart=[]; saveAndRepaint(); };

// Telegram-order
tgBtn?.addEventListener("click",()=>{
  const title=document.querySelector(".game-title").textContent.trim();
  let txt=`${title}\n\nСодержание корзины:\n`,sum=0;
  cart.forEach(i=>{ const p=productsData.find(x=>x.id===i.id); const s=p.price*i.qty; sum+=s; txt+=`• ${p.name} × ${i.qty} — ${s} ₽\n`; });
  txt+=`\nИтого: ${sum} ₽`;
  window.open(`https://t.me/DonateTeam_support?text=${encodeURIComponent(txt)}`,"_blank");
});

// description toggle
descToggle.onclick=()=>{
  moreDesc.style.display = moreDesc.style.display==="block"?"none":"block";
  descToggle.closest("h2").classList.toggle("collapsed");
};

// старт
renderProducts();
renderCart();
