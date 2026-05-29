#!/bin/bash

WEBROOT="/var/www"

write_page() {
  local DIR=$1
  local DOMAIN=$2

  mkdir -p "$DIR"
  cat > "$DIR/index.html" << HTMLEOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${DOMAIN}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #000;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Courier New', monospace;
  }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 120;
const particles = [];

function rand(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = rand(0, W);
    this.y = init ? rand(0, H) : (Math.random() < 0.5 ? -10 : H + 10);
    this.size = rand(1, 3.5);
    this.speedX = rand(-0.4, 0.4);
    this.speedY = rand(0.2, 0.8) * (this.y < 0 ? 1 : -1);
    this.alpha = rand(0.2, 0.8);
    this.hue = rand(180, 260);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -20 || this.y > H + 20) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'hsla(' + this.hue + ',80%,70%,' + this.alpha + ')';
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

const text = '${DOMAIN}';
const LETTERS = [];
for (let i = 0; i < text.length; i++) {
  LETTERS.push({
    char: text[i],
    phase: rand(0, Math.PI * 2),
    speed: rand(0.02, 0.05),
    amp: rand(6, 18),
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => { p.update(); p.draw(); });

  const fontSize = Math.min(W * 0.07, 72);
  ctx.font = 'bold ' + fontSize + 'px Courier New, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const totalWidth = ctx.measureText(text).width;
  let cursor = W / 2 - totalWidth / 2;

  for (let i = 0; i < LETTERS.length; i++) {
    const l = LETTERS[i];
    l.phase += l.speed;
    const dy = Math.sin(l.phase) * l.amp;
    const dx = Math.cos(l.phase * 0.7) * (l.amp * 0.3);
    const w = ctx.measureText(l.char).width;

    ctx.shadowColor = 'rgba(140,180,255,0.6)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText(l.char, cursor + w / 2 + dx, H / 2 + dy);
    cursor += w;
  }
  ctx.shadowBlur = 0;

  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>
HTMLEOF
  echo "  Written: $DIR/index.html"
}

echo "Creating landing pages..."
write_page "$WEBROOT/boogertime.xyz"        "boogertime.xyz"
write_page "$WEBROOT/api.boogertime.xyz"    "api.boogertime.xyz"
write_page "$WEBROOT/booger.boogertime.xyz" "booger.boogertime.xyz"
write_page "$WEBROOT/dash.boogertime.xyz"   "dash.boogertime.xyz"
write_page "$WEBROOT/www.boogertime.xyz"    "www.boogertime.xyz"
echo "Done!"
