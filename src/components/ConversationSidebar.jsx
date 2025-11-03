import { useState } from 'react'

const ConversationSidebar = ({ selectedConversation, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock conversation data - will be replaced with real data later
  const conversations = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      lastMessage: 'Thank you for the consultation!',
      timestamp: '2:30 PM',
      unread: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      clientName: 'Mike Chen',
      lastMessage: 'When is my next appointment?',
      timestamp: '1:45 PM',
      unread: false,
      avatar: 'MC'
    },
    {
      id: 3,
      clientName: 'Emma Davis',
      lastMessage: 'I love the new design! Can we schedule a touch-up?',
      timestamp: '12:20 PM',
      unread: true,
      avatar: 'ED'
    },
    {
      id: 4,
      clientName: 'Alex Rodriguez',
      lastMessage: 'Thanks for the aftercare instructions',
      timestamp: 'Yesterday',
      unread: false,
      avatar: 'AR'
    },
    {
      id: 5,
      clientName: 'Lisa Wang',
      lastMessage: 'Looking forward to our session next week',
      timestamp: 'Monday',
      unread: false,
      avatar: 'LW'
    }
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">Messages</h1>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {conversation.avatar}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {conversation.clientName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConversationSidebar