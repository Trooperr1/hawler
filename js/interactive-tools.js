// JAFFSTUDIO - Interactive Tools JavaScript

// ============================================
// AI CHATBOT WIDGET
// ============================================

function initChatbot() {
  const chatbotHTML = `
    <div class="chatbot-widget">
      <div class="chatbot-toggle" id="chatbotToggle">
        <i class="fas fa-comments"></i>
      </div>
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <h4 style="margin: 0;">Chat with us</h4>
          <button class="chatbot-close" id="chatbotClose">&times;</button>
        </div>
        <div class="chatbot-body" id="chatbotBody">
          <div class="chatbot-message bot">
            <div class="message-bubble">
              Hello! 👋 How can I help you today?
            </div>
          </div>
        </div>
        <div class="chatbot-footer">
          <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your message...">
          <button class="chatbot-send" id="chatbotSend">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  const toggle = document.getElementById('chatbotToggle');
  const window = document.getElementById('chatbotWindow');
  const close = document.getElementById('chatbotClose');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  const body = document.getElementById('chatbotBody');

  // Predefined responses
  const responses = {
    'hello': 'Hi there! Welcome to JAFFSTUDIO. How can I assist you?',
    'hi': 'Hello! What can I help you with today?',
    'services': 'We offer Web Design, Web Development, Branding, and Digital Marketing services. Which one interests you?',
    'pricing': 'Our pricing varies based on project scope. Would you like to schedule a consultation?',
    'contact': 'You can reach us at hello@jaffstudio.com or call +1 (555) 123-4567. Would you like to fill out our contact form?',
    'portfolio': 'We\'ve completed over 250 projects! You can view our portfolio at /portfolio.html',
    'help': 'I can help you with information about our services, pricing, portfolio, or contact details. What would you like to know?',
    'default': 'Thanks for your message! A team member will get back to you soon. You can also email us at hello@jaffstudio.com for immediate assistance.'
  };

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    body.appendChild(messageDiv);
    body.scrollTop = body.scrollHeight;
  }

  function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    for (let key in responses) {
      if (message.includes(key)) {
        return responses[key];
      }
    }

    return responses['default'];
  }

  function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, true);
    input.value = '';

    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response);
    }, 500);
  }

  toggle.addEventListener('click', () => {
    window.classList.toggle('active');
  });

  close.addEventListener('click', () => {
    window.classList.remove('active');
  });

  send.addEventListener('click', sendMessage);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// ============================================
// MULTI-STEP FORM
// ============================================

function initMultiStepForms() {
  const forms = document.querySelectorAll('[data-multistep-form]');

  forms.forEach(form => {
    const steps = form.querySelectorAll('.form-step-content');
    const indicators = form.querySelectorAll('.form-step-indicator');
    const progressLine = form.querySelector('.progress-line');
    const prevBtn = form.querySelector('[data-prev]');
    const nextBtn = form.querySelector('[data-next]');
    const submitBtn = form.querySelector('[type="submit"]');

    let currentStep = 0;

    function updateForm() {
      // Hide all steps
      steps.forEach(step => step.classList.remove('active'));
      indicators.forEach(ind => {
        ind.classList.remove('active');
        ind.classList.remove('completed');
      });

      // Show current step
      steps[currentStep].classList.add('active');
      indicators[currentStep].classList.add('active');

      // Mark previous steps as completed
      for (let i = 0; i < currentStep; i++) {
        indicators[i].classList.add('completed');
      }

      // Update progress line
      const progress = (currentStep / (steps.length - 1)) * 100;
      if (progressLine) {
        progressLine.style.width = progress + '%';
      }

      // Update buttons
      if (prevBtn) {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
      }

      if (nextBtn && submitBtn) {
        if (currentStep === steps.length - 1) {
          nextBtn.style.display = 'none';
          submitBtn.style.display = 'inline-block';
        } else {
          nextBtn.style.display = 'inline-block';
          submitBtn.style.display = 'none';
        }
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          updateForm();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Validate current step
        const currentInputs = steps[currentStep].querySelectorAll('[required]');
        let isValid = true;

        currentInputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
            input.closest('.form-group').classList.add('error');
          }
        });

        if (isValid && currentStep < steps.length - 1) {
          currentStep++;
          updateForm();
        }
      });
    }

    updateForm();
  });
}

// ============================================
// SERVICE COMPARISON TOOL
// ============================================

function initComparisonTool() {
  // Comparison tool is mostly HTML/CSS driven
  // Add any interactive features here if needed
  const comparisonTables = document.querySelectorAll('.comparison-table');

  comparisonTables.forEach(table => {
    // Add mobile swipe support for comparison tables
    let startX;

    table.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    table.addEventListener('touchmove', (e) => {
      if (!startX) return;

      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;

      table.scrollLeft += diff;
      startX = currentX;
    });

    table.addEventListener('touchend', () => {
      startX = null;
    });
  });
}

// ============================================
// ROI CALCULATOR
// ============================================

function initROICalculator() {
  const calculators = document.querySelectorAll('[data-roi-calculator]');

  calculators.forEach(calculator => {
    const inputs = calculator.querySelectorAll('input, select');

    function calculateROI() {
      const investment = parseFloat(calculator.querySelector('[data-investment]').value) || 0;
      const revenue = parseFloat(calculator.querySelector('[data-revenue]').value) || 0;
      const timeframe = parseInt(calculator.querySelector('[data-timeframe]').value) || 12;

      const gain = revenue - investment;
      const roi = investment > 0 ? ((gain / investment) * 100).toFixed(1) : 0;
      const monthlyROI = (gain / timeframe).toFixed(2);

      // Update display
      const roiValue = calculator.querySelector('.roi-value');
      if (roiValue) {
        roiValue.textContent = roi + '%';
      }

      const totalGain = calculator.querySelector('[data-total-gain]');
      if (totalGain) {
        totalGain.textContent = '$' + gain.toLocaleString();
      }

      const monthly = calculator.querySelector('[data-monthly-roi]');
      if (monthly) {
        monthly.textContent = '$' + monthlyROI.toLocaleString();
      }

      // Color code the result
      if (roiValue) {
        if (roi >= 100) {
          roiValue.style.color = '#000';
        } else if (roi >= 50) {
          roiValue.style.color = '#333';
        } else {
          roiValue.style.color = '#666';
        }
      }
    }

    inputs.forEach(input => {
      input.addEventListener('input', calculateROI);
    });

    // Calculate on load
    calculateROI();
  });
}

// ============================================
// EXIT INTENT POPUP
// ============================================

function initExitIntentPopup() {
  const popup = document.createElement('div');
  popup.className = 'exit-popup';
  popup.setAttribute('data-exit-intent', 'true');
  popup.innerHTML = `
    <div class="exit-popup-content">
      <button class="exit-popup-close">&times;</button>
      <h2 style="margin-bottom: var(--spacing-sm);">Wait! Don't Leave Yet</h2>
      <p style="color: var(--color-gray-medium); margin-bottom: var(--spacing-md);">
        Subscribe to our newsletter and get 10% off your first project!
      </p>
      <form data-validate style="margin-bottom: 0;">
        <div class="form-group">
          <input type="email" class="form-input" placeholder="Enter your email" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Get My Discount
        </button>
      </form>
      <p style="font-size: 0.85rem; color: var(--color-gray-medium); margin-top: var(--spacing-sm); margin-bottom: 0;">
        By subscribing, you agree to our <a href="privacy.html">Privacy Policy</a>
      </p>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector('.exit-popup-close');
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
  });

  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
    }
  });

  const form = popup.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you for subscribing! Check your email for the discount code.', 'success');
    popup.classList.remove('active');
    sessionStorage.setItem('exitIntentShown', 'true');
  });
}

