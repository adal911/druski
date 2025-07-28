document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context!");
    return;
  }

  let particlesArray = [];
  const particleColor = "rgba(209, 213, 219, 0.7)";
  const particleRadius = 1.5;

  const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
  };

  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 15 + 5;
      this.size = particleRadius;
      this.color = particleColor;
      this.driftVx = (Math.random() - 0.5) * 0.15;
      this.driftVy = (Math.random() - 0.5) * 0.15;
      this.vx = this.driftVx;
      this.vy = this.driftVy;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.baseX += this.driftVx;
      this.baseY += this.driftVy;

      if (this.baseX <= 0 || this.baseX >= canvas.width) {
        this.driftVx *= -1;
        this.baseX += this.driftVx * 2;
      }
      if (this.baseY <= 0 || this.baseY >= canvas.height) {
        this.driftVy *= -1;
        this.baseY += this.driftVy * 2;
      }

      let repulsionForceX = 0;
      let repulsionForceY = 0;
      let isMouseActive = mouse.x !== undefined && mouse.y !== undefined;

      if (isMouseActive) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          repulsionForceX = -Math.cos(angle) * force * this.density * 0.3;
          repulsionForceY = -Math.sin(angle) * force * this.density * 0.3;
        }
      }

      const returnSpeed = 0.08;
      let returnForceX = (this.baseX - this.x) * returnSpeed;
      let returnForceY = (this.baseY - this.y) * returnSpeed;

      this.vx = returnForceX + repulsionForceX + this.driftVx;
      this.vy = returnForceY + repulsionForceY + this.driftVy;

      this.x += this.vx;
      this.y += this.vy;

      this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
      this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
  }

  function init() {
    particlesArray = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = calculateParticleCount();

    for (let i = 0; i < count; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      particlesArray.push(new Particle(x, y));
    }
  }

  function calculateParticleCount() {
    const area = window.innerWidth * window.innerHeight;

    const calculatedCount = Math.floor(area / 3500);
    return Math.max(80, Math.min(350, calculatedCount));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      if (particlesArray[i]) {
        // Basic check
        particlesArray[i].update();
        particlesArray[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      init();
    }, 250);
  });

  init();
  animate();
});