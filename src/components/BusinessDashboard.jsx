import { useState, useEffect } from 'react'

function BusinessDashboard({ businessInfo, theme, customColors, backgroundImage, onNavigateToClients, onNavigateToEarnings }) {
  // Fetch chatbot leads count
  const [leadsCount, setLeadsCount] = useState(0)
  const [isLoadingLeads, setIsLoadingLeads] = useState(true)

  useEffect(() => {
    const fetchLeadsCount = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/chatbot/leads')
        if (response.ok) {
          const data = await response.json()
          // Count leads from last 24 hours
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          const recentLeads = data.leads?.filter(lead => {
            const leadTime = new Date(lead.createdAt)
            return leadTime > twentyFourHoursAgo && lead.referralSource === 'website'
          }) || []
          setLeadsCount(recentLeads.length)
        }
      } catch (error) {
        console.error('Error fetching leads count:', error)
      } finally {
        setIsLoadingLeads(false)
      }
    }

    fetchLeadsCount()
    // Poll every 30 seconds
    const interval = setInterval(fetchLeadsCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Mock business data - in production, this would come from Stripe/Strapi
  const [businessStats] = useState({
    totalRevenue: 590161.80,
    monthlyRevenue: 45280,
    weeklyRevenue: 11618,
    totalClients: 247,
    activeAppointments: 18,
    pendingPayments: 2620,
    recentTransactions: [
      {
        id: 1,
        client: 'Johnson Residence',
        service: 'Termite inspection completed',
        amount: 350,
        time: '2 hours ago',
        avatar: '🏠'
      },
      {
        id: 2,
        client: 'Martinez Home',
        service: 'Quarterly pest treatment',
        amount: 125,
        time: '4 hours ago',
        avatar: '🏡'
      },
      {
        id: 3,
        client: 'Smith Property',
        service: 'Rodent removal service',
        amount: 275,
        time: '1 day ago',
        avatar: '🏘️'
      },
      {
        id: 4,
        client: 'Davis Estate',
        service: 'Initial inspection + quote',
        amount: 95,
        time: 'Yesterday',
        avatar: '🏛️'
      }
    ],
    weeklyData: [
      { day: 'Mo', income: 1618, spent: 800 },
      { day: 'Tu', income: 2200, spent: 1200 },
      { day: 'We', income: 1800, spent: 900 },
      { day: 'Th', income: 3200, spent: 1500 },
      { day: 'Fr', income: 2800, spent: 1100 },
      { day: 'Sa', income: 1500, spent: 700 },
      { day: 'Su', income: 900, spent: 400 }
    ]
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatCurrencyDecimals = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const maxIncome = Math.max(...businessStats.weeklyData.map(d => d.income))

  return (
    <div
      className="flex-1 bg-gray-50 p-8 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/80" />
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="col-span-8 space-y-6">
            {/* Revenue Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Main Revenue Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Balance</p>
                    <p className="text-gray-400 text-xs">Today</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrencyDecimals(businessStats.totalRevenue)}
                  </h2>
                  <p className="text-green-600 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Secure payment
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(businessStats.weeklyRevenue)}
                    </p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatCurrency(businessStats.pendingPayments)}
                    </p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </div>

              {/* New Leads Panel - THE DOPAMINE HIT! */}
              <div
                onClick={() => leadsCount > 0 && onNavigateToClients && onNavigateToClients()}
                className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    {leadsCount > 0 && (
                      <span className="animate-pulse text-2xl">🔥</span>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-white/90 text-sm font-medium mb-1">Chatbot Leads</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-5xl font-bold drop-shadow-sm">
                        {isLoadingLeads ? '...' : leadsCount}
                      </h3>
                      <span className="text-white/80 text-lg font-medium">new</span>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm">Last 24 hours</p>

                  {leadsCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-white/90 text-xs font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Click to view in Clients
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Summary Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Summary</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600 font-medium">
                      {formatCurrency(businessStats.weeklyRevenue)} Weekly
                    </span>
                    <span className="text-amber-600 font-medium">
                      {formatCurrency(businessStats.monthlyRevenue/4)} Expenses
                    </span>
                  </div>
                </div>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end space-x-3 h-48">
                {businessStats.weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col-reverse space-y-reverse space-y-1 mb-2">
                      {/* Income bar */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                        style={{ height: `${(day.income / maxIncome) * 120}px` }}
                      />
                      {/* Spent bar */}
                      <div
                        className="w-full bg-gradient-to-t from-amber-300 to-amber-500 rounded-t"
                        style={{ height: `${(day.spent / maxIncome) * 120}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span className="text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
                  <span className="text-gray-600">Spent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
                <span className="text-sm text-gray-500">Recent</span>
              </div>

              <div className="space-y-4">
                {businessStats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {transaction.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{transaction.client}</p>
                        <p className="text-xs text-gray-500">{transaction.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 text-sm">
                        +{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-400">{transaction.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigateToEarnings && onNavigateToEarnings()}
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all activities →
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Clients</span>
                  <span className="font-semibold text-gray-900">{businessStats.totalClients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Active Appointments</span>
                  <span className="font-semibold text-gray-900">{businessStats.activeAppointments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">This Month</span>
                  <span className="font-semibold text-green-600">{formatCurrency(businessStats.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Growth Rate</span>
                  <span className="font-semibold text-blue-600">+23.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessDashboard