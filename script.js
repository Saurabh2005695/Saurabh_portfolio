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
   2. THREE.JS 3D SKY & STARRY CELESTIAL ENGINE
   ========================================== */
let scene, camera, renderer, starSystem, moonMesh, moonAura, cloudGroup, meteorGroup;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
const meteors = [];

function init3DEngine() {
  const canvas = document.getElementById('bg-canvas-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. TWINKLING STARFIELD (2,500 STARS)
  const starCount = 2500;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const starPalettes = [
    new THREE.Color('#ffffff'),
    new THREE.Color('#e0f2fe'),
    new THREE.Color('#bae6fd'),
    new THREE.Color('#ddd6fe'),
    new THREE.Color('#fef08a'),
    new THREE.Color('#38bdf8')
  ];

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 170;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 150;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 120 - 10;

    const col = starPalettes[Math.floor(Math.random() * starPalettes.length)];
    starColors[i3] = col.r;
    starColors[i3 + 1] = col.g;
    starColors[i3 + 2] = col.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  starSystem = new THREE.Points(starGeo, starMat);
  scene.add(starSystem);

  // 2. 3D CELESTIAL MOON & SOFT ATMOSPHERIC AURA
  const moonGeo = new THREE.SphereGeometry(4.8, 32, 32);
  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xf8fafc,
    transparent: true,
    opacity: 0.88
  });
  moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(22, 16, -20);
  scene.add(moonMesh);

  // Soft Moon Glow Ring
  const auraGeo = new THREE.RingGeometry(5.0, 9.2, 32);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  });
  moonAura = new THREE.Mesh(auraGeo, auraMat);
  moonAura.position.set(22, 16, -20.1);
  scene.add(moonAura);

  // 3. FLOATING VOLUMETRIC SKY CLOUDS
  cloudGroup = new THREE.Group();
  const cloudCount = 8;
  for (let c = 0; c < cloudCount; c++) {
    const cloudGeo = new THREE.DodecahedronGeometry(Math.random() * 5 + 4, 1);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.15 + Math.random() * 0.12
    });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set(
      (Math.random() - 0.5) * 130,
      (Math.random() - 0.5) * 55 - 5,
      (Math.random() - 0.5) * 45 - 20
    );
    cloudGroup.add(cloud);
  }
  scene.add(cloudGroup);

  // 4. SHOOTING STARS (METEORS) GROUP
  meteorGroup = new THREE.Group();
  scene.add(meteorGroup);

  function createMeteor() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([0, 0, 0, -7, 4.5, -2]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 1,
      linewidth: 2
    });

    const line = new THREE.Line(geometry, material);
    line.position.set(
      (Math.random() - 0.5) * 100 + 20,
      Math.random() * 45 + 10,
      (Math.random() - 0.5) * 40
    );

    line.userData = {
      speedX: -(Math.random() * 1.8 + 1.2),
      speedY: -(Math.random() * 1.2 + 0.8),
      life: 1.0
    };

    meteorGroup.add(line);
    meteors.push(line);
  }

  // Periodically spawn meteors
  setInterval(() => {
    if (meteors.length < 4 && Math.random() > 0.25) {
      createMeteor();
    }
  }, 2000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
  });

  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      targetMouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.0008;
      targetMouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.0008;
    }
  }, { passive: true });

  window.addEventListener('resize', onWindowResize);
  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);

  const time = Date.now() * 0.002;
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  const scrollY = window.scrollY || 0;

  // Starfield Rotation & Twinkle
  if (starSystem) {
    starSystem.rotation.y += 0.0003;
    starSystem.rotation.x = mouseY * 0.4;
    starSystem.rotation.y += mouseX * 0.4;
  }

  // Floating Moon Movement
  if (moonMesh) {
    moonMesh.position.y = 16 + Math.sin(time * 0.5) * 1.2;
    moonMesh.position.x = 22 + Math.cos(time * 0.3) * 0.8;
  }
  if (moonAura) {
    moonAura.position.y = 16 + Math.sin(time * 0.5) * 1.2;
    moonAura.position.x = 22 + Math.cos(time * 0.3) * 0.8;
  }

  // Floating Sky Clouds Drifting
  if (cloudGroup) {
    cloudGroup.children.forEach((cloud, index) => {
      cloud.position.x += 0.015 * (index % 2 === 0 ? 1 : 0.7);
      if (cloud.position.x > 75) cloud.position.x = -75;
      cloud.rotation.z += 0.001;
    });
    cloudGroup.position.y = -scrollY * 0.006;
  }

  // Animate Meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const meteor = meteors[i];
    meteor.position.x += meteor.userData.speedX;
    meteor.position.y += meteor.userData.speedY;
    meteor.userData.life -= 0.025;
    meteor.material.opacity = Math.max(0, meteor.userData.life);

    if (meteor.userData.life <= 0) {
      meteorGroup.remove(meteor);
      meteors.splice(i, 1);
    }
  }

  camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
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
