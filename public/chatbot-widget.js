/**
 * Victory Rush Chatbot Widget
 * A standalone chatbot widget that integrates with any website
 * Connects to Strapi backend for lead capture
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiEndpoint: 'http://localhost:1337/api/chatbot/leads',
    primaryColor: '#2289e1', // Blue - matches template theme
    secondaryColor: '#1a6fbd',
    position: 'bottom-right', // bottom-right, bottom-left
    greeting: "Hi! 👋 Need help with pest control?",
    companyName: "Bob's Pest Control"
  };

  // Chatbot state
  let isOpen = false;
  let conversationStep = 0;
  let leadData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    referralSource: 'website'
  };

  // Conversation flow
  const conversationFlow = [
    {
      question: "What's your first name?",
      field: 'firstName',
      type: 'text',
      placeholder: 'John',
      validation: (val) => val.length > 0
    },
    {
      question: "And your last name?",
      field: 'lastName',
      type: 'text',
      placeholder: 'Doe',
      validation: (val) => val.length > 0
    },
    {
      question: "Great! What's the best email to reach you?",
      field: 'email',
      type: 'email',
      placeholder: 'john@example.com',
      validation: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    },
    {
      question: "And your phone number?",
      field: 'phone',
      type: 'tel',
      placeholder: '(555) 123-4567',
      validation: (val) => val.length >= 10
    },
    {
      question: "Finally, how can we help you today?",
      field: 'message',
      type: 'textarea',
      placeholder: 'Tell us about your pest control needs...',
      validation: (val) => val.length > 0
    }
  ];

  // CSS Styles
  const styles = `
    #vr-chatbot-container * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    #vr-chatbot-button {
      position: fixed;
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      transition: all 0.3s ease;
      animation: vr-pulse 2s infinite;
    }

    #vr-chatbot-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }

    #vr-chatbot-button svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    @keyframes vr-pulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }
      50% {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4), 0 0 0 8px rgba(16, 185, 129, 0.1);
      }
    }

    #vr-chatbot-widget {
      position: fixed;
      ${CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      bottom: 90px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: vr-slideIn 0.3s ease;
    }

    #vr-chatbot-widget.vr-open {
      display: flex;
    }

    @keyframes vr-slideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    #vr-chatbot-header {
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #vr-chatbot-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    #vr-chatbot-header p {
      margin: 4px 0 0 0;
      font-size: 13px;
      opacity: 0.9;
    }

    #vr-chatbot-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    #vr-chatbot-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    #vr-chatbot-close svg {
      width: 20px;
      height: 20px;
      color: white;
    }

    #vr-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f9fafb;
    }

    .vr-message {
      margin-bottom: 16px;
      animation: vr-messageIn 0.3s ease;
    }

    @keyframes vr-messageIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .vr-message-bot {
      display: flex;
      gap: 8px;
    }

    .vr-message-bot .vr-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .vr-message-bot .vr-bubble {
      background: white;
      padding: 12px 16px;
      border-radius: 12px;
      border-top-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      max-width: 80%;
    }

    .vr-message-user {
      display: flex;
      justify-content: flex-end;
    }

    .vr-message-user .vr-bubble {
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 12px;
      border-top-right-radius: 4px;
      max-width: 80%;
    }

    #vr-chatbot-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    #vr-chatbot-input-area input,
    #vr-chatbot-input-area textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 8px;
      transition: border-color 0.2s;
    }

    #vr-chatbot-input-area input:focus,
    #vr-chatbot-input-area textarea:focus {
      outline: none;
      border-color: ${CONFIG.primaryColor};
    }

    #vr-chatbot-input-area textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    #vr-chatbot-input-area button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    #vr-chatbot-input-area button:hover {
      opacity: 0.9;
    }

    #vr-chatbot-input-area button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .vr-success-message {
      text-align: center;
      padding: 40px 20px;
    }

    .vr-success-message svg {
      width: 64px;
      height: 64px;
      color: ${CONFIG.primaryColor};
      margin-bottom: 16px;
    }

    .vr-success-message h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }

    .vr-success-message p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      #vr-chatbot-widget {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
      }
    }
  `;

  // Initialize the chatbot
  function init() {
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create chatbot button
    const button = document.createElement('button');
    button.id = 'vr-chatbot-button';
    button.innerHTML = `
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    `;
    button.onclick = toggleChatbot;

    // Create chatbot widget
    const widget = document.createElement('div');
    widget.id = 'vr-chatbot-widget';
    widget.innerHTML = `
      <div id="vr-chatbot-header">
        <div>
          <h3>${CONFIG.companyName}</h3>
          <p>We typically reply instantly</p>
        </div>
        <button id="vr-chatbot-close">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="vr-chatbot-messages"></div>
      <div id="vr-chatbot-input-area"></div>
    `;

    // Add to page
    document.body.appendChild(button);
    document.body.appendChild(widget);

    // Setup event listeners
    document.getElementById('vr-chatbot-close').onclick = toggleChatbot;

    // Show greeting when opened for first time
    setTimeout(() => {
      if (!isOpen) {
        showGreeting();
      }
    }, 2000);
  }

  function toggleChatbot() {
    isOpen = !isOpen;
    const widget = document.getElementById('vr-chatbot-widget');

    if (isOpen) {
      widget.classList.add('vr-open');
      if (conversationStep === 0) {
        startConversation();
      }
    } else {
      widget.classList.remove('vr-open');
    }
  }

  function showGreeting() {
    // Show a small greeting bubble near the button
    const greeting = document.createElement('div');
    greeting.style.cssText = `
      position: fixed;
      ${CONFIG.position.includes('right') ? 'right: 90px;' : 'left: 90px;'}
      bottom: 30px;
      background: white;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 250px;
      z-index: 9997;
      animation: vr-slideIn 0.3s ease;
    `;
    greeting.textContent = CONFIG.greeting;
    document.body.appendChild(greeting);

    // Remove after 5 seconds
    setTimeout(() => {
      greeting.style.animation = 'vr-slideIn 0.3s ease reverse';
      setTimeout(() => greeting.remove(), 300);
    }, 5000);
  }

  function startConversation() {
    addBotMessage("Hi there! 👋 I'm here to help you with your pest control needs. Let me get some information so we can assist you better.");
    setTimeout(() => {
      showNextQuestion();
    }, 1000);
  }

  function addBotMessage(message) {
    const messagesDiv = document.getElementById('vr-chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'vr-message vr-message-bot';
    messageDiv.innerHTML = `
      <div class="vr-avatar">🐛</div>
      <div class="vr-bubble">${message}</div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function addUserMessage(message) {
    const messagesDiv = document.getElementById('vr-chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'vr-message vr-message-user';
    messageDiv.innerHTML = `
      <div class="vr-bubble">${message}</div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showNextQuestion() {
    if (conversationStep >= conversationFlow.length) {
      submitLead();
      return;
    }

    const step = conversationFlow[conversationStep];
    addBotMessage(step.question);

    const inputArea = document.getElementById('vr-chatbot-input-area');
    const inputType = step.type === 'textarea' ? 'textarea' : 'input';

    inputArea.innerHTML = `
      <${inputType}
        id="vr-input"
        type="${step.type}"
        placeholder="${step.placeholder}"
        ${step.type === 'textarea' ? '' : ''}
      ></${inputType}>
      <button id="vr-submit">Send</button>
    `;

    const input = document.getElementById('vr-input');
    const submitBtn = document.getElementById('vr-submit');

    input.focus();
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && step.type !== 'textarea') {
        e.preventDefault();
        handleSubmit();
      }
    });

    submitBtn.onclick = handleSubmit;

    function handleSubmit() {
      const value = input.value.trim();

      if (!step.validation(value)) {
        input.style.borderColor = '#ef4444';
        return;
      }

      leadData[step.field] = value;
      addUserMessage(value);
      conversationStep++;

      setTimeout(() => {
        showNextQuestion();
      }, 500);
    }
  }

  async function submitLead() {
    const inputArea = document.getElementById('vr-chatbot-input-area');
    inputArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;">Sending...</div>';

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      });

      if (response.ok) {
        showSuccessMessage();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      addBotMessage("Oops! Something went wrong. Please try again or call us directly at (555) 123-4567.");
      inputArea.innerHTML = '<button id="vr-retry" style="width: 100%; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Try Again</button>';
      document.getElementById('vr-retry').onclick = () => {
        conversationStep--;
        showNextQuestion();
      };
    }
  }

  function showSuccessMessage() {
    const messagesDiv = document.getElementById('vr-chatbot-messages');
    messagesDiv.innerHTML = `
      <div class="vr-success-message">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>Thank you, ${leadData.firstName}!</h3>
        <p>We've received your message and will get back to you shortly.</p>
      </div>
    `;

    const inputArea = document.getElementById('vr-chatbot-input-area');
    inputArea.innerHTML = '<button onclick="location.reload()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, ' + CONFIG.primaryColor + ' 0%, ' + CONFIG.secondaryColor + ' 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Start New Conversation</button>';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose configuration function
  window.VRChatbot = {
    config: function(options) {
      Object.assign(CONFIG, options);
    }
  };

})();
