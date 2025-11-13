// JAFFSTUDIO - Professional 3D Background Animations

// ============================================
// PARTICLE SYSTEM
// ============================================

function initParticleSystem() {
  const sections = document.querySelectorAll('.hero, .section');

  sections.forEach((section, index) => {
    // Only add to certain sections to avoid overwhelming
    if (index % 2 === 0 || section.classList.contains('hero')) {
      const particleContainer = document.createElement('div');
      particleContainer.className = 'particles-bg';

      // Create particles
      const particleCount = window.innerWidth > 768 ? 30 : 15;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const sizes = ['small', 'medium', 'large'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

        particle.className = `particle ${randomSize}`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';

        particleContainer.appendChild(particle);
      }

      section.insertBefore(particleContainer, section.firstChild);
    }
  });
}

// ============================================
// GEOMETRIC SHAPES
// ============================================

function initGeometricShapes() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const geometricContainer = document.createElement('div');
  geometricContainer.className = 'geometric-bg';

  // Create various shapes
  const shapes = [
    { type: 'cube', top: '10%', left: '10%', delay: 0 },
    { type: 'circle', top: '20%', right: '15%', delay: 5 },
    { type: 'triangle', bottom: '15%', left: '20%', delay: 10 },
    { type: 'cube', top: '60%', right: '25%', delay: 3 },
    { type: 'circle', bottom: '25%', right: '10%', delay: 7 }
  ];

  shapes.forEach(shape => {
    const element = document.createElement('div');
    element.className = `geometric-shape shape-${shape.type}`;

    if (shape.top) element.style.top = shape.top;
    if (shape.bottom) element.style.bottom = shape.bottom;
    if (shape.left) element.style.left = shape.left;
    if (shape.right) element.style.right = shape.right;
    element.style.animationDelay = shape.delay + 's';

    geometricContainer.appendChild(element);
  });

  hero.insertBefore(geometricContainer, hero.firstChild);
}

// ============================================
// FLOATING ORBS
// ============================================

function initFloatingOrbs() {
  const sections = document.querySelectorAll('.hero');

  sections.forEach(section => {
    const orbContainer = document.createElement('div');
    orbContainer.className = 'floating-orbs';

    for (let i = 1; i <= 3; i++) {
      const orb = document.createElement('div');
      orb.className = `orb orb-${i}`;
      orbContainer.appendChild(orb);
    }

    section.insertBefore(orbContainer, section.firstChild);
  });
}

// ============================================
// GRADIENT MESH
// ============================================

function initGradientMesh() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const mesh = document.createElement('div');
  mesh.className = 'gradient-mesh';
  hero.insertBefore(mesh, hero.firstChild);
}

// ============================================
// WAVE BACKGROUND
// ============================================

function initWaveBackground() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    // Add waves to alternating sections
    if (index % 3 === 1) {
      const waveContainer = document.createElement('div');
      waveContainer.className = 'wave-bg';

      for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        waveContainer.appendChild(wave);
      }

      section.insertBefore(waveContainer, section.firstChild);
    }
  });
}

// ============================================
// 3D GRID
// ============================================

function init3DGrid() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    // Add grid to specific sections
    if (index % 4 === 2) {
      const grid = document.createElement('div');
      grid.className = 'grid-3d';
      section.insertBefore(grid, section.firstChild);
    }
  });
}

// ============================================
// NOISE TEXTURE
// ============================================

function initNoiseTexture() {
  const sections = document.querySelectorAll('.hero, .section');

  sections.forEach(section => {
    const noise = document.createElement('div');
    noise.className = 'noise-bg';
    section.insertBefore(noise, section.firstChild);
  });
}

// ============================================
// INTERACTIVE SPOTLIGHT
// ============================================

function initSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  hero.appendChild(spotlight);

  // Mouse movement effect
  let mouseX = 0, mouseY = 0;
  let spotlightX = 0, spotlightY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function animateSpotlight() {
    spotlightX += (mouseX - spotlightX) * 0.1;
    spotlightY += (mouseY - spotlightY) * 0.1;

    spotlight.style.left = spotlightX + 'px';
    spotlight.style.top = spotlightY + 'px';

    requestAnimationFrame(animateSpotlight);
  }

  animateSpotlight();
}

