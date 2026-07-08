const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const canvas = document.querySelector("#networkCanvas");
const context = canvas?.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  width: 0,
  height: 0,
  points: []
};

function resizeCanvas() {
  if (!canvas || !context) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * ratio);
  canvas.height = Math.floor(state.height * ratio);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const pointCount = Math.max(30, Math.min(86, Math.floor(state.width / 18)));
  state.points = Array.from({ length: pointCount }, (_, index) => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    radius: index % 7 === 0 ? 2.2 : 1.35
  }));
}

function draw() {
  if (!canvas || !context) return;

  context.clearRect(0, 0, state.width, state.height);

  for (const point of state.points) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > state.width) point.vx *= -1;
    if (point.y < 0 || point.y > state.height) point.vy *= -1;
  }

  for (let i = 0; i < state.points.length; i += 1) {
    const point = state.points[i];

    for (let j = i + 1; j < state.points.length; j += 1) {
      const other = state.points[j];
      const dx = point.x - other.x;
      const dy = point.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 150) {
        const alpha = (1 - distance / 150) * 0.2;
        context.strokeStyle = `rgba(16, 47, 90, ${alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }

    context.fillStyle = "rgba(212, 169, 73, 0.42)";
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fill();
  }

  if (!prefersReducedMotion.matches) {
    requestAnimationFrame(draw);
  }
}

if (canvas && context) {
  resizeCanvas();
  draw();
  window.addEventListener("resize", resizeCanvas);
}
