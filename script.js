// Variáveis iniciais
let potatoes = 0;
let clickValue = 1;
let totalCPS = 0;

const buildings = {
  farmer: { count: 0, baseCost: 10, cps: 1 },
  tractor: { count: 0, baseCost: 100, cps: 5 },
  factory: { count: 0, baseCost: 500, cps: 20 },
  satellite: { count: 0, baseCost: 5000, cps: 100 },
  spaceport: { count: 0, baseCost: 25000, cps: 500 },
  wormhole: { count: 0, baseCost: 100000, cps: 1500 },
  cloner: { count: 0, baseCost: 500000, cps: 5000 },
  ai: { count: 0, baseCost: 2000000, cps: 20000 },
  quantumfarm: { count: 0, baseCost: 10000000, cps: 80000 },
  multiverse: { count: 0, baseCost: 50000000, cps: 250000 }
};

const clickUpgrades = {
  upgrade1: { count: 0, baseCost: 50, bonus: 1 },
  upgrade2: { count: 0, baseCost: 200, bonus: 2 },
  upgrade3: { count: 0, baseCost: 1000, bonus: 5 },
  upgrade4: { count: 0, baseCost: 3000, bonus: 10 },
  upgrade5: { count: 0, baseCost: 10000, bonus: 25 },
  upgrade6: { count: 0, baseCost: 50000, bonus: 75 },
  upgrade7: { count: 0, baseCost: 200000, bonus: 250 },
  upgrade8: { count: 0, baseCost: 1000000, bonus: 1000 },
  upgrade9: { count: 0, baseCost: 5000000, bonus: 4000 },
  upgrade10: { count: 0, baseCost: 20000000, bonus: 15000 }
};

const buildingOrder = Object.keys(buildings);
const clickUpgradeOrder = Object.keys(clickUpgrades);

function loadGame() {
  const data = JSON.parse(localStorage.getItem("potatoClickerSave"));
  if (data) {
    potatoes = data.potatoes;
    clickValue = data.clickValue;
    Object.assign(buildings, data.buildings);
    Object.assign(clickUpgrades, data.clickUpgrades);
  }
}

function saveGame() {
  localStorage.setItem(
    "potatoClickerSave",
    JSON.stringify({ potatoes, clickValue, buildings, clickUpgrades })
  );
}

function resetGame() {
  localStorage.removeItem("potatoClickerSave");
  location.reload();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateDisplay() {
  document.getElementById("potato-count").textContent = potatoes;
  document.getElementById("batatas-por-clique").textContent = clickValue;
  document.getElementById("batatas-por-segundo").textContent = totalCPS;

  for (const name in buildings) {
    const span = document.getElementById(`${name}-count`);
    if (span) span.textContent = buildings[name].count;
  }
  for (const key in clickUpgrades) {
    const span = document.getElementById(`click-upgrade-${key.replace("upgrade", "")}-count`);
    if (span) span.textContent = clickUpgrades[key].count;
  }
}

function updatePotatoImage(buildingName) {
  const imageMap = {
    farmer: "assets/fazendeiro.gif",
    tractor: "assets/trator.gif",
    factory: "assets/fabrica.gif",
    satellite: "assets/satelite.gif",
    spaceport: "assets/spaceport.gif",
    wormhole: "assets/wormhole.gif",
    cloner: "assets/cloner.gif",
    ai: "assets/ai.gif",
    quantumfarm: "assets/quantumfarm.gif",
    multiverse: "assets/multiverse.gif"
  };

  const img = document.getElementById("potato");
  if (buildings[buildingName].count === 1 && imageMap[buildingName]) {
    img.src = imageMap[buildingName];
  }
}

function buyBuilding(name) {
  const item = buildings[name];
  const cost = Math.floor(item.baseCost * Math.pow(1.15, item.count));
  if (potatoes >= cost) {
    potatoes -= cost;
    item.count++;
    updateDisplay();
    checkUnlocks();
    updatePotatoImage(name);
  }
}

function buyClickUpgrade(key) {
  const upgrade = clickUpgrades[key];
  const cost = Math.floor(upgrade.baseCost * Math.pow(1.25, upgrade.count));
  if (potatoes >= cost) {
    potatoes -= cost;
    upgrade.count++;
    clickValue += upgrade.bonus;
    updateDisplay();
    checkUnlocks();
  }
}

function checkUnlocks() {
  for (let i = 1; i < buildingOrder.length; i++) {
    const prev = buildings[buildingOrder[i - 1]];
    const btn = document.getElementById(`buy-${buildingOrder[i]}`);
    if (prev.count >= 10 && btn && btn.style.display === "none") {
      btn.style.display = "block";
    }
  }

  for (let i = 1; i < clickUpgradeOrder.length; i++) {
    const prev = clickUpgrades[clickUpgradeOrder[i - 1]];
    const block = document.getElementById(`${clickUpgradeOrder[i]}-block`);
    if (prev.count >= 10 && block && block.style.display === "none") {
      block.style.display = "block";
    }
  }
}

function renderButtons() {
  const buildingContainer = document.getElementById("building-buttons");
  const clickContainer = document.getElementById("click-upgrade-buttons");

  buildingOrder.forEach(name => {
    const cost = Math.floor(buildings[name].baseCost);
    const btn = document.createElement("button");
    btn.id = `buy-${name}`;
    btn.textContent = `Comprar ${capitalize(name)} (${cost} batatas)`;
    btn.style.display = name === "farmer" ? "block" : "none";
    btn.addEventListener("click", () => buyBuilding(name));
    const count = document.createElement("p");
    count.innerHTML = `${capitalize(name)}s: <span id="${name}-count">0</span>`;
    buildingContainer.appendChild(btn);
    buildingContainer.appendChild(count);
  });

  clickUpgradeOrder.forEach((key, index) => {
    const cost = clickUpgrades[key].baseCost;
    const block = document.createElement("div");
    block.id = `${key}-block`;
    if (index !== 0) block.style.display = "none";

    const btn = document.createElement("button");
    btn.id = `click-upgrade-${index + 1}`;
    btn.textContent = `${capitalize(key)} (${cost} batatas)`;
    btn.addEventListener("click", () => buyClickUpgrade(key));

    const count = document.createElement("p");
    count.innerHTML = `Nível: <span id="click-upgrade-${index + 1}-count">0</span>`;

    block.appendChild(btn);
    block.appendChild(count);
    clickContainer.appendChild(block);
  });
}

loadGame();
renderButtons();
updateDisplay();

setInterval(() => {
  totalCPS = 0;
  for (const name in buildings) {
    totalCPS += buildings[name].count * buildings[name].cps;
  }
  potatoes += totalCPS;
  updateDisplay();
  saveGame();
}, 1000);

document.getElementById("potato").addEventListener("click", () => {
  potatoes += clickValue;
  updateDisplay();
});

document.getElementById("dev-button").addEventListener("click", () => {
  potatoes += 1000;
  updateDisplay();
});