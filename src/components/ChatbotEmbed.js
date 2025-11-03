/**
 * Chatbot Embed Script
 * Drop this into any website - auto-initializes and adapts to page colors
 * 
 * Usage:
 * <script src="https://your-cdn.com/chatbot.js"></script>
 * <script>
 *   window.VictoryRushChatbot.init({
 *     tenantId: 'tenant-123',
 *     businessName: 'ABC Pest Control',
 *     businessPhone: '(555) 123-4567',
 *     industry: 'pest control',
 *     apiUrl: 'https://api.yourdomain.com'
 *   });
 * </script>
 */

(function() {
  'use strict';

  // Configuration with defaults
  const defaultConfig = {
    tenantId: '',
    businessName: 'Your Business',
    businessPhone: '(555) 123-4567',
    industry: 'services',
    apiUrl: 'https://api.yourdomain.com',
    position: 'bottom-right', // bottom-right, bottom-left
    primaryColor: null, // auto-detect if null
    zIndex: 9999
  };

  let config = { ...defaultConfig };
  let widgetInitialized = false;

  // Auto-detect colors from page
  function detectPageColors() {
    const style = getComputedStyle(document.body);
    const primary = style.getPropertyValue('--primary-color') || 
                   style.getPropertyValue('--brand-color') ||
                   window.getComputedStyle(document.querySelector('a, button'))?.color ||
                   '#3B82F6';
    
    return {
      primary: primary || '#3B82F6',
      text: style.color || '#1F2937',
      bg: style.backgroundColor || '#FFFFFF',
      border: style.borderColor || '#E5E7EB'
    };
  }

  // Create and inject chatbot widget
  function createChatbotWidget() {
    if (widgetInitialized) return;

    const container = document.createElement('div');
    container.id = 'victory-rush-chatbot';
    container.setAttribute('data-tenant', config.tenantId);
    document.body.appendChild(container);

    // This would load the React component via a bundled script
    // For now, we'll use a vanilla JS implementation for maximum compatibility
    initializeVanillaChatbot(container);
    widgetInitialized = true;
  }

  // Vanilla JS implementation (no React dependency for embed)
  function initializeVanillaChatbot(container) {
    const colors = config.primaryColor ? 
      { primary: config.primaryColor } : 
      detectPageColors();

    // Load the chatbot widget component
    // In production, this would be a bundled React component
    // For now, we provide the React component separately and use ReactDOM.render here
    console.log('Chatbot initialized for', config.businessName);
  }

  // Public API
  window.VictoryRushChatbot = {
    init: function(userConfig) {
      config = { ...defaultConfig, ...userConfig };
      
      if (!config.tenantId) {
        console.error('VictoryRush Chatbot: tenantId is required');
        return;
      }

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatbotWidget);
      } else {
        createChatbotWidget();
      }
    },

    open: function() {
      const widget = document.getElementById('victory-rush-chatbot');
      if (widget) {
        widget.dispatchEvent(new CustomEvent('open-chat'));
      }
    },

    close: function() {
      const widget = document.getElementById('victory-rush-chatbot');
      if (widget) {
        widget.dispatchEvent(new CustomEvent('close-chat'));
      }
    },

    destroy: function() {
      const widget = document.getElementById('victory-rush-chatbot');
      if (widget) {
        widget.remove();
        widgetInitialized = false;
      }
    }
  };

  // Auto-init if config is already on window
  if (window.VictoryRushChatbotConfig) {
    window.VictoryRushChatbot.init(window.VictoryRushChatbotConfig);
  }

})();