// ============================================
// SCANLINE EFFECT
// ============================================

function initScanlines() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const scanlines = document.createElement('div');
  scanlines.className = 'scanlines';
  hero.insertBefore(scanlines, hero.firstChild);
}

// ============================================
// DOT GRID
// ============================================

function initDotGrid() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    if (index % 3 === 0) {
      const dotGrid = document.createElement('div');
      dotGrid.className = 'dot-grid';
      section.insertBefore(dotGrid, section.firstChild);
    }
  });
}

// ============================================
// PARALLAX LAYERS
// ============================================

function initParallaxLayers() {
  const hero = document.querySelector('.hero');
  if (!hero || window.innerWidth <= 768) return;

  const parallaxBg = document.createElement('div');
  parallaxBg.className = 'parallax-bg';

  for (let i = 1; i <= 2; i++) {
    const layer = document.createElement('div');
    layer.className = `parallax-layer parallax-layer-${i}`;
    parallaxBg.appendChild(layer);
  }

  hero.insertBefore(parallaxBg, hero.firstChild);

  // Parallax scroll effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const layers = parallaxBg.querySelectorAll('.parallax-layer');

    layers.forEach((layer, index) => {
      const speed = (index + 1) * 0.3;
      layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// ============================================
// CANVAS PARTICLE ANIMATION
// ============================================

function initCanvasParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';

  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class CanvasParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = window.innerWidth > 768 ? 50 : 25;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new CanvasParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================
// 3D ROTATING CUBE (Canvas)
// ============================================

function init3DRotatingCube() {
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, index) => {
    if (index === 2 && window.innerWidth > 768) { // Only on specific section and desktop
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      canvas.style.position = 'absolute';
      canvas.style.top = '10%';
      canvas.style.right = '5%';
      canvas.style.opacity = '0.05';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';

      section.insertBefore(canvas, section.firstChild);

      const ctx = canvas.getContext('2d');
      let angleX = 0, angleY = 0;

      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      function rotateX(point, angle) {
        const [x, y, z] = point;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [x, y * cos - z * sin, y * sin + z * cos];
      }

      function rotateY(point, angle) {
        const [x, y, z] = point;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [x * cos + z * sin, y, -x * sin + z * cos];
      }

      function project(point) {
        const scale = 50;
        const [x, y, z] = point;
        const distance = 5;
        const factor = distance / (distance + z);
        return [
          x * factor * scale + canvas.width / 2,
          y * factor * scale + canvas.height / 2
        ];
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;

        const rotatedVertices = vertices.map(v => {
          let rotated = rotateX(v, angleX);
          rotated = rotateY(rotated, angleY);
          return rotated;
        });

        edges.forEach(([start, end]) => {
          const [x1, y1] = project(rotatedVertices[start]);
          const [x2, y2] = project(rotatedVertices[end]);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        angleX += 0.01;
        angleY += 0.01;

        requestAnimationFrame(draw);
      }

      draw();
    }
  });
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================

function init3DAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    console.log('Animations disabled: User prefers reduced motion');
    return;
  }

  // Initialize all animation systems
  initParticleSystem();
  initGeometricShapes();
  initFloatingOrbs();
  initGradientMesh();
  initWaveBackground();
  init3DGrid();
  initNoiseTexture();
  initSpotlight();
  initScanlines();
  initDotGrid();
  initParallaxLayers();

  // Canvas-based animations (more intensive)
  if (window.innerWidth > 768) {
    initCanvasParticles();
    init3DRotatingCube();
  }

  console.log('3D Background Animations Initialized ✨');
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function monitorPerformance() {
  let frameCount = 0;
  let lastTime = performance.now();

  function checkFPS() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));

      // If FPS drops below 30, reduce animations
      if (fps < 30) {
        console.warn('Low FPS detected, reducing animations');
        document.querySelectorAll('.particle.large, .orb-3').forEach(el => el.remove());
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  }

  requestAnimationFrame(checkFPS);
}

// ============================================
// START ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure page elements are loaded
  setTimeout(() => {
    init3DAnimations();
    monitorPerformance();
  }, 500);
});

// Re-initialize on window resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Refresh canvas-based animations on resize
    if (window.innerWidth > 768) {
      console.log('Re-initializing animations on resize');
    }
  }, 500);
});
