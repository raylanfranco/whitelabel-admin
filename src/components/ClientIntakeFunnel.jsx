import { useState } from 'react'

function ClientIntakeFunnel() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Service Details
    problemDescription: '',
    propertyType: '',
    propertySize: '',
    serviceType: '',
    budget: '',
    timeframe: '',
    hasPhotos: false,
    photoFiles: [],

    // Property & Access Details
    propertyAddress: '',
    accessInstructions: '',
    preferredTimes: [],
    urgency: 'flexible',

    // Additional Information
    additionalNotes: ''
  })

  const totalSteps = 5

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files) => {
    // In production, this would upload to Supabase Storage
    const fileArray = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // Temporary preview URL
    }))
    setFormData(prev => ({
      ...prev,
      photoFiles: [...prev.photoFiles, ...fileArray]
    }))
  }

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      photoFiles: prev.photoFiles.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // In production, this would:
    // 1. Upload photos to Supabase Storage
    // 2. Create customer profile in Strapi
    // 3. Create service request
    // 4. Send confirmation SMS/email
    // 5. Notify business of new quote request

    console.log('Submitting quote request:', formData)
    alert('Thank you! Your service request has been submitted. We\'ll contact you within 2 hours with a quote.')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.problemDescription && formData.serviceType && formData.propertyType
      case 3:
        return formData.budget && formData.timeframe
      case 4:
        return formData.propertyAddress && formData.urgency
      case 5:
        return true // Review step
      default:
        return false
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request a Free Quote
          </h1>
          <p className="text-gray-600">
            Tell us about your service needs and get a quote within 2 hours
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
                <p className="text-gray-600">We'll need some basic information to get started</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          )}

          {/* Step 2: Tattoo Design Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your tattoo</h2>
                <p className="text-gray-600">The more details you provide, the better we can help you</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Description *</label>
                <textarea
                  value={formData.designDescription}
                  onChange={(e) => handleInputChange('designDescription', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your tattoo idea in detail. What do you envision? Any specific elements, symbols, or themes?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Placement *</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => handleInputChange('placement', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select placement</option>
                    <option value="arm">Arm</option>
                    <option value="forearm">Forearm</option>
                    <option value="shoulder">Shoulder</option>
                    <option value="back">Back</option>
                    <option value="chest">Chest</option>
                    <option value="leg">Leg</option>
                    <option value="thigh">Thigh</option>
                    <option value="calf">Calf</option>
                    <option value="ankle">Ankle</option>
                    <option value="wrist">Wrist</option>
                    <option value="other">Other (specify in notes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Size *</label>
                  <select
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select size</option>
                    <option value="small">Small (1-3 inches)</option>
                    <option value="medium">Medium (3-6 inches)</option>
                    <option value="large">Large (6-12 inches)</option>
                    <option value="extra-large">Extra Large (12+ inches)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style Preference</label>
                <select
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select style (optional)</option>
                  <option value="traditional">Traditional</option>
                  <option value="realism">Realism</option>
                  <option value="blackwork">Blackwork</option>
                  <option value="fine-line">Fine Line</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="geometric">Geometric</option>
                  <option value="tribal">Tribal</option>
                  <option value="neo-traditional">Neo-Traditional</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: References & Budget */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & References</h2>
                <p className="text-gray-600">Help us understand your timeline and budget expectations</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select budget</option>
                    <option value="under-200">Under $200</option>
                    <option value="200-400">$200 - $400</option>
                    <option value="400-800">$400 - $800</option>
                    <option value="800-1500">$800 - $1,500</option>
                    <option value="1500-3000">$1,500 - $3,000</option>
                    <option value="over-3000">Over $3,000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe *</label>
                  <select
                    value={formData.timeframe}
                    onChange={(e) => handleInputChange('timeframe', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select timeframe</option>
                    <option value="asap">ASAP (within 2 weeks)</option>
                    <option value="month">Within a month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="flexible">Flexible timeline</option>
                  </select>
                </div>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Images</label>
                <p className="text-sm text-gray-500 mb-3">Upload any reference images, sketches, or inspiration photos (optional)</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-600">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
                  </label>
                </div>

                {/* Uploaded Files Preview */}
                {formData.referenceFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {formData.referenceFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Experience & Preferences */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">A few more details</h2>
                <p className="text-gray-600">This helps us prepare for your consultation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Tattoo Experience</label>
                <textarea
                  value={formData.previousTattoos}
                  onChange={(e) => handleInputChange('previousTattoos', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about any previous tattoos you have, or if this is your first tattoo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pain Tolerance *</label>
                <select
                  value={formData.painTolerance}
                  onChange={(e) => handleInputChange('painTolerance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select pain tolerance</option>
                  <option value="low">Low - I'm sensitive to pain</option>
                  <option value="medium">Medium - Average pain tolerance</option>
                  <option value="high">High - I handle pain well</option>
                  <option value="not-sure">Not sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Preference *</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="consultationType"
                      value="in-person"
                      checked={formData.consultationType === 'in-person'}
                      onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">In-person consultation</span>
                  </label>
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="consultationType"
                      value="virtual"
                      checked={formData.consultationType === 'virtual'}
                      onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">Virtual consultation</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions & Allergies</label>
                <textarea
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please list any medical conditions, allergies, or medications that might affect the tattooing process"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
                <p className="text-gray-600">Please review your details before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700">{formData.firstName} {formData.lastName}</p>
                  <p className="text-gray-700">{formData.email}</p>
                  <p className="text-gray-700">{formData.phone}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Tattoo Details</h3>
                  <p className="text-gray-700 mb-1"><strong>Design:</strong> {formData.designDescription}</p>
                  <p className="text-gray-700 mb-1"><strong>Placement:</strong> {formData.placement}</p>
                  <p className="text-gray-700 mb-1"><strong>Size:</strong> {formData.size}</p>
                  {formData.style && <p className="text-gray-700"><strong>Style:</strong> {formData.style}</p>}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Budget & Timeline</h3>
                  <p className="text-gray-700 mb-1"><strong>Budget:</strong> {formData.budget}</p>
                  <p className="text-gray-700"><strong>Timeframe:</strong> {formData.timeframe}</p>
                </div>

                {formData.referenceFiles.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Reference Images</h3>
                    <p className="text-gray-700">{formData.referenceFiles.length} image(s) uploaded</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• We'll review your consultation request within 24 hours</li>
                  <li>• You'll receive an email confirmation with next steps</li>
                  <li>• We'll schedule your consultation (in-person or virtual)</li>
                  <li>• During consultation, we'll discuss design, pricing, and timeline</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Consultation Request
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Questions? Contact us at <a href="mailto:hello@studio.com" className="text-blue-600 hover:underline">hello@studio.com</a> or (555) 123-4567
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientIntakeFunnel