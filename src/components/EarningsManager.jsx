import { useState } from 'react'

function EarningsManager({ customColors, backgroundImage }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [exportFormat, setExportFormat] = useState('csv')

  // Mock earnings data - in production this comes from Strapi/Stripe
  const [earningsData] = useState({
    2025: {
      totalRevenue: 127450.00,
      totalExpenses: 23890.00,
      netIncome: 103560.00,
      taxableIncome: 103560.00,
      quarterlyBreakdown: [
        { quarter: 'Q1', revenue: 28650.00, expenses: 5240.00, net: 23410.00 },
        { quarter: 'Q2', revenue: 31200.00, expenses: 6150.00, net: 25050.00 },
        { quarter: 'Q3', revenue: 33800.00, expenses: 6200.00, net: 27600.00 },
        { quarter: 'Q4', revenue: 33800.00, expenses: 6300.00, net: 27500.00 }
      ],
      monthlyData: [
        { month: 'Jan', revenue: 9200.00, expenses: 1800.00, net: 7400.00 },
        { month: 'Feb', revenue: 9650.00, expenses: 1740.00, net: 7910.00 },
        { month: 'Mar', revenue: 9800.00, expenses: 1700.00, net: 8100.00 },
        { month: 'Apr', revenue: 10200.00, expenses: 2050.00, net: 8150.00 },
        { month: 'May', revenue: 10500.00, expenses: 2000.00, net: 8500.00 },
        { month: 'Jun', revenue: 10500.00, expenses: 2100.00, net: 8400.00 },
        { month: 'Jul', revenue: 11200.00, expenses: 2100.00, net: 9100.00 },
        { month: 'Aug', revenue: 11300.00, expenses: 2000.00, net: 9300.00 },
        { month: 'Sep', revenue: 11300.00, expenses: 2100.00, net: 9200.00 },
        { month: 'Oct', revenue: 11200.00, expenses: 2100.00, net: 9100.00 },
        { month: 'Nov', revenue: 11300.00, expenses: 2100.00, net: 9200.00 },
        { month: 'Dec', revenue: 11300.00, expenses: 2100.00, net: 9200.00 }
      ],
      paymentMethods: {
        cash: 38235.00,
        credit_card: 76225.00,
        deposits: 12990.00
      },
      expenseCategories: {
        supplies: 8950.00,
        rent: 12000.00,
        utilities: 1840.00,
        equipment: 1100.00
      }
    }
  })

  // Mock transaction data for detailed reports
  const [transactionData] = useState([
    {
      id: 1,
      date: '2025-01-15',
      clientName: 'Sarah Johnson',
      service: 'Medium Tattoo',
      amount: 450.00,
      paymentMethod: 'credit_card',
      type: 'revenue',
      category: 'tattoo_services',
      taxable: true
    },
    {
      id: 2,
      date: '2025-01-18',
      description: 'Tattoo Supplies - Ink & Needles',
      amount: 185.50,
      paymentMethod: 'credit_card',
      type: 'expense',
      category: 'supplies',
      taxDeductible: true
    },
    {
      id: 3,
      date: '2025-01-20',
      clientName: 'Mike Chen',
      service: 'Small Tattoo',
      amount: 250.00,
      paymentMethod: 'cash',
      type: 'revenue',
      category: 'tattoo_services',
      taxable: true
    }
  ])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const generateTaxReport = () => {
    const data = earningsData[selectedYear]

    const taxSummary = {
      totalIncome: data.totalRevenue,
      businessExpenses: data.totalExpenses,
      netProfit: data.netIncome,
      estimatedTaxes: data.netIncome * 0.25, // Rough estimate
      quarterlyPayments: data.quarterlyBreakdown.map(q => ({
        quarter: q.quarter,
        estimatedPayment: q.net * 0.25
      }))
    }

    return taxSummary
  }

  const exportData = (format) => {
    const data = earningsData[selectedYear]
    const taxReport = generateTaxReport()

    if (format === 'csv') {
      // Generate CSV for accountant
      let csv = 'Date,Description,Amount,Type,Category,Tax Deductible\n'

      transactionData.forEach(transaction => {
        csv += `${transaction.date},${transaction.clientName || transaction.description},${transaction.amount},${transaction.type},${transaction.category},${transaction.taxDeductible || transaction.taxable}\n`
      })

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `earnings-${selectedYear}-detailed.csv`
      a.click()

    } else if (format === 'pdf') {
      // Mock PDF generation - in production use jsPDF or similar
      alert(`Generating PDF tax summary for ${selectedYear}...\n\nThis would include:\n- Schedule C summary\n- P&L statement\n- Expense categorization\n- 1099 preparation data`)

    } else if (format === 'quickbooks') {
      // Generate QuickBooks-compatible format
      alert(`Generating QuickBooks export for ${selectedYear}...\n\nThis would create a .QBO or .IIF file for direct import into QuickBooks.`)
    }
  }

  const taxReport = generateTaxReport()

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

      <div className="flex-1 p-6 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Earnings & Tax Manager</h1>
          <p className="text-gray-600">Track your business income and prepare for tax season</p>
        </div>

        {/* Year Selector & Export Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'overview' ? {
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                } : {}}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'tax'
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'tax' ? {
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                } : {}}
              >
                Tax Summary
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'transactions'
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'transactions' ? {
                  background: customColors?.primary ?
                    `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary || customColors.primary} 100%)` :
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                } : {}}
              >
                Transactions
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm text-sm"
            >
              <option value="csv">CSV (Excel)</option>
              <option value="pdf">PDF Report</option>
              <option value="quickbooks">QuickBooks</option>
            </select>
            <button
              onClick={() => exportData(exportFormat)}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              style={{
                background: customColors?.accent || '#10B981'
              }}
            >
              Export {selectedYear}
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData[selectedYear].totalRevenue)}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: customColors?.primary ?
                        `${customColors.primary}20` :
                        'rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData[selectedYear].totalExpenses)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Income</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData[selectedYear].netIncome)}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: customColors?.accent ?
                        `${customColors.accent}20` :
                        'rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Tax Owed</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxReport.estimatedTaxes)}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
              <div className="h-64 flex items-end space-x-2">
                {earningsData[selectedYear].monthlyData.map((month, index) => {
                  const maxRevenue = Math.max(...earningsData[selectedYear].monthlyData.map(m => m.revenue))
                  const height = (month.revenue / maxRevenue) * 200

                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col space-y-1">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${height}px`,
                            background: customColors?.primary ?
                              `linear-gradient(to top, ${customColors.primary}, ${customColors.secondary || customColors.primary})` :
                              'linear-gradient(to top, #3B82F6, #1D4ED8)'
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                      <span className="text-xs font-medium text-gray-900">{formatCurrency(month.revenue)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Methods & Expense Breakdown */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  {Object.entries(earningsData[selectedYear].paymentMethods).map(([method, amount]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-gray-600 capitalize">{method.replace('_', ' ')}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
                <div className="space-y-3">
                  {Object.entries(earningsData[selectedYear].expenseCategories).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-600 capitalize">{category}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tax Summary Tab */}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tax Year {selectedYear} Summary</h3>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Schedule C Preview</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Income (Line 1):</span>
                      <span className="font-semibold">{formatCurrency(taxReport.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Business Expenses (Line 28):</span>
                      <span className="font-semibold">{formatCurrency(taxReport.businessExpenses)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Net Profit (Line 31):</span>
                      <span className="font-semibold">{formatCurrency(taxReport.netProfit)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Estimated Tax Payments</h4>
                  <div className="space-y-3 text-sm">
                    {taxReport.quarterlyPayments.map((payment, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{payment.quarter} Estimated Payment:</span>
                        <span className="font-semibold">{formatCurrency(payment.estimatedPayment)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total Estimated Tax:</span>
                      <span className="font-semibold">{formatCurrency(taxReport.estimatedTaxes)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">💡 Tax Tips for {selectedYear}</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All business supplies and equipment are tax-deductible</li>
                  <li>• Keep receipts for all cash transactions</li>
                  <li>• Consider quarterly estimated tax payments to avoid penalties</li>
                  <li>• Home office expenses may be deductible if you work from home</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options for Your Accountant</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => exportData('pdf')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-white/60 transition-colors text-center"
                >
                  <div className="text-red-600 mb-2">📄</div>
                  <div className="font-medium">PDF Summary</div>
                  <div className="text-sm text-gray-600">Complete tax report</div>
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-white/60 transition-colors text-center"
                >
                  <div className="text-green-600 mb-2">📊</div>
                  <div className="font-medium">Excel/CSV</div>
                  <div className="text-sm text-gray-600">Detailed transactions</div>
                </button>
                <button
                  onClick={() => exportData('quickbooks')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-white/60 transition-colors text-center"
                >
                  <div className="text-blue-600 mb-2">💼</div>
                  <div className="font-medium">QuickBooks</div>
                  <div className="text-sm text-gray-600">Direct import file</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {transactionData.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-white/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`w-3 h-3 rounded-full ${transaction.type === 'revenue' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <h4 className="font-medium text-gray-900">
                          {transaction.clientName || transaction.description}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'revenue'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{transaction.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>
                          <p className="font-medium capitalize">{transaction.paymentMethod.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tax Status:</span>
                          <p className="font-medium">
                            {transaction.taxable ? 'Taxable' : transaction.taxDeductible ? 'Deductible' : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EarningsManager