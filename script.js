const products = [
  { id: 1, name: "610 кристаллов", price: 550, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/610.png", category: "all" },
  { id: 2, name: "1340 кристаллов", price: 1100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/1340.png", category: "all" },
  { id: 3, name: "2800 кристаллов", price: 2100, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/2800.png", category: "all" },
  { id: 4, name: "7370 кристаллов", price: 4600, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/7370.png", category: "all" },
  { id: 5, name: "15710 кристаллов", price: 8800, img: "https://raw.githubusercontent.com/DonateTeam/Star-Wars-Galaxy-of-Heroes/refs/heads/main/15710.png", category: "all" },

  { id: 6, name: "Набор джедая", price: 3200, img: "https://via.placeholder.com/200", category: "sets" },
  { id: 7, name: "Набор ситха", price: 4100, img: "https://via.placeholder.com/200", category: "sets" },

  { id: 8, name: "Боевой пропуск", price: 950, img: "https://via.placeholder.com/200", category: "passes" },
];

const container = document.getElementById("products");
const navBtns = document.querySelectorAll(".nav-btn");

function renderProducts(category) {
  container.innerHTML = "";
  products
    .filter(p => category === "all" || p.category === category)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><b>${p.price} ₽</b></p>
        <button>Добавить</button>
      `;
      container.appendChild(card);
    });
}

navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

renderProducts("all");
