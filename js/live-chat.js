// JAFFSTUDIO - Live Chat Widget

(function() {
  'use strict';

  // Configuration
  const config = {
    agentName: 'JAFFSTUDIO Support',
    agentInitials: 'JS',
    autoReplyDelay: 1500,
    typingDelay: 1000,
    storageKey: 'jaffstudio_chat_history'
  };

  // Predefined responses
  const responses = {
    greeting: [
      "Hello! Welcome to JAFFSTUDIO. How can I help you today?",
      "Hi there! Thanks for reaching out. What can I assist you with?",
      "Welcome! I'm here to help. What would you like to know?"
    ],
    services: "We offer Web Design, Graphic Design, SEO, Branding, and Digital Marketing. Which service are you interested in?",
    pricing: "Our pricing varies based on project requirements. Would you like to schedule a consultation to discuss your specific needs?",
    portfolio: "You can view our portfolio at the Portfolio page. We've worked with clients across various industries. Would you like me to share some specific examples?",
    contact: "You can reach us at info@jaffstudio.com or call us at +1 (555) 123-4567. Would you like to schedule a consultation?",
    hours: "We're available Monday-Friday, 9 AM - 6 PM EST. However, you can send us a message anytime and we'll get back to you within 24 hours!",
    default: "Thank you for your message. A team member will respond shortly. In the meantime, feel free to explore our services or check out our portfolio!",
    thanks: "You're welcome! Is there anything else I can help you with?",
    bye: "Thank you for chatting with us! Have a great day, and feel free to reach out anytime. 👋"
  };

  // Quick reply options
  const quickReplies = [
    "View Services",
    "Get a Quote",
    "See Portfolio",
    "Contact Info"
  ];

  let chatState = {
    isOpen: false,
    messages: [],
    unreadCount: 0
  };

  // Initialize chat
  function init() {
    createChatWidget();
    loadChatHistory();
    attachEventListeners();

    // Show welcome notification after 5 seconds
    setTimeout(showWelcomeNotification, 5000);

    console.log('✅ Live Chat initialized');
  }

  // Create chat widget HTML
  function createChatWidget() {
    const chatHTML = `
      <!-- Live Chat Button -->
      <button class="live-chat-button" id="liveChatButton" aria-label="Open live chat">
        <i class="fas fa-comment-dots"></i>
        <span class="live-chat-badge" id="chatBadge" style="display: none;">0</span>
      </button>

      <!-- Live Chat Window -->
      <div class="live-chat-window" id="liveChatWindow">
        <!-- Chat Header -->
        <div class="live-chat-header">
          <div class="live-chat-header-info">
            <div class="live-chat-avatar">${config.agentInitials}</div>
            <div class="live-chat-header-text">
              <h3>${config.agentName}</h3>
              <div class="live-chat-status">
                <span class="status-dot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <button class="live-chat-close" id="liveChatClose" aria-label="Close chat">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Chat Body -->
        <div class="live-chat-body" id="chatBody">
          <!-- Welcome Message -->
          <div class="chat-welcome">
            <div class="chat-welcome-icon">💬</div>
            <h4>Welcome to JAFFSTUDIO!</h4>
            <p>Hi there! How can we help you today?</p>
          </div>

          <!-- Quick Replies -->
          <div class="quick-replies" id="quickReplies">
            ${quickReplies.map(reply => `
              <button class="quick-reply-btn" data-reply="${reply}">${reply}</button>
            `).join('')}
          </div>

          <!-- Typing Indicator -->
          <div class="typing-indicator" id="typingIndicator">
            <span>Agent is typing</span>
            <div class="typing-dots">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <!-- Chat Footer -->
        <div class="live-chat-footer">
          <div class="live-chat-input-wrapper">
            <textarea
              class="live-chat-input"
              id="chatInput"
              placeholder="Type your message..."
              rows="1"
            ></textarea>
            <button class="live-chat-send" id="chatSend" aria-label="Send message">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  // Attach event listeners
  function attachEventListeners() {
    const chatButton = document.getElementById('liveChatButton');
    const chatClose = document.getElementById('liveChatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', closeChat);
    chatSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    // Quick replies
    quickReplies.forEach(btn => {
      btn.addEventListener('click', function() {
        const reply = this.dataset.reply;
        handleQuickReply(reply);
      });
    });
  }

  // Toggle chat window
  function toggleChat() {
    const chatWindow = document.getElementById('liveChatWindow');
    const chatButton = document.getElementById('liveChatButton');

    chatState.isOpen = !chatState.isOpen;

    if (chatState.isOpen) {
      chatWindow.classList.add('active');
      chatButton.classList.add('active');
      clearUnreadCount();
      focusInput();

      // Send greeting if first time
      if (chatState.messages.length === 0) {
        setTimeout(() => {
          addAgentMessage(getRandomResponse('greeting'));
        }, 500);
      }
    } else {
      chatWindow.classList.remove('active');
      chatButton.classList.remove('active');
    }
  }

  // Close chat
  function closeChat() {
    const chatWindow = document.getElementById('liveChatWindow');
    const chatButton = document.getElementById('liveChatButton');

    chatWindow.classList.remove('active');
    chatButton.classList.remove('active');
    chatState.isOpen = false;
  }

  // Send message
  function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addUserMessage(message);
    input.value = '';
    input.style.height = 'auto';

    // Generate auto-reply
    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        const reply = generateReply(message);
        addAgentMessage(reply);
      }, config.typingDelay);
    }, config.autoReplyDelay);
  }

  // Add user message
  function addUserMessage(text) {
    const message = {
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatState.messages.push(message);
    renderMessage(message);
    saveChatHistory();
    scrollToBottom();
  }

  // Add agent message
  function addAgentMessage(text) {
    const message = {
      type: 'agent',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatState.messages.push(message);
    renderMessage(message);
    saveChatHistory();
    scrollToBottom();

    // Increment unread count if chat is closed
    if (!chatState.isOpen) {
      incrementUnreadCount();
    }
  }

  // Render message
  function renderMessage(message) {
    const chatBody = document.getElementById('chatBody');
    const quickRepliesEl = document.getElementById('quickReplies');

    const messageHTML = `
      <div class="chat-message ${message.type}">
        ${message.type === 'agent' ? `
          <div class="chat-message-avatar">${config.agentInitials}</div>
        ` : ''}
        <div>
          <div class="chat-message-bubble">${escapeHtml(message.text)}</div>
          <div class="chat-timestamp">${message.timestamp}</div>
        </div>
        ${message.type === 'user' ? `
          <div class="chat-message-avatar">You</div>
        ` : ''}
      </div>
    `;

    chatBody.insertBefore(
      createElementFromHTML(messageHTML),
      quickRepliesEl
    );
  }

  // Handle quick reply
  function handleQuickReply(reply) {
    addUserMessage(reply);

    let response;
    switch(reply) {
      case 'View Services':
        response = responses.services;
        break;
      case 'Get a Quote':
        response = responses.pricing;
        break;
      case 'See Portfolio':
        response = responses.portfolio;
        break;
      case 'Contact Info':
        response = responses.contact;
        break;
      default:
        response = responses.default;
    }

    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        addAgentMessage(response);
      }, config.typingDelay);
    }, config.autoReplyDelay);
  }

  // Generate reply based on keywords
  function generateReply(message) {
    const lowerMsg = message.toLowerCase();

    // Check for keywords
    if (lowerMsg.match(/hello|hi|hey|good morning|good afternoon/)) {
      return getRandomResponse('greeting');
    } else if (lowerMsg.match(/service|what do you|offerings/)) {
      return responses.services;
    } else if (lowerMsg.match(/price|cost|pricing|how much|budget/)) {
      return responses.pricing;
    } else if (lowerMsg.match(/portfolio|work|examples|projects/)) {
      return responses.portfolio;
    } else if (lowerMsg.match(/contact|email|phone|reach/)) {
      return responses.contact;
    } else if (lowerMsg.match(/hours|time|available|when/)) {
      return responses.hours;
    } else if (lowerMsg.match(/thank|thanks/)) {
      return responses.thanks;
    } else if (lowerMsg.match(/bye|goodbye|see you/)) {
      return responses.bye;
    } else {
      return responses.default;
    }
  }

  // Get random response from array
  function getRandomResponse(key) {
    const response = responses[key];
    if (Array.isArray(response)) {
      return response[Math.floor(Math.random() * response.length)];
    }
    return response;
  }

  // Show typing indicator
  function showTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.add('active');
    scrollToBottom();
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator.classList.remove('active');
  }

  // Show welcome notification
  function showWelcomeNotification() {
    if (!chatState.isOpen && chatState.messages.length === 0) {
      incrementUnreadCount();
    }
  }

  // Increment unread count
  function incrementUnreadCount() {
    chatState.unreadCount++;
    updateBadge();
  }

  // Clear unread count
  function clearUnreadCount() {
    chatState.unreadCount = 0;
    updateBadge();
  }

  // Update badge
  function updateBadge() {
    const badge = document.getElementById('chatBadge');
    if (chatState.unreadCount > 0) {
      badge.textContent = chatState.unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  // Focus input
  function focusInput() {
    setTimeout(() => {
      document.getElementById('chatInput').focus();
    }, 100);
  }

  // Scroll to bottom
  function scrollToBottom() {
    const chatBody = document.getElementById('chatBody');
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
  }

  // Save chat history
  function saveChatHistory() {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(chatState.messages));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
  }

  // Load chat history
  function loadChatHistory() {
    try {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        chatState.messages = JSON.parse(saved);
        chatState.messages.forEach(msg => renderMessage(msg));
      }
    } catch (e) {
      console.warn('Could not load chat history:', e);
    }
  }

  // Utility: Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Utility: Create element from HTML string
  function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
