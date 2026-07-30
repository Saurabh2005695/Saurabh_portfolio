/* ==========================================
   1. WELCOME 3D INTRO SCREEN CONTROLLER
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const loaderFill = document.getElementById('welcome-loader-fill');
  const statusText = document.getElementById('welcome-status-text');
  const counter = document.getElementById('welcome-counter');
  const enterBtn = document.getElementById('welcome-enter-btn');

  let progress = 0;
  const statusMessages = [
    { threshold: 0, text: "INITIALIZING 3D CYBER ENGINE..." },
    { threshold: 30, text: "GENERATING GRID TUNNEL & SHADERS..." },
    { threshold: 65, text: "CALIBRATING SAURABH'S UNIVERSE..." },
    { threshold: 90, text: "SYSTEM READY" }
  ];

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 4) + 2;
    if (progress > 100) progress = 100;

    if (loaderFill) loaderFill.style.width = progress + '%';
    if (counter) counter.textContent = progress + '%';

    const currentMsg = statusMessages.slice().reverse().find(m => progress >= m.threshold);
    if (currentMsg && statusText) {
      statusText.textContent = currentMsg.text;
    }

    if (progress >= 100) {
      clearInterval(interval);
      if (enterBtn) {
        enterBtn.style.opacity = '1';
        enterBtn.style.pointerEvents = 'auto';
      }
    }
  }, 35);

  function dismissWelcome() {
    if (welcomeScreen) {
      welcomeScreen.classList.add('hidden');
      setTimeout(() => {
        welcomeScreen.style.display = 'none';
      }, 850);
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', dismissWelcome);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && progress >= 100 && welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
      dismissWelcome();
    }
  });
});

/* ==========================================
   2. THREE.JS 3D CYBER TUNNEL & GRID MATRIX ENGINE
   ========================================== */
let scene, camera, renderer, particleSystem, torusKnot, gridFloor, gridCeiling, floatingPolyGroup;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function init3DEngine() {
  const canvas = document.getElementById('bg-canvas-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. PARTICLE GALAXY MATRIX
  const particleCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color('#8b5cf6'),
    new THREE.Color('#06b6d4'),
    new THREE.Color('#f97316'),
    new THREE.Color('#ffffff')
  ];

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i] = randomColor.r;
    colors[i + 1] = randomColor.g;
    colors[i + 2] = randomColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.36,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // 2. 3D CYBER GRID FLOOR & CEILING
  gridFloor = new THREE.GridHelper(120, 40, 0x8b5cf6, 0x06b6d4);
  gridFloor.position.y = -25;
  gridFloor.material.opacity = 0.25;
  gridFloor.material.transparent = true;
  scene.add(gridFloor);

  gridCeiling = new THREE.GridHelper(120, 40, 0x06b6d4, 0x8b5cf6);
  gridCeiling.position.y = 25;
  gridCeiling.material.opacity = 0.2;
  gridCeiling.material.transparent = true;
  scene.add(gridCeiling);

  // 3. FLOATING 3D POLYHEDRONS GROUP
  floatingPolyGroup = new THREE.Group();

  // Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(4.5, 0.9, 100, 16);
  const knotMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  torusKnot = new THREE.Mesh(knotGeo, knotMat);
  torusKnot.position.set(18, 5, -10);
  floatingPolyGroup.add(torusKnot);

  // Icosahedron & Dodecahedron
  const icoGeo = new THREE.IcosahedronGeometry(2.5);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  icoMesh.position.set(-18, -8, -5);
  floatingPolyGroup.add(icoMesh);

  const dodGeo = new THREE.DodecahedronGeometry(2);
  const dodMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const dodMesh = new THREE.Mesh(dodGeo, dodMat);
  dodMesh.position.set(-20, 14, -15);
  floatingPolyGroup.add(dodMesh);

  scene.add(floatingPolyGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.0012;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.0012;
  });

  window.addEventListener('resize', onWindowResize);
  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);

  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  const scrollY = window.scrollY || 0;

  if (particleSystem) {
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;
    particleSystem.rotation.y += mouseX * 0.5;
    particleSystem.rotation.x += mouseY * 0.5;
  }

  if (gridFloor) gridFloor.position.z = (scrollY * 0.05) % 30 - 15;
  if (gridCeiling) gridCeiling.position.z = (scrollY * 0.05) % 30 - 15;

  if (torusKnot) {
    torusKnot.rotation.x += 0.006;
    torusKnot.rotation.y += 0.008;
    torusKnot.position.y = 5 + Math.sin(Date.now() * 0.0015) * 1.5;
  }

  if (floatingPolyGroup) {
    floatingPolyGroup.rotation.y = scrollY * 0.0006;
    floatingPolyGroup.position.y = -scrollY * 0.008;
  }

  camera.position.x += (mouseX * 12 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 12 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init3DEngine();
} else {
  document.addEventListener('DOMContentLoaded', init3DEngine);
}

/* ==========================================
   3. MOUSE SPOTLIGHT SHIMMER TRACKER
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card, .project-card, .skill-card, .internship-card, .hero-panel');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});

/* ==========================================
   4. VANILLA TILT 3D CARD PHYSICS
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.25,
      gyroscope: true
    });
  }
});

/* ==========================================
   5. THEME TOGGLE (DARK / LIGHT SYNC)
   ========================================== */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    const icon = themeToggle.querySelector('i');
    const label = themeToggle.querySelector('span');
    if (icon) icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    if (label) label.textContent = theme === 'light' ? 'Light' : 'Dark';
  }
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
});

/* ==========================================
   6. HERO TYPING ANIMATION
   ========================================== */
const words = ["Data Science & Analytics", "Machine Learning Concepts", "Full-Stack Development", "Interactive 3D Web Solutions"];
let wIndex = 0, cIndex = 0, deleting = false;
const typeTarget = document.getElementById('type-target');

function typeLoop() {
  if (!typeTarget) return;
  const word = words[wIndex];
  if (!deleting) {
    cIndex++;
    typeTarget.textContent = word.slice(0, cIndex);
    if (cIndex === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    cIndex--;
    typeTarget.textContent = word.slice(0, cIndex);
    if (cIndex === 0) {
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
if (typeTarget) typeLoop();

/* ==========================================
   7. SCROLL REVEAL OBSERVER
   ========================================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .project-card, .skill-card, .internship-card, .section-title').forEach(el => {
  observer.observe(el);
});

/* ==========================================
   8. MOBILE NAV TOGGLE & CLICK RIPPLE
   ========================================== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('nav-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('nav-open');
    });
  });
}

const rippleLayer = document.getElementById('ripple-layer');
window.addEventListener('click', (e) => {
  if (!rippleLayer) return;
  const r = document.createElement('div');
  r.className = 'ripple';
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.15;
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - size / 2) + 'px';
  r.style.top = (e.clientY - size / 2) + 'px';
  r.style.position = 'fixed';
  r.style.borderRadius = '50%';
  r.style.background = 'radial-gradient(circle, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.15), transparent 70%)';
  r.style.pointerEvents = 'none';
  r.style.transform = 'scale(0)';
  r.style.animation = 'rippleExpand 0.6s ease-out forwards';
  r.style.zIndex = '999';
  rippleLayer.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes rippleExpand {
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(3.5); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);
