// Animated background effects
document.addEventListener('DOMContentLoaded', function() {
  const animatedBg = document.querySelector('.animated-bg');
  
  if (!animatedBg) return;
  
  // Create floating particles
  for (let i = 0; i < 20; i++) {
    createParticle(animatedBg);
  }
  
  // Create occasional pulsing circles
  setInterval(() => {
    createPulse(animatedBg);
  }, 3000);
});

function createParticle(container) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = Math.random() * 4 + 1 + 'px';
  particle.style.height = particle.style.width;
  particle.style.background = 'rgba(0, 217, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
  particle.style.borderRadius = '50%';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  
  container.appendChild(particle);
  
  // Animate particle
  animateParticle(particle);
}

function animateParticle(element) {
  const startX = parseFloat(element.style.left);
  const startY = parseFloat(element.style.top);
  
  const endX = startX + (Math.random() * 40 - 20);
  const endY = startY + (Math.random() * 40 - 20);
  
  const duration = Math.random() * 10000 + 5000;
  
  let startTime = null;
  
  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease function
    const ease = progress < 0.5 ? 
      2 * progress * progress : 
      -1 + (4 - 2 * progress) * progress;
    
    const currentX = startX + (endX - startX) * ease;
    const currentY = startY + (endY - startY) * ease;
    
    element.style.left = currentX + '%';
    element.style.top = currentY + '%';
    
    // Fade in/out
    if (progress < 0.5) {
      element.style.opacity = progress * 2;
    } else {
      element.style.opacity = 2 - progress * 2;
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Reset and restart animation
      element.style.left = startX + '%';
      element.style.top = startY + '%';
      setTimeout(() => {
        startTime = null;
        requestAnimationFrame(animate);
      }, 1000);
    }
  }
  
  requestAnimationFrame(animate);
}

function createPulse(container) {
  const pulse = document.createElement('div');
  pulse.style.position = 'absolute';
  pulse.style.width = '0px';
  pulse.style.height = '0px';
  pulse.style.border = '1px solid rgba(0, 217, 255, 0.1)';
  pulse.style.borderRadius = '50%';
  pulse.style.left = Math.random() * 80 + 10 + '%';
  pulse.style.top = Math.random() * 80 + 10 + '%';
  pulse.style.transform = 'translate(-50%, -50%)';
  
  container.appendChild(pulse);
  
  let size = 0;
  const maxSize = Math.random() * 200 + 100;
  const growthSpeed = 2;
  
  function expand() {
    size += growthSpeed;
    pulse.style.width = size + 'px';
    pulse.style.height = size + 'px';
    pulse.style.opacity = 1 - size / maxSize;
    
    if (size < maxSize) {
      requestAnimationFrame(expand);
    } else {
      pulse.remove();
    }
  }
  
  expand();
}