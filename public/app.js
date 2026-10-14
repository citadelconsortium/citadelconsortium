const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primaryNav");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  for (const item of revealItems) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("is-visible");
  }
}

// The marquee loops on translateX(-50%), so the track needs its content twice.
const tickerTrack = document.querySelector(".ticker-track");
if (tickerTrack) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

const canvas = document.querySelector("#constellationCanvas");
const context = canvas?.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  width: 0,
  height: 0,
  points: [],
  mouse: { x: 0, y: 0, active: false }
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

  const pointCount = Math.max(40, Math.min(110, Math.floor(state.width / 15)));
  state.points = Array.from({ length: pointCount }, (_, index) => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height,
    vx: (Math.random() - 0.5) * 0.32,
    vy: (Math.random() - 0.5) * 0.32,
    radius: index % 8 === 0 ? 2.1 : 1.1,
    tone: index % 5 === 0 ? "amber" : "gold"
  }));
}

function drawPoint(point) {
  const colors = {
    gold: "rgba(229, 184, 105, 0.42)",
    amber: "rgba(255, 215, 0, 0.3)"
  };

  context.fillStyle = colors[point.tone];
  context.beginPath();
  context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
  context.fill();
}

function draw() {
  if (!canvas || !context) return;

  context.clearRect(0, 0, state.width, state.height);

  for (const point of state.points) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -10) point.x = state.width + 10;
    if (point.x > state.width + 10) point.x = -10;
    if (point.y < -10) point.y = state.height + 10;
    if (point.y > state.height + 10) point.y = -10;

    if (state.mouse.active) {
      const dx = state.mouse.x - point.x;
      const dy = state.mouse.y - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 130) {
        point.x -= dx * 0.002;
        point.y -= dy * 0.002;
      }
    }
  }

  for (let i = 0; i < state.points.length; i += 1) {
    const point = state.points[i];

    for (let j = i + 1; j < state.points.length; j += 1) {
      const other = state.points[j];
      const dx = point.x - other.x;
      const dy = point.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 138) {
        const alpha = (1 - distance / 138) * 0.15;
        context.strokeStyle = `rgba(229, 184, 105, ${alpha})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }

    drawPoint(point);
  }

  if (!prefersReducedMotion.matches) {
    requestAnimationFrame(draw);
  }
}

if (canvas && context) {
  resizeCanvas();
  draw();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    state.mouse.x = event.clientX;
    state.mouse.y = event.clientY;
    state.mouse.active = true;
  });
  window.addEventListener("pointerleave", () => {
    state.mouse.active = false;
  });
}
