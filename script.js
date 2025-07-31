const products = [
  { name: "610 кристаллов", price: 550, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png", category: "crystals" },
  { name: "1340 кристаллов", price: 1100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png", category: "crystals" },
  { name: "2800 кристаллов", price: 2100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png", category: "crystals" },
  { name: "7370 кристаллов", price: 4600, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png", category: "crystals" },
  { name: "15710 кристаллов", price: 8800, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png", category: "crystals" },
  { name: "Набор джедая", price: 3200, img: "https://via.placeholder.com/200x150?text=Набор+джедая", category: "sets" },
  { name: "Набор ситха", price: 4100, img: "https://via.placeholder.com/200x150?text=Набор+ситха", category: "sets" },
  { name: "Боевой пропуск", price: 950, img: "https://via.placeholder.com/200x150?text=Боевой+пропуск", category: "passes" }
];

const container = document.getElementById("products");
const navButtons = document.querySelectorAll(".nav-btn");

function renderProducts(filter) {
  container.innerHTML = "";
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price} ₽</p>
      <button class="add-btn">Добавить</button>
    `;
    container.appendChild(card);
  });
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

renderProducts("crystals");
