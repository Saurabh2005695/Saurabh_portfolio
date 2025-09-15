/* -------------------------
  Typing effect (hero)
------------------------- */
const words = ["Web Applications", "Automation Tools", "Practical Solutions", "Open Source Contributions"];
let wIndex = 0, cIndex = 0, deleting = false;
const typeTarget = document.getElementById('type-target');

function typeLoop(){
  const word = words[wIndex];
  if(!deleting){
    cIndex++;
    typeTarget.textContent = word.slice(0, cIndex);
    if(cIndex === word.length){
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    cIndex--;
    typeTarget.textContent = word.slice(0, cIndex);
    if(cIndex === 0){
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
if(typeTarget) typeLoop();

/* -------------------------
  Click ripple / light effect
  creates a subtle glowing circle where user clicks
------------------------- */
const rippleLayer = document.getElementById('ripple-layer');

document.addEventListener('click', (e) => {
  const r = document.createElement('span');
  r.className = 'ripple';
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.2;
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - size/2) + 'px';
  r.style.top = (e.clientY - size/2) + 'px';
  rippleLayer.appendChild(r);
  setTimeout(()=> r.remove(), 700);
});

/* ripple CSS injected to keep JS & CSS separate for the effect */
const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
  #ripple-layer{position:fixed;left:0;top:0;pointer-events:none;z-index:9999}
  #ripple-layer .ripple{
    position:absolute;border-radius:50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,111,97,0.22), rgba(139,92,246,0.10), rgba(0,229,255,0.04));
    transform:scale(0.2);opacity:0.9;filter:blur(18px);animation:ripple-anim .7s ease-out forwards;
  }
  @keyframes ripple-anim{
    to{transform:scale(1.6);opacity:0}
  }
`;
document.head.appendChild(rippleStyle);

/* -------------------------
  Simple scroll reveal for .card elements
------------------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('reveal');
    }
  });
},{threshold: 0.15});

document.querySelectorAll('.card, .project-card').forEach(el => {
  observer.observe(el);
});

/* reveal CSS */
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
.card, .project-card {transform: translateY(18px);opacity:0;transition:all .6s cubic-bezier(.2,.9,.2,1)}
.card.reveal, .project-card.reveal {transform:none;opacity:1}
`;
document.head.appendChild(revealStyle);
