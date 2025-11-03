import { useState } from 'react';
import ChatbotWidget from './ChatbotWidget';

/**
 * Demo page for showcasing the chatbot
 * This is what you show clients on Zoom calls
 */
const ChatbotDemo = () => {
  const [demoConfig, setDemoConfig] = useState({
    tenantId: 'demo-tenant-123',
    businessName: 'ABC Pest Control',
    businessPhone: '(555) 123-4567',
    industry: 'pest control',
    apiUrl: 'http://localhost:1337/api'
  });

  const industries = [
    { value: 'pest control', label: 'Pest Control' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'landscaping', label: 'Landscaping' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Chatbot Demo - Victory Rush
          </h1>
          <p className="text-gray-600 mb-6">
            This is your $5k product. Watch leads appear in real-time in the admin panel.
          </p>

          {/* Config Panel */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={demoConfig.businessName}
                onChange={(e) => setDemoConfig({ ...demoConfig, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={demoConfig.industry}
                onChange={(e) => setDemoConfig({ ...demoConfig, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Phone
              </label>
              <input
                type="text"
                value={demoConfig.businessPhone}
                onChange={(e) => setDemoConfig({ ...demoConfig, businessPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API URL
              </label>
              <input
                type="text"
                value={demoConfig.apiUrl}
                onChange={(e) => setDemoConfig({ ...demoConfig, apiUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Flow (60 seconds):</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Click chat bubble → smooth open animation</li>
              <li>Bot greets with industry-specific message</li>
              <li>Say "Yes" → Bot collects: Name, Phone, Email, Service, Zip</li>
              <li>Bot confirms: "{demoConfig.businessName} will text you within 15 minutes"</li>
              <li>Lead appears LIVE in admin panel during demo</li>
              <li>Client reaction: "Holy shit, when can we start?"</li>
            </ol>
          </div>
        </div>

        {/* Demo Website Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {demoConfig.businessName}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Professional {industries.find(i => i.value === demoConfig.industry)?.label} Services
            </p>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-2">Why Choose Us?</h3>
                <p className="text-gray-700">
                  We provide reliable, professional service with 24/7 support. 
                  Click the chat button to get an instant quote!
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-gray-600">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15min</div>
                  <div className="text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Widget - Rendered here */}
      <ChatbotWidget {...demoConfig} />
    </div>
  );
};

export default ChatbotDemo;


