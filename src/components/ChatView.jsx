import { useState } from 'react'
import MessageInput from './MessageInput'

const ChatView = ({ conversation, customColors, backgroundImage }) => {
  // Mock messages data - will be replaced with real data later
  const messages = conversation ? [
    {
      id: 1,
      text: 'Hi! I wanted to ask about aftercare for my new tattoo.',
      sender: 'client',
      timestamp: '2:15 PM',
      clientName: conversation.clientName
    },
    {
      id: 2,
      text: 'Hi! Keep it clean and dry for the first 24 hours. Apply the healing balm I gave you twice daily.',
      sender: 'business',
      timestamp: '2:18 PM'
    },
    {
      id: 3,
      text: 'Should I wrap it at night?',
      sender: 'client',
      timestamp: '2:20 PM',
      clientName: conversation.clientName
    },
    {
      id: 4,
      text: 'Only for the first 2-3 nights. After that, let it breathe. Avoid tight clothing over the area.',
      sender: 'business',
      timestamp: '2:25 PM'
    },
    {
      id: 5,
      text: 'Thank you for the consultation!',
      sender: 'client',
      timestamp: '2:30 PM',
      clientName: conversation.clientName
    }
  ] : []

  if (!conversation) {
    return (
      <div
        className="flex-1 flex items-center justify-center bg-gray-50 relative"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-white/80" />
        )}
        <div className="text-center relative z-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
            style={{
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary}20 0%, ${customColors.secondary || customColors.primary}20 100%)` :
                'rgba(229, 231, 235, 0.8)'
            }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: customColors?.primary || '#9CA3AF' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No conversation selected</h3>
          <p className="text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/90" />
      )}

      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            }}
          >
            {conversation.avatar}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{conversation.clientName}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'business' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.sender === 'business' ? 'order-1' : 'order-2'}`}>
              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-lg shadow-sm ${
                  message.sender === 'business'
                    ? 'text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200'
                }`}
                style={message.sender === 'business' ? {
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                } : {}}
              >
                <p className="text-sm">{message.text}</p>
              </div>

              {/* Timestamp */}
              <div className={`mt-1 text-xs text-gray-500 ${message.sender === 'business' ? 'text-right' : 'text-left'}`}>
                {message.timestamp}
              </div>
            </div>

            {/* Avatar for client messages */}
            {message.sender === 'client' && (
              <div className="order-1 mr-3 mt-auto">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium backdrop-blur-sm"
                  style={{
                    background: customColors?.accent ?
                      customColors.accent + '40' :
                      'rgba(209, 213, 219, 0.8)',
                    color: customColors?.accent || '#6B7280'
                  }}
                >
                  {conversation.avatar}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  )
}

export default ChatView