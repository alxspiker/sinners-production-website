// JavaScript for KRONOS Website

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const header = document.querySelector('.sticky-header');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('nav ul');
  const trackItems = document.querySelectorAll('.track-item');
  const musicPlayerModal = document.getElementById('musicPlayerModal');
  const closeModal = document.querySelector('.close-modal');
  const playPauseBtn = document.querySelector('.play-pause');
  
  // Sticky Header
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(0, 0, 0, 0.9)';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(0, 0, 0, 0.7)';
      header.style.boxShadow = 'none';
    }
  });
  
  // Mobile Menu Toggle
  hamburgerMenu.addEventListener('click', function() {
    nav.classList.toggle('show');
    hamburgerMenu.classList.toggle('active');
    
    // Transform hamburger to X
    const bars = hamburgerMenu.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.toggle('animate'));
  });
  
  // Add CSS for mobile menu and animation
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav ul.show {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 80px;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 20px 0;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        animation: slideDown 0.3s ease forwards;
      }
      
      nav ul.show li {
        margin: 15px 0;
        text-align: center;
      }
      
      .hamburger-menu.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }
      
      .hamburger-menu.active .bar:nth-child(2) {
        opacity: 0;
      }
      
      .hamburger-menu.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  `;
  document.head.appendChild(style);
  
  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        hamburgerMenu.classList.remove('active');
        const bars = hamburgerMenu.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('animate'));
      }
      
      // Scroll to target
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Track Item Click (Music Player)
  trackItems.forEach(item => {
    item.addEventListener('click', function() {
      const trackTitle = this.querySelector('.track-info h4').textContent;
      const trackArtist = 'KRONOS';
      const trackDuration = this.querySelector('.track-time').textContent;
      
      // Update music player
      document.querySelector('.track-title').textContent = trackTitle;
      document.querySelector('.track-artist').textContent = trackArtist;
      document.querySelector('.duration').textContent = trackDuration;
      
      // Show music player modal
      musicPlayerModal.classList.add('show');
    });
  });
  
  // Close Modal
  closeModal.addEventListener('click', function() {
    musicPlayerModal.classList.remove('show');
  });
  
  // Play/Pause Toggle
  playPauseBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('fa-play')) {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
    }
  });
  
  // Form Submissions
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animation for submit
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#2ecc71';
        
        // Reset form
        setTimeout(() => {
          this.reset();
          submitBtn.textContent = 'Send Message';
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
  
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animation for submit
      const submitBtn = this.querySelector('button[type="submit"]');
      const input = this.querySelector('input');
      submitBtn.textContent = 'Subscribing...';
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.style.backgroundColor = '#2ecc71';
        
        // Reset form
        setTimeout(() => {
          this.reset();
          submitBtn.textContent = 'Subscribe';
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
  
  // Reveal animations on scroll
  function reveal() {
    const reveals = document.querySelectorAll('.section-title, .track-item, .show-item, .info-item');
    
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  }
  
  window.addEventListener('scroll', reveal);
  
  // Add CSS for reveal animations
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .section-title, .track-item, .show-item, .info-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-title.active, .track-item.active, .show-item.active, .info-item.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .track-item:nth-child(1) { transition-delay: 0.1s; }
    .track-item:nth-child(2) { transition-delay: 0.2s; }
    .track-item:nth-child(3) { transition-delay: 0.3s; }
    .track-item:nth-child(4) { transition-delay: 0.4s; }
    
    .show-item:nth-child(1) { transition-delay: 0.1s; }
    .show-item:nth-child(2) { transition-delay: 0.2s; }
    .show-item:nth-child(3) { transition-delay: 0.3s; }
    .show-item:nth-child(4) { transition-delay: 0.4s; }
    
    .info-item:nth-child(1) { transition-delay: 0.1s; }
    .info-item:nth-child(2) { transition-delay: 0.2s; }
    .info-item:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(revealStyle);
  
  // Run reveal on load
  reveal();
});