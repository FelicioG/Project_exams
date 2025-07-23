import React, { useState } from 'react'
import { X, Crown, Check, Star } from 'lucide-react'

function SubscriptionModal({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const plans = {
    monthly: {
      name: 'Monthly Premium',
      price: '₹299',
      period: '/month',
      features: [
        'Access to all exam papers',
        'Download unlimited PDFs',
        'Answer keys included',
        'Mobile app access',
        'Email support'
      ]
    },
    yearly: {
      name: 'Yearly Premium',
      price: '₹2,999',
      period: '/year',
      originalPrice: '₹3,588',
      savings: 'Save ₹589',
      features: [
        'Everything in Monthly',
        'Priority support',
        'Early access to new papers',
        'Offline download capability',
        'Study progress tracking'
      ]
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    // Here you would integrate with your payment processor
    // For demo purposes, we'll simulate a successful subscription
    setTimeout(() => {
      alert('Subscription activated! You now have access to all content.')
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">Upgrade to Premium</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 text-center">
          Get unlimited access to all exam papers, answer keys, and premium features
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedPlan === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(key)}
            >
              {key === 'yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="mt-2">
                    <span className="text-gray-500 line-through text-sm">{plan.originalPrice}</span>
                    <span className="text-green-600 text-sm ml-2 font-medium">{plan.savings}</span>
                  </div>
                )}
              </div>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Subscribe to ${plans[selectedPlan].name}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default SubscriptionModal