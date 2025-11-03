import { useState } from 'react'

function Calendar({ customColors, backgroundImage }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Mock events data - November 2025
  const mockEvents = [
    {
      id: 1,
      title: 'Johnson Residence - Termite Inspection',
      date: new Date(2025, 10, 4, 14, 0), // November 4, 2025 at 2:00 PM
      duration: 120,
      client: 'Johnson Residence',
      service: 'Termite Inspection',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Martinez Property - Free Quote',
      date: new Date(2025, 10, 5, 10, 0), // November 5, 2025 at 10:00 AM
      duration: 30,
      client: 'Martinez Property',
      service: 'Free Quote',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Davis Home - Quarterly Treatment',
      date: new Date(2025, 10, 7, 16, 0), // November 7, 2025 at 4:00 PM
      duration: 60,
      client: 'Davis Home',
      service: 'Quarterly Treatment',
      status: 'confirmed'
    },
    {
      id: 4,
      title: 'Smith Property - Rodent Control',
      date: new Date(2025, 10, 10, 9, 0), // November 10, 2025 at 9:00 AM
      duration: 90,
      client: 'Smith Property',
      service: 'Rodent Control',
      status: 'confirmed'
    },
    {
      id: 5,
      title: 'Anderson Estate - Initial Inspection',
      date: new Date(2025, 10, 12, 13, 30), // November 12, 2025 at 1:30 PM
      duration: 60,
      client: 'Anderson Estate',
      service: 'Initial Inspection',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Wilson Home - Ant Treatment',
      date: new Date(2025, 10, 14, 11, 0), // November 14, 2025 at 11:00 AM
      duration: 45,
      client: 'Wilson Home',
      service: 'Ant Treatment',
      status: 'confirmed'
    },
    {
      id: 7,
      title: 'Brown Residence - Follow-up Service',
      date: new Date(2025, 10, 18, 15, 0), // November 18, 2025 at 3:00 PM
      duration: 60,
      client: 'Brown Residence',
      service: 'Follow-up Service',
      status: 'confirmed'
    },
    {
      id: 8,
      title: 'Garcia Property - Bed Bug Treatment',
      date: new Date(2025, 10, 20, 10, 30), // November 20, 2025 at 10:30 AM
      duration: 180,
      client: 'Garcia Property',
      service: 'Bed Bug Treatment',
      status: 'confirmed'
    },
    {
      id: 9,
      title: 'Taylor Home - Free Estimate',
      date: new Date(2025, 10, 22, 14, 0), // November 22, 2025 at 2:00 PM
      duration: 30,
      client: 'Taylor Home',
      service: 'Free Estimate',
      status: 'pending'
    },
    {
      id: 10,
      title: 'Miller Estate - Monthly Service',
      date: new Date(2025, 10, 25, 12, 0), // November 25, 2025 at 12:00 PM
      duration: 90,
      client: 'Miller Estate',
      service: 'Monthly Service',
      status: 'confirmed'
    },
    {
      id: 11,
      title: 'Thompson Residence - Spider Control',
      date: new Date(2025, 10, 27, 9, 30), // November 27, 2025 at 9:30 AM
      duration: 60,
      client: 'Thompson Residence',
      service: 'Spider Control',
      status: 'confirmed'
    },
    {
      id: 12,
      title: 'Lee Property - Termite Treatment',
      date: new Date(2025, 10, 28, 13, 0), // November 28, 2025 at 1:00 PM
      duration: 150,
      client: 'Lee Property',
      service: 'Termite Treatment',
      status: 'confirmed'
    }
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date) => {
    if (!date) return []
    return mockEvents.filter(event =>
      event.date.toDateString() === date.toDateString()
    )
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div
      className="flex h-full relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/85" />
      )}
      {/* Calendar Grid */}
      <div className="flex-1 p-6 relative z-10">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-white rounded-lg transition-colors shadow-sm"
            style={{
              background: customColors?.primary ?
                `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            }}
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
          {/* Day headers */}
          {dayNames.map(day => (
            <div
              key={day}
              className="bg-white/80 backdrop-blur-sm p-4 text-sm font-medium text-gray-900 text-center"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => (
            <div
              key={index}
              className={`p-2 min-h-[120px] transition-colors ${
                date ? 'hover:bg-white/90 cursor-pointer' : ''
              }`}
              style={{
                backgroundColor: isToday(date)
                  ? (customColors?.primary ? customColors.primary + '10' : 'rgba(59, 130, 246, 0.1)')
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)'
              }}
            >
              {date && (
                <>
                  <div
                    className={`text-sm mb-2 ${
                      isToday(date) ? 'font-bold' : 'text-gray-900'
                    }`}
                    style={{
                      color: isToday(date) ? (customColors?.primary || '#3B82F6') : undefined
                    }}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {getEventsForDate(date).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-xs p-1 rounded cursor-pointer truncate transition-colors backdrop-blur-sm ${
                          event.status === 'confirmed'
                            ? 'bg-green-100/80 text-green-800 hover:bg-green-200/80 border border-green-200'
                            : 'bg-yellow-100/80 text-yellow-800 hover:bg-yellow-200/80 border border-yellow-200'
                        }`}
                      >
                        {formatTime(event.date)} {event.client}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Sidebar */}
      {selectedEvent && (
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-white/50 p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
            <button
              onClick={() => setSelectedEvent(null)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <p className="text-gray-900">{selectedEvent.client}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <p className="text-gray-900">{selectedEvent.service}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <p className="text-gray-900">
                {selectedEvent.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-600">
                {formatTime(selectedEvent.date)} ({selectedEvent.duration} min)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                selectedEvent.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
              </span>
            </div>

            <div className="pt-4 space-y-2">
              <button
                className="w-full px-4 py-2 text-white rounded-lg transition-colors shadow-sm"
                style={{
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                }}
              >
                Edit Appointment
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white/60 transition-colors backdrop-blur-sm">
                Send Message
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50/60 transition-colors backdrop-blur-sm">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar