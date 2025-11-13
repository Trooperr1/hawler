// JAFFSTUDIO - Main JavaScript

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initLoader();
  initNavigation();
  initScrollEffects();
  initAnimations();
  initCarousels();
  initAccordions();
  initForms();
  initModals();
  initFilters();
  initCounters();
  initBeforeAfter();
  initVideoPlayers();
  initCookieConsent();
  initWhatsApp();
  initBackToTop();
  initTooltips();
  initExitIntent();
});

// ============================================
// LOADING SCREEN
// ============================================

function initLoader() {
  const loader = document.querySelector('.loader-wrapper');

  window.addEventListener('load', function() {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    }, 1000);
  });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // Sticky navigation on scroll
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Add scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
  }

  // Mobile dropdown toggle
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (dropdown && window.innerWidth <= 968) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        item.classList.toggle('active');
      });
    }
  });

  // Close mobile menu on link click
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 968 && !this.parentElement.querySelector('.dropdown-menu')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initScrollEffects() {
  // Scroll progress bar
  const scrollProgress = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', function() {
    if (scrollProgress) {
      const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      scrollProgress.style.width = scrolled + '%';
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Parallax effect
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', function() {
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(window.pageYOffset * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ============================================
// ANIMATIONS
// ============================================

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation
        if (entry.target.classList.contains('stat-number')) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe fade-in elements
  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // Observe stat numbers
  document.querySelectorAll('.stat-number').forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// CAROUSELS
// ============================================

function initCarousels() {
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const autoPlay = carousel.dataset.autoplay !== 'false';
    const interval = parseInt(carousel.dataset.interval) || 5000;
    let autoPlayTimer;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      if (index >= totalSlides) currentIndex = 0;
      else if (index < 0) currentIndex = totalSlides - 1;
      else currentIndex = index;

      if (container) {
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      slides[currentIndex].classList.add('active');
      if (indicators[currentIndex]) {
        indicators[currentIndex].classList.add('active');
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto play
    if (autoPlay && totalSlides > 1) {
      autoPlayTimer = setInterval(nextSlide, interval);

      carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      carousel.addEventListener('mouseleave', () => {
        autoPlayTimer = setInterval(nextSlide, interval);
      });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextSlide();
      if (touchEndX > touchStartX + 50) prevSlide();
    }

    // Initialize
    showSlide(0);
  });
}

// ============================================
// ACCORDIONS
// ============================================

function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');

      // Close all accordions in the same group
      const accordion = item.closest('.accordion');
      accordion.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      // Toggle current accordion
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ============================================
// FORMS
// ============================================

function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('[required]');

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate each input
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');

        if (!validateInput(input)) {
          isValid = false;
          formGroup.classList.add('error');
        }
      });

      if (isValid) {
        // Show success message
        showToast('Form submitted successfully!', 'success');

        // Reset form
        setTimeout(() => {
          form.reset();
        }, 1000);
      } else {
        showToast('Please fill in all required fields correctly.', 'error');
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        if (this.hasAttribute('required')) {
          if (validateInput(this)) {
            formGroup.classList.remove('error');
          } else {
            formGroup.classList.add('error');
          }
        }
      });
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;

  if (value === '') return false;

  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  if (type === 'tel') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value);
  }

  if (input.hasAttribute('minlength')) {
    return value.length >= parseInt(input.getAttribute('minlength'));
  }

  return true;
}

// ============================================
// MODALS & LIGHTBOX
// ============================================

function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.modal;
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Image lightbox
  const lightboxImages = document.querySelectorAll('[data-lightbox]');
  lightboxImages.forEach(img => {
    img.addEventListener('click', function() {
      openLightbox(this.src);
    });
  });
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function openLightbox(imageSrc) {
  const lightbox = document.createElement('div');
  lightbox.className = 'modal active';
  lightbox.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img src="${imageSrc}" alt="Lightbox Image">
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  const closeBtn = lightbox.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    lightbox.remove();
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.remove();
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================
// FILTERS
// ============================================

function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      filterItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ============================================
// COUNTERS
// ============================================

function initCounters() {
  // Counter animation is triggered by IntersectionObserver in initAnimations()
}

function animateCounter(element) {
  if (element.dataset.animated) return;

  const target = parseInt(element.dataset.count || element.textContent);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);

  element.dataset.animated = 'true';
}

// ============================================
// BEFORE/AFTER SLIDER
// ============================================

function initBeforeAfter() {
  const beforeAfterContainers = document.querySelectorAll('.before-after');

  beforeAfterContainers.forEach(container => {
    const slider = container.querySelector('.before-after-slider');
    const afterImage = container.querySelector('.after-image');

    if (!slider || !afterImage) return;

    let isDragging = false;

    slider.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e);
    });

    container.addEventListener('click', updateSlider);

    // Touch support
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('touchend', () => isDragging = false);

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0]);
    });

    function updateSlider(e) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      slider.style.left = clampedPercentage + '%';
      afterImage.style.clipPath = `inset(0 ${100 - clampedPercentage}% 0 0)`;
    }
  });
}

// ============================================
// VIDEO PLAYERS
// ============================================

function initVideoPlayers() {
  const videoContainers = document.querySelectorAll('.video-container');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const playBtn = container.querySelector('.video-play-btn');

    if (!video || !playBtn) return;

    playBtn.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        container.classList.add('playing');
      } else {
        video.pause();
        container.classList.remove('playing');
      }
    });

    video.addEventListener('click', function() {
      if (!video.paused) {
        video.pause();
        container.classList.remove('playing');
      }
    });

    video.addEventListener('ended', function() {
      container.classList.remove('playing');
    });
  });
}

// ============================================
// COOKIE CONSENT
// ============================================

function initCookieConsent() {
  const cookieConsent = document.querySelector('.cookie-consent');

  if (!cookieConsent) return;

  // Check if user has already accepted
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieConsent.classList.add('visible');
    }, 2000);
  }

  const acceptBtn = cookieConsent.querySelector('.cookie-accept');
  const declineBtn = cookieConsent.querySelector('.cookie-decline');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'declined');
      cookieConsent.classList.remove('visible');
    });
  }
}

// ============================================
// WHATSAPP BUTTON
// ============================================

function initWhatsApp() {
  const whatsappBtn = document.querySelector('.whatsapp-float');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const phone = this.dataset.phone || '';
      const message = this.dataset.message || 'Hello!';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }
}

// ============================================
// BACK TO TOP
// ============================================

function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');

  if (!backToTop) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => toast.remove());

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// ============================================
// EXIT INTENT POPUP
// ============================================

function initExitIntent() {
  const exitPopup = document.querySelector('[data-exit-intent]');

  if (!exitPopup) return;

  let hasShown = sessionStorage.getItem('exitIntentShown');

  if (!hasShown) {
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY < 0) {
        exitPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    });
  }
}

// ============================================
// TOOLTIPS
// ============================================

function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltipText = this.dataset.tooltip;
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.cssText = `
        position: absolute;
        background: #000;
        color: #fff;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        border-radius: 4px;
        z-index: 10000;
        pointer-events: none;
      `;

      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
      tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';

      this.dataset.tooltipElement = 'active';

      this.addEventListener('mouseleave', function remove() {
        tooltip.remove();
        this.removeEventListener('mouseleave', remove);
      });
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
