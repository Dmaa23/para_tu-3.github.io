const canvas = document.querySelector("canvas");
const cxt = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let text = "My Love";
let fontSize = 26;
let columns = Math.floor(width / (fontSize * 2.5));
let drops = new Array(columns).fill(1);
let speed = 8;
let color = "#FF69B4";
let language = "en";
let frameCount = 0;

let explosions = [];
let clickTexts = [];

function hexToRGB(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function createExplosion(x, y, text, color) {
  const rgb = hexToRGB(color);
  const particles = [];
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 4 + 2;
    const char = text.charAt(Math.floor(Math.random() * text.length));
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      char,
      color: rgb
    });
  }
  explosions.push({ particles });
}

function showTextRain() {
  cxt.fillStyle = "rgba(0, 0, 0, 0.05)";
  cxt.fillRect(0, 0, width, height);

  cxt.fillStyle = color;
  cxt.font = fontSize + "px Arial";

  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize * 2.5;
    const y = drops[i] * fontSize;
    cxt.fillText(text, x, y);
    if (y > height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }

  drawClickTexts();
  drawExplosions();
}

function drawClickTexts() {
  const now = Date.now();
  clickTexts = clickTexts.filter(t => now - t.time < 1000);

  clickTexts.forEach(t => {
    const elapsed = now - t.time;
    if (elapsed < 300) {
      cxt.fillStyle = t.color;
      cxt.font = "bold 40px Arial";
      cxt.textAlign = "center";
      cxt.fillText(t.text, t.x, t.y);
    } else if (!t.exploded) {
      createExplosion(t.x, t.y, t.text, t.color);
      t.exploded = true;
    }
  });
}

function drawExplosions() {
  explosions.forEach((explosion) => {
    explosion.particles.forEach(p => {
      cxt.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      cxt.font = "bold 20px Arial";
      cxt.textAlign = "center";
      cxt.fillText(p.char, p.x, p.y);

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
    });

    explosion.particles = explosion.particles.filter(p => p.alpha > 0);
  });

  explosions = explosions.filter(e => e.particles.length > 0);
}

function animate() {
  frameCount++;
  if (frameCount >= (11 - speed)) {
    showTextRain();
    frameCount = 0;
  }
  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  const currentText = language === "en" ? "My Love" : "Te Amo";
  clickTexts.push({ x, y, text: currentText, color, time: Date.now(), exploded: false });
});

document.getElementById("speedControl").addEventListener("input", (e) => {
  speed = parseInt(e.target.value);
});

document.getElementById("colorControl").addEventListener("input", (e) => {
  color = e.target.value;
});

document.getElementById("languageControl").addEventListener("change", (e) => {
  language = e.target.value;
  text = language === "en" ? "My Love" : "Te Amo";
});

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / (fontSize * 2.5));
  drops = new Array(columns).fill(1);
});

animate();