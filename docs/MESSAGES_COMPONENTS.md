# Messages/DM Inbox Components Documentation

## Overview
The Messages module provides a complete direct messaging system for service-based businesses to communicate with clients. It consists of three main components that work together to create a WhatsApp-style messaging interface.

## Components

### 1. ConversationSidebar.jsx
**Purpose**: Displays a list of client conversations with preview information.

**Key Features**:
- List of active conversations with client avatars
- Last message preview with timestamps
- Unread message indicators
- Real-time conversation selection
- Professional sidebar layout matching modern messaging apps

**Props**:
- `selectedConversation` (object): Currently selected conversation
- `onSelectConversation` (function): Callback when conversation is selected

**Mock Data Structure**:
```javascript
{
  id: 1,
  clientName: "Sarah Johnson",
  avatar: "SJ",
  lastMessage: "Perfect! Looking forward to it.",
  timestamp: "2 min ago",
  unread: true
}
```

---

### 2. ChatView.jsx
**Purpose**: Main conversation interface showing message history and real-time chat.

**Key Features**:
- Threaded message display with bubble styling
- Timestamp formatting for messages
- Message status indicators (sent, delivered, read)
- File attachment support with icons
- Responsive design with proper scrolling
- Empty state handling when no conversation selected

**Props**:
- `conversation` (object): The current conversation data

**Message Types Supported**:
- Text messages
- File attachments (images, documents, etc.)
- Timestamps with smart formatting

**Message Structure**:
```javascript
{
  id: 1,
  senderId: 1,
  senderName: "Sarah Johnson",
  content: "Hello! I wanted to discuss my appointment.",
  timestamp: new Date(),
  type: "text", // or "file"
  fileName: "design-reference.jpg", // for file types
  fileSize: "2.5 MB" // for file types
}
```

---

### 3. MessageInput.jsx
**Purpose**: Input interface for sending new messages and file attachments.

**Key Features**:
- Text input with send button
- File attachment functionality
- Real-time input validation
- Professional styling consistent with modern messaging apps
- Keyboard shortcuts (Enter to send)

**Props**:
- `onSendMessage` (function): Callback when message is sent
- `onSendFile` (function): Callback when file is attached

**Functionality**:
- Handles text message composition
- File upload with drag-and-drop support
- Input validation and error handling
- Message sending with proper state management

## Integration
These components work together in the main App.jsx:

```javascript
// In the messages view
<ConversationSidebar
  selectedConversation={selectedConversation}
  onSelectConversation={setSelectedConversation}
/>
<ChatView conversation={selectedConversation} />
```

## Styling
- Uses TailwindCSS for consistent styling
- Implements modern messaging UI patterns
- Responsive design for various screen sizes
- Hover states and smooth transitions
- Professional color scheme with gray/blue accents

## Future Enhancements
- Real-time WebSocket integration
- Message search functionality
- Message reactions/emojis
- Typing indicators
- Message forwarding
- Conversation archiving
- Push notifications

## Strapi Integration Points
When connecting to Strapi backend:

**Collections Needed**:
1. `conversations` - Store conversation metadata
2. `messages` - Store individual messages
3. `clients` - Link to client profiles
4. `attachments` - Handle file uploads

**API Endpoints**:
- GET `/conversations` - Fetch conversation list
- GET `/conversations/:id/messages` - Fetch message history
- POST `/messages` - Send new message
- POST `/attachments` - Upload files