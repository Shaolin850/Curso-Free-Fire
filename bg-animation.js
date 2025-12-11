// Animated background effects - Optimized for all devices
document.addEventListener('DOMContentLoaded', function() {
  const animatedBg = document.querySelector('.animated-bg');
  
  if (!animatedBg) return;
  
  // Clear any existing content
  animatedBg.innerHTML = '';
  
  // Detect device type for optimal performance
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  // Adjust particle count based on device performance
  let particleCount = isMobile ? 8 : isTablet ? 15 : 20;
  let pulseFrequency = isMobile ? 5000 : 3000;
  
  // Disable animations if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Create a simple static background
    createStaticBackground(animatedBg);
    return;
  }
  
  // Create floating particles
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      createParticle(animatedBg, isMobile);
    }, i * 200); // Stagger creation for better performance
  }
  
  // Create occasional pulsing circles
  let pulseInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      createPulse(animatedBg, isMobile);
    }
  }, pulseFrequency);
  
  // Optimize performance when tab is not visible
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      clearInterval(pulseInterval);
    } else {
      pulseInterval = setInterval(() => {
        createPulse(animatedBg, isMobile);
      }, pulseFrequency);
    }
  });
  
  // Adjust on resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-adjust particle count if needed
      const newIsMobile = window.innerWidth <= 768;
      const particles = animatedBg.querySelectorAll('.particle');
      
      if (newIsMobile && particles.length > 8) {
        // Remove extra particles on mobile
        for (let i = 8; i < particles.length; i++) {
          if (particles[i]) {
            particles[i].remove();
          }
        }
      }
    }, 250);
  });
});

function createStaticBackground(container) {
  // Simple static gradient background for users who prefer reduced motion
  container.style.background = 
    'radial-gradient(circle at 20% 30%, rgba(0, 217, 255, 0.05) 0%, transparent 40%), ' +
    'radial-gradient(circle at 80% 70%, rgba(0, 136, 255, 0.05) 0%, transparent 40%)';
  container.style.opacity = '0.1';
}

function createParticle(container, isMobile) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Optimize for mobile performance
  const size = isMobile ? 
    Math.random() * 2 + 0.5 : 
    Math.random() * 4 + 1;
  
  const opacity = isMobile ? 
    Math.random() * 0.2 + 0.05 : 
    Math.random() * 0.3 + 0.1;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(0, 217, 255, ${opacity});
    border-radius: 50%;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    pointer-events: none;
    will-change: transform, opacity;
    transform: translateZ(0);
    z-index: 0;
  `;
  
  // Force hardware acceleration for better performance
  particle.style.transform = 'translateZ(0)';
  
  container.appendChild(particle);
  
  // Animate particle with optimized performance
  animateParticle(particle, isMobile);
}

function animateParticle(element, isMobile) {
  const startX = parseFloat(element.style.left);
  const startY = parseFloat(element.style.top);
  
  // Shorter movements on mobile for better performance
  const movementRange = isMobile ? 20 : 40;
  const endX = startX + (Math.random() * movementRange - movementRange/2);
  const endY = startY + (Math.random() * movementRange - movementRange/2);
  
  // Longer duration on desktop, shorter on mobile
  const duration = isMobile ? 
    Math.random() * 8000 + 4000 : 
    Math.random() * 10000 + 5000;
  
  let animationId = null;
  let startTime = null;
  
  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth ease function
    const ease = progress < 0.5 ? 
      2 * progress * progress : 
      -1 + (4 - 2 * progress) * progress;
    
    const currentX = startX + (endX - startX) * ease;
    const currentY = startY + (endY - startY) * ease;
    
    element.style.left = currentX + '%';
    element.style.top = currentY + '%';
    
    // Smooth fade in/out
    if (progress < 0.3) {
      element.style.opacity = (progress / 0.3) * parseFloat(element.style.opacity || 0.5);
    } else if (progress > 0.7) {
      element.style.opacity = ((1 - progress) / 0.3) * parseFloat(element.style.opacity || 0.5);
    }
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Cycle complete, reset and restart
      cancelAnimationFrame(animationId);
      
      // Small delay before restarting
      setTimeout(() => {
        element.style.left = startX + '%';
        element.style.top = startY + '%';
        startTime = null;
        animateParticle(element, isMobile);
      }, 500);
    }
  }
  
  animationId = requestAnimationFrame(animate);
  
  // Clean up animation on element removal
  element.dataset.animationId = animationId;
}

function createPulse(container, isMobile) {
  // Don't create pulses on low-end devices
  if (isMobile && Math.random() > 0.3) return;
  
  const pulse = document.createElement('div');
  pulse.className = 'pulse-effect';
  
  // Smaller pulses on mobile
  const maxSize = isMobile ? 
    Math.random() * 100 + 50 : 
    Math.random() * 200 + 100;
  
  pulse.style.cssText = `
    position: absolute;
    width: 0px;
    height: 0px;
    border: 1px solid rgba(0, 217, 255, 0.08);
    border-radius: 50%;
    left: ${Math.random() * 80 + 10}%;
    top: ${Math.random() * 80 + 10}%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    will-change: width, height, opacity;
    z-index: 0;
  `;
  
  container.appendChild(pulse);
  
  let size = 0;
  const growthSpeed = isMobile ? 1.5 : 2;
  let animationId = null;
  
  function expand() {
    size += growthSpeed;
    pulse.style.width = size + 'px';
    pulse.style.height = size + 'px';
    
    // Calculate opacity - start at 1, fade to 0
    const opacity = Math.max(0, 1 - (size / maxSize));
    pulse.style.opacity = opacity * 0.1;
    pulse.style.borderWidth = Math.max(0.5, 2 - (size / maxSize) * 1.5) + 'px';
    
    if (size < maxSize) {
      animationId = requestAnimationFrame(expand);
    } else {
      cancelAnimationFrame(animationId);
      // Remove element after animation completes
      setTimeout(() => {
        if (pulse.parentNode === container) {
          pulse.remove();
        }
      }, 100);
    }
  }
  
  animationId = requestAnimationFrame(expand);
  
  // Clean up animation on element removal
  pulse.dataset.animationId = animationId;
}

// Performance optimization: throttle animations when not in view
let throttleAnimations = false;

function checkViewport() {
  const rect = document.querySelector('.animated-bg')?.getBoundingClientRect();
  if (!rect) return;
  
  const isInViewport = (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
  
  throttleAnimations = !isInViewport;
}

// Check viewport on scroll and resize
window.addEventListener('scroll', checkViewport);
window.addEventListener('resize', checkViewport);

// Initialize viewport check
setTimeout(checkViewport, 1000);

// Clean up function for page navigation (if using SPA)
window.cleanupBackgroundAnimations = function() {
  const animatedBg = document.querySelector('.animated-bg');
  if (animatedBg) {
    // Stop all animations
    const particles = animatedBg.querySelectorAll('.particle, .pulse-effect');
    particles.forEach(particle => {
      const animationId = particle.dataset.animationId;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      particle.remove();
    });
    
    // Clear intervals
    if (window.pulseInterval) {
      clearInterval(window.pulseInterval);
    }
  }
};

// Handle page visibility for performance
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pause animations when tab is not visible
    const animatedBg = document.querySelector('.animated-bg');
    if (animatedBg) {
      const particles = animatedBg.querySelectorAll('.particle, .pulse-effect');
      particles.forEach(particle => {
        particle.style.animationPlayState = 'paused';
      });
    }
  } else {
    // Resume animations when tab becomes visible
    const animatedBg = document.querySelector('.animated-bg');
    if (animatedBg) {
      const particles = animatedBg.querySelectorAll('.particle, .pulse-effect');
      particles.forEach(particle => {
        particle.style.animationPlayState = 'running';
      });
    }
  }
});

// Memory management: cleanup old particles
setInterval(() => {
  const animatedBg = document.querySelector('.animated-bg');
  if (!animatedBg) return;
  
  const pulses = animatedBg.querySelectorAll('.pulse-effect');
  // Remove pulses that are too transparent (finished animation but not removed)
  pulses.forEach(pulse => {
    if (parseFloat(pulse.style.opacity || 0) < 0.01) {
      pulse.remove();
    }
  });
  
  // Limit total particles
  const particles = animatedBg.querySelectorAll('.particle');
  const maxParticles = 30;
  
  if (particles.length > maxParticles) {
    for (let i = maxParticles; i < particles.length; i++) {
      particles[i].remove();
    }
  }
}, 10000); // Clean up every 10 seconds

// Add CSS for performance optimization
const style = document.createElement('style');
style.textContent = `
  .particle, .pulse-effect {
    backface-visibility: hidden;
    perspective: 1000px;
    transform: translateZ(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .particle, .pulse-effect {
      display: none !important;
    }
  }
`;
document.head.appendChild(style);
