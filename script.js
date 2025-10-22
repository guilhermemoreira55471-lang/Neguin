const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const categorias = [
  "Nome", "CEP", "Animal", "Comida", "Marca", "Objeto", "Filme/Série"
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const selectedLetterDisplay = document.getElementById("selectedLetter");
const inputsArea = document.getElementById("inputsArea");
const scoreButton = document.getElementById("scoreButton");
const resultsContainer = document.getElementById("resultsContainer");

let currentLetter = "?";
let isSpinning = false;

// Desenha a roleta no canvas
function drawWheel() {
  const num = letras.length;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX - 10;
  const angle = (2 * Math.PI) / num;

  for (let i = 0; i < num; i++) {
    const start = i * angle;
    const end = start + angle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#0ea5e9" : "#38bdf8";
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(start + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#0f172a";
    ctx.font = "20px Arial";
    ctx.fillText(letras[i], radius - 10, 5);
    ctx.restore();
  }
}

// Cria os campos para as categorias
function createInputs() {
  inputsArea.innerHTML = "";
  categorias.forEach((cat, idx) => {
    const label = document.createElement("label");
    label.innerHTML = `
      ${cat}
      <input type="text" data-categoria="${idx}" placeholder="Digite..." />
    `;
    inputsArea.appendChild(label);
  });
}

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

// Gira a roleta com animação e escolhe uma letra
spinButton.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;

  const randIndex = Math.floor(Math.random() * letras.length);
  const anglePerLetter = (2 * Math.PI) / letras.length;
  const targetAngle = (2 * Math.PI * 4) + randIndex * anglePerLetter;

  let start = null;
  const duration = 3000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const rotation = targetAngle * ease;

    canvas.style.transform = `rotate(${rotation}rad)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.transform = "rotate(0rad)";
      currentLetter = letras[randIndex];
      selectedLetterDisplay.textContent = currentLetter;
      isSpinning = false;
    }
  }

  requestAnimationFrame(animate);
});

// Calcula pontuação e mostra o resultado
scoreButton.addEventListener("click", () => {
  const inputs = document.querySelectorAll("input[data-categoria]");
  let total = 0;
  resultsContainer.innerHTML = "";

  inputs.forEach((input, idx) => {
    const valor = input.value.trim();
    const normal = normalize(valor);
    const categoria = categorias[idx];
    const startsWithLetter = normal.startsWith(currentLetter);

    let pontos = 0;
    if (valor === "") {
      pontos = 0;
    } else if (startsWithLetter) {
      pontos = 10;
    } else {
      pontos = 0;
    }

    total += pontos;

    const p = document.createElement("p");
    p.textContent = `${categoria}: "${valor || "-"}" → ${pontos} pontos`;
    resultsContainer.appendChild(p);
  });

  const totalP = document.createElement("p");
  totalP.style.marginTop = "10px";
  totalP.style.fontWeight = "bold";
  totalP.textContent = `Total: ${total} pontos`;
  resultsContainer.appendChild(totalP);
});

// Inicialização
drawWheel();
createInputs();
