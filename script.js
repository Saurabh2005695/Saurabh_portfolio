/* ==========================================================================
   Saurabh Shriwastava Portfolio - Interactive 3D WebGL & UI Animation Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Custom Glowing Pointer Cursor
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  } else if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 400, fill: "forwards" });
    });
  }

  // ==========================================
  // 2. Welcome Splash Screen Animation
  // ==========================================
  const welcomeScreen = document.getElementById('welcome-screen');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const enterBtn = document.getElementById('enter-btn');
  const welcomeTypewriter = document.getElementById('welcome-typewriter');

  const welcomeText = "Initializing Saurabh Shriwastava's 3D Interactive Workspace...";
  let textIndex = 0;

  function typeWelcomeText() {
    if (welcomeTypewriter && textIndex < welcomeText.length) {
      welcomeTypewriter.textContent += welcomeText.charAt(textIndex);
      textIndex++;
      setTimeout(typeWelcomeText, 40);
    }
  }
  typeWelcomeText();

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      if (enterBtn) {
        enterBtn.disabled = false;
        enterBtn.classList.remove('disabled');
        enterBtn.classList.add('pulse-btn');
      }
    }
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = `${progress}%`;
  }, 100);

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (welcomeScreen) {
        welcomeScreen.classList.add('fade-out');
        setTimeout(() => {
          welcomeScreen.style.display = 'none';
        }, 800);
      }
    });
  }

  // ==========================================
  // 3. Three.js 3D WebGL Background Scene
  // ==========================================
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud Geometry
    const particlesCount = 750;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 85;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.13,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating 3D Geometric Objects
    const geoGroup = new THREE.Group();

    // 1. Icosahedron (Violet Wireframe)
    const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x7f00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-18, 10, -5);
    geoGroup.add(icoMesh);

    // 2. TorusKnot (Cyan Wireframe)
    const torusGeo = new THREE.TorusKnotGeometry(3.2, 0.85, 100, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(20, -10, -8);
    geoGroup.add(torusMesh);

    // 3. Octahedron (Magenta Wireframe)
    const octaGeo = new THREE.OctahedronGeometry(3.2, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.position.set(15, 12, -10);
    geoGroup.add(octaMesh);

    scene.add(geoGroup);

    // Mouse & Touch Parallax Movement
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('touchmove', (event) => {
      if (event.touches && event.touches[0]) {
        targetX = (event.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetY = (event.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    }, { passive: true });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle cloud
      particlesMesh.rotation.y = elapsedTime * 0.03;
      particlesMesh.rotation.x = elapsedTime * 0.02;

      // Rotate floating geometries
      icoMesh.rotation.x = elapsedTime * 0.2;
      icoMesh.rotation.y = elapsedTime * 0.3;

      torusMesh.rotation.x = elapsedTime * 0.25;
      torusMesh.rotation.z = elapsedTime * 0.2;

      octaMesh.rotation.y = elapsedTime * 0.4;

      // Parallax smooth camera movement
      camera.position.x += (targetX * 3.5 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 3.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    // Window Resize & Responsive 3D Scaling Event
    function update3DScaling() {
      if (window.innerWidth < 768) {
        camera.position.z = 38;
        icoMesh.position.set(-10, 14, -10);
        torusMesh.position.set(12, -14, -10);
        octaMesh.position.set(10, 16, -12);
      } else {
        camera.position.z = 30;
        icoMesh.position.set(-18, 10, -5);
        torusMesh.position.set(20, -10, -8);
        octaMesh.position.set(15, 12, -10);
      }
    }
    update3DScaling();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      update3DScaling();
    });
  }

  // ==========================================
  // 4. Hero Dynamic Typewriter Effect
  // ==========================================
  const heroTypewriter = document.getElementById('hero-typewriter');
  if (heroTypewriter) {
    const roles = [
      "Data Science & Analytics",
      "Full-Stack Web Development",
      "Machine Learning Concepts",
      "Interactive 3D Web Solutions",
      "Quantitative & Algorithmic Analysis"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRoles() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        heroTypewriter.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        heroTypewriter.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
      }

      setTimeout(typeRoles, typeSpeed);
    }
    typeRoles();
  }

  // ==========================================
  // 5. 3D Card Tilt Interaction
  // ==========================================
  const tiltCards = document.querySelectorAll('.tilt-card, #hero-card');

  tiltCards.forEach(card => {
    const updateTilt = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (centerY - y) / 12;
      const rotateY = (x - centerX) / 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    card.addEventListener('mousemove', (e) => updateTilt(e.clientX, e.clientY));
    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
    card.addEventListener('touchend', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // ==========================================
  // 6. Skill Category Filter Logic
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // 7. Navbar Scroll Effect & Mobile Toggle
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    const toggleIcon = mobileToggle.querySelector('i');

    function closeMobileMenu() {
      navLinks.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-bars';
      }
    }

    function openMobileMenu() {
      navLinks.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-xmark';
      }
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // 8. Contact Form & Back to Top Handling
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = document.getElementById('name').value;
      alert(`Thank you, ${name}! Your message is being sent to Saurabh Shriwastava.`);
    });
  }

});
