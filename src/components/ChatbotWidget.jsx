import { useState, useEffect, useRef } from 'react';

/**
 * Premium AI Chatbot Widget
 * Embeds on any website with auto-adapting color scheme
 * Features: Lead capture, FAQ handling, booking flow
 */
const ChatbotWidget = ({ 
  tenantId, 
  businessName = "Your Business",
  businessPhone = "(555) 123-4567",
  industry = "services",
  apiUrl = "http://localhost:1337/api"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState('greeting');
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    zipCode: ''
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-adapt to template colors
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    text: '#1F2937',
    bg: '#FFFFFF',
    border: '#E5E7EB'
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    // Detect page colors from CSS
    const detectColors = () => {
      const style = getComputedStyle(document.body);
      const primaryColor = style.getPropertyValue('--primary-color') || 
                          style.getPropertyValue('color') || 
                          '#3B82F6';
      setColors(prev => ({
        ...prev,
        primary: primaryColor,
        primaryDark: adjustBrightness(primaryColor, -20)
      }));
    };
    detectColors();
    
    // Initialize with greeting only once
    if (!isInitialized.current && messages.length === 0) {
      isInitialized.current = true;
      setMessages([{ sender: 'bot', text: getGreeting(), timestamp: new Date() }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustBrightness = (hex, percent) => {
    if (!hex || !hex.startsWith('#')) return hex;
    const num = parseInt(hex.replace("#", ""), 16);
    if (isNaN(num)) return hex;
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getGreeting = () => {
    const industryGreetings = {
      'pest control': `Hi! Looking for pest control? I can get you a quote in 30 seconds.`,
      'hvac': `Hi! Need HVAC services? I can help you schedule an appointment right away.`,
      'plumbing': `Hi! Got a plumbing issue? I can connect you with a quote quickly.`,
      'electrical': `Hi! Looking for electrical services? I can get you set up in no time.`,
      'landscaping': `Hi! Need landscaping help? Let me get you a quote!`
    };
    return industryGreetings[industry.toLowerCase()] || 
           `Hi! Looking for ${industry} services? I can get you a quote in 30 seconds.`;
  };

  const addMessage = (sender, text, delay = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { sender, text, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const simulateTyping = (callback, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleFAQ = (userMessage) => {
    const faqMap = {
      'cost': { 
        question: /how much|price|cost|rates?/i,
        answers: {
          'pest control': 'Our pest control services typically range from $150-$500 depending on the size of your property and type of treatment. Would you like a free quote?',
          'hvac': 'HVAC service costs vary by job type - repairs start around $150, installations range from $3,000-$8,000. I can get you a specific quote!',
          'plumbing': 'Plumbing service calls start at $99 for diagnostics. Repairs vary by complexity. Want me to get you a detailed quote?',
          'electrical': 'Electrical service calls start at $95. Installation and repair costs depend on the project. Can get you a custom quote!',
          'landscaping': 'Landscaping projects vary by scope. Basic maintenance starts around $100/month. I can get you a personalized quote!'
        }
      },
      'licensed': {
        question: /licensed|insured|certified|bonded/i,
        answer: `Yes! ${businessName} is fully licensed, insured, and bonded. We're committed to professional, reliable service.`
      },
      'areas': {
        question: /what areas|service area|where do you|coverage|location/i,
        answer: `We serve the greater metro area. What's your zip code? I can check if we cover your location!`
      },
      'availability': {
        question: /how quickly|when can|available|emergency|urgent/i,
        answer: `We typically have same-day or next-day availability for most services. For emergencies, we can often be there within a few hours. Want me to check our calendar?`
      }
    };

    for (const [key, faq] of Object.entries(faqMap)) {
      if (faq.question.test(userMessage)) {
        if (key === 'cost' && faq.answers[industry.toLowerCase()]) {
          return faq.answers[industry.toLowerCase()];
        }
        return faq.answer || faq.answers?.default || 'Let me help you with that!';
      }
    }
    return null;
  };

  const handleUserMessage = async (text) => {
    const userMsg = text.trim().toLowerCase();
    
    // Add user message
    addMessage('user', text);

    // Check for FAQ first
    const faqResponse = handleFAQ(text);
    if (faqResponse) {
      simulateTyping(() => {
        addMessage('bot', faqResponse);
      }, 600);
      return;
    }

    // Handle conversation flow
    switch (conversationState) {
      case 'greeting':
        // Check for positive responses (catch affirmative language)
        const positiveWords = ['yes', 'sure', 'okay', 'ok', 'absolutely', 'definitely', 'yeah', 'yep', 'yup', 'please', 'let', 'help', 'quote', 'interested', 'sounds good'];
        const negativeWords = ['no', 'nah', 'nope', 'not interested', 'no thanks'];

        const isPositive = positiveWords.some(word => userMsg.includes(word));
        const isNegative = negativeWords.some(word => userMsg.includes(word));

        if (isPositive && !isNegative) {
          simulateTyping(() => {
            setConversationState('collecting_name');
            addMessage('bot', `Great! What's your name?`);
          });
        } else if (isNegative) {
          simulateTyping(() => {
            addMessage('bot', `No problem! If you change your mind, I'm here 24/7. Have a great day!`);
          });
        } else {
          // Unclear response - prompt again
          simulateTyping(() => {
            addMessage('bot', `Would you like to get a quote? Just say yes and I'll get your info!`);
          });
        }
        break;

      case 'collecting_name':
        setLeadData(prev => ({ ...prev, name: text }));
        simulateTyping(() => {
          setConversationState('collecting_phone');
          addMessage('bot', `Nice to meet you, ${text}! What's the best phone number to reach you?`);
        });
        break;

      case 'collecting_phone':
        setLeadData(prev => ({ ...prev, phone: text }));
        simulateTyping(() => {
          setConversationState('collecting_email');
          addMessage('bot', `Perfect! And your email address?`);
        });
        break;

      case 'collecting_email':
        setLeadData(prev => ({ ...prev, email: text }));
        simulateTyping(() => {
          setConversationState('collecting_service');
          addMessage('bot', `What service are you looking for? (e.g., general service, emergency repair, consultation)`);
        });
        break;

      case 'collecting_service':
        setLeadData(prev => ({ ...prev, service: text }));
        simulateTyping(() => {
          setConversationState('collecting_zip');
          addMessage('bot', `Last thing - what's your zip code?`);
        });
        break;

      case 'collecting_zip':
        setLeadData(prev => ({ ...prev, zipCode: text }));
        simulateTyping(async () => {
          // Submit lead
          try {
            const response = await fetch(`${apiUrl}/chatbot/leads`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...leadData,
                zipCode: text,
                tenantId,
                source: 'chatbot',
                timestamp: new Date().toISOString()
              })
            });

            if (response.ok) {
              addMessage('bot', `Perfect! I've got all your info. ${businessName} will text you within 15 minutes. Expect a call from ${businessPhone}. Have a great day! 🎉`);
              setConversationState('completed');
              
              // Reset after 3 seconds
              setTimeout(() => {
                setConversationState('greeting');
                setLeadData({ name: '', phone: '', email: '', service: '', zipCode: '' });
                // Only reset messages if we want to start fresh (commented out for now - keeps conversation)
                // setMessages([{ sender: 'bot', text: getGreeting(), timestamp: new Date() }]);
              }, 3000);
            } else {
              throw new Error('Failed to submit lead');
            }
          } catch (error) {
            console.error('Error submitting lead:', error);
            addMessage('bot', `Thanks! ${businessName} will reach out to you shortly at ${leadData.phone}.`);
            setConversationState('completed');
          }
        }, 800);
        break;

      default:
        simulateTyping(() => {
          addMessage('bot', `I'm here to help! Would you like a quote or have questions about our services?`);
        });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value.trim()) {
      handleUserMessage(input.value);
      input.value = '';
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ 
            backgroundColor: colors.primary,
            boxShadow: `0 10px 40px ${colors.primary}40`
          }}
          aria-label="Open chat"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: colors.primary }}></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col transition-all duration-300 animate-slide-up"
          style={{ 
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`
          }}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 rounded-t-2xl flex items-center justify-between"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{businessName}</h3>
                <p className="text-white/80 text-xs">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ backgroundColor: '#FAFAFA' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'rounded-br-sm'
                      : 'rounded-bl-sm'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? colors.primary : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : colors.text,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  focusRingColor: colors.primary
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: colors.primary }}
                aria-label="Send message"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;

