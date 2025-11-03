import { useState } from 'react'

function PaymentForm({
  appointment,
  onPaymentSuccess,
  onCancel,
  paymentType = 'deposit' // 'deposit', 'full', 'remaining'
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    email: '',
    saveCard: false
  })

  // Calculate payment amounts
  const servicePrice = appointment?.service?.price || 0
  const depositPercentage = appointment?.service?.depositPercentage || 50
  const depositAmount = Math.round((servicePrice * depositPercentage) / 100)
  const remainingAmount = servicePrice - depositAmount

  // Stripe fees calculation (2.9% + $0.30)
  const calculateTotal = (amount) => {
    const stripeFee = Math.round(amount * 0.029 + 30) / 100
    return {
      subtotal: amount,
      processingFee: stripeFee,
      total: amount + stripeFee
    }
  }

  const getPaymentAmount = () => {
    switch (paymentType) {
      case 'deposit':
        return depositAmount
      case 'full':
        return servicePrice
      case 'remaining':
        return remainingAmount
      default:
        return depositAmount
    }
  }

  const paymentAmount = getPaymentAmount()
  const amounts = calculateTotal(paymentAmount)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // In production, this would:
      // 1. Create Stripe PaymentIntent
      // 2. Confirm payment with card details
      // 3. Update appointment status in Strapi
      // 4. Send confirmation email/SMS
      // 5. Create payment record

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful payment
      const paymentResult = {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        amount: amounts.total * 100, // Stripe uses cents
        status: 'succeeded',
        created: Date.now(),
        paymentMethod: {
          type: 'card',
          last4: cardDetails.number.slice(-4),
          brand: 'visa'
        }
      }

      onPaymentSuccess(paymentResult)
    } catch (err) {
      setError('Payment failed. Please check your card details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value) => {
    // Add spaces every 4 digits
    const cleanValue = value.replace(/\s/g, '')
    const groups = cleanValue.match(/.{1,4}/g) || []
    return groups.join(' ').substr(0, 19) // Limit to 16 digits + 3 spaces
  }

  const formatExpiry = (value) => {
    // Add slash after MM
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length >= 2) {
      return cleanValue.substr(0, 2) + '/' + cleanValue.substr(2, 2)
    }
    return cleanValue
  }

  const getPaymentTitle = () => {
    switch (paymentType) {
      case 'deposit':
        return `Secure Your Appointment - ${depositPercentage}% Deposit`
      case 'full':
        return 'Pay in Full'
      case 'remaining':
        return 'Complete Payment'
      default:
        return 'Payment'
    }
  }

  const getPaymentDescription = () => {
    switch (paymentType) {
      case 'deposit':
        return `Pay ${depositPercentage}% now to secure your appointment. The remaining $${remainingAmount} will be due at your appointment.`
      case 'full':
        return 'Pay the full amount now and you\'re all set!'
      case 'remaining':
        return 'Complete your payment for this appointment.'
      default:
        return 'Secure payment processing by Stripe.'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{getPaymentTitle()}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">{getPaymentDescription()}</p>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{appointment?.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{appointment?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{appointment?.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Service Cost:</span>
              <span className="font-medium">${servicePrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Payment Amount Breakdown */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  {paymentType === 'deposit' ? `Deposit (${depositPercentage}%)` :
                   paymentType === 'full' ? 'Full Payment' : 'Remaining Balance'}:
                </span>
                <span className="font-semibold">${amounts.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing fee:</span>
                <span className="text-gray-600">${amounts.processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-blue-200 pt-2">
                <span>Total:</span>
                <span>${amounts.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  number: formatCardNumber(e.target.value)
                })}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    expiry: formatExpiry(e.target.value)
                  })}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVC *
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    cvc: e.target.value.replace(/\D/g, '').substr(0, 4)
                  })}
                  placeholder="123"
                  maxLength="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  name: e.target.value
                })}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email for Receipt *
              </label>
              <input
                type="email"
                value={cardDetails.email}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  email: e.target.value
                })}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Save Card Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveCard"
                checked={cardDetails.saveCard}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  saveCard: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                Save card for future appointments
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Payment...
              </div>
            ) : (
              `Pay $${amounts.total.toFixed(2)}`
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured by Stripe. Your payment information is encrypted and secure.
          </div>

          {/* Terms */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            By completing this payment, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">terms of service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">cancellation policy</a>.
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm