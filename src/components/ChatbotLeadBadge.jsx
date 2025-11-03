import { useState, useEffect } from 'react';

/**
 * Badge component that shows new chatbot leads
 * Appears at top of ClientList when new leads arrive
 */
const ChatbotLeadBadge = ({ apiUrl = 'http://localhost:1337/api', onLeadClick }) => {
  const [newLeads, setNewLeads] = useState([]);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Poll for new leads every 5 seconds
    const pollLeads = async () => {
      try {
        const response = await fetch(`${apiUrl}/chatbot/leads`);
        if (response.ok) {
          const data = await response.json();
          // Filter leads from last 5 minutes
          const recentLeads = data.leads?.filter(lead => {
            const leadTime = new Date(lead.createdAt);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return leadTime > fiveMinutesAgo && lead.referralSource === 'website';
          }) || [];

          if (recentLeads.length > 0) {
            setNewLeads(recentLeads);
            setShowBadge(true);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
              setShowBadge(false);
            }, 10000);
          }
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Poll immediately, then every 5 seconds
    pollLeads();
    const interval = setInterval(pollLeads, 5000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  if (!showBadge || newLeads.length === 0) return null;

  const latestLead = newLeads[0];

  return (
    <div className="mb-6 animate-slide-down">
      <div
        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-xl p-6 shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 border-2 border-green-400"
        onClick={() => {
          if (onLeadClick) {
            onLeadClick(latestLead);
            setShowBadge(false);
          }
        }}
        style={{
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold">🔥 NEW LEAD CAPTURED!</span>
              {newLeads.length > 1 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/30 animate-bounce">
                  +{newLeads.length} new
                </span>
              )}
            </div>
            <p className="text-lg font-semibold text-white/95">
              {latestLead.firstName} {latestLead.lastName} • {latestLead.phone}
            </p>
            <p className="text-sm text-white/80 mt-1">
              Click to view details and respond immediately
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatbotLeadBadge;

