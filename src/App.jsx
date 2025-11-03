import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import ClientIntakeFunnel from './components/ClientIntakeFunnel'
import ChatbotDemo from './components/ChatbotDemo'

function App() {
  return (
    <Router>
      <Routes>
        {/* Client-facing intake funnel */}
        <Route path="/start" element={<ClientIntakeFunnel />} />

        {/* Chatbot demo page */}
        <Route path="/chatbot-demo" element={<ChatbotDemo />} />

        {/* Admin panel (default route) */}
        <Route path="/*" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