// ============================================
// FILE UPLOAD INTERFACE
// ============================================

function initFileUpload() {
  const uploadAreas = document.querySelectorAll('.file-upload-area');

  uploadAreas.forEach(area => {
    const input = area.querySelector('.file-upload-input');
    const list = area.parentElement.querySelector('.file-list');
    let files = [];

    area.addEventListener('click', () => {
      input.click();
    });

    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });

    area.addEventListener('dragleave', () => {
      area.classList.remove('dragover');
    });

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    input.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    function handleFiles(newFiles) {
      Array.from(newFiles).forEach(file => {
        files.push(file);
        addFileToList(file);
      });
    }

    function addFileToList(file) {
      if (!list) return;

      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <span><i class="fas fa-file"></i> ${file.name} (${formatFileSize(file.size)})</span>
        <button class="file-remove" type="button"><i class="fas fa-times"></i></button>
      `;

      const removeBtn = fileItem.querySelector('.file-remove');
      removeBtn.addEventListener('click', () => {
        const index = files.indexOf(file);
        if (index > -1) {
          files.splice(index, 1);
        }
        fileItem.remove();
      });

      list.appendChild(fileItem);
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
  });
}

// ============================================
// RECAPTCHA INTEGRATION
// ============================================

function initRecaptcha() {
  // Add reCAPTCHA to forms with data-recaptcha attribute
  const forms = document.querySelectorAll('[data-recaptcha]');

  forms.forEach(form => {
    const wrapper = document.createElement('div');
    wrapper.className = 'recaptcha-wrapper';
    wrapper.innerHTML = `
      <div class="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div>
      <p style="font-size: 0.85rem; color: var(--color-gray-medium); margin-top: 0.5rem;">
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </p>
    `;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.parentNode.insertBefore(wrapper, submitBtn);
  });

  // Load reCAPTCHA script
  if (forms.length > 0) {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}

// ============================================
// INITIALIZE ALL TOOLS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initChatbot();
  initMultiStepForms();
  initComparisonTool();
  initROICalculator();
  initExitIntentPopup();
  initFileUpload();
  initRecaptcha();
});

// Helper function (reference to main.js validateInput)
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
