'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function NewsletterSignup({
  variant = 'default', // 'default', 'hero', 'footer', 'modal'
  showNameField = false,
  placeholder = "Enter your email to get study tips & new materials",
  className = ""
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Simple email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset states
    setError('')
    setSuccess(false)

    // Validate email
    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim() || null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail('')
        setName('')
        toast.success('Thanks for subscribing! Check your email for confirmation.')
      } else {
        if (data.message?.includes('already subscribed')) {
          setError('You are already subscribed!')
        } else {
          setError(data.message || 'Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className={`text-center p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Subscribed Successfully!</h3>
        <p className="text-green-700">Thanks for subscribing! Check your email for confirmation.</p>
      </div>
    )
  }

  // Different variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl max-w-md mx-auto'
      case 'footer':
        return 'bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md'
      case 'modal':
        return 'bg-white border border-gray-200 rounded-xl p-6 shadow-2xl max-w-md mx-auto'
      default:
        return 'bg-white border border-gray-200 rounded-lg p-6 shadow-md'
    }
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 rounded-full mb-4">
          <Mail className="w-6 h-6 text-sky-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Stay Updated with Study Tips
        </h3>
        <p className="text-gray-600 text-sm">
          Get the latest study materials, tips, and exam updates delivered to your inbox.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field (optional) */}
        {showNameField && (
          <div>
            <Label htmlFor="newsletter-name" className="text-sm font-medium text-gray-700">
              Name (Optional)
            </Label>
            <Input
              id="newsletter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
              disabled={loading}
            />
          </div>
        )}

        {/* Email field */}
        <div>
          <Label htmlFor="newsletter-email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="mt-1"
            disabled={loading}
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Subscribe
            </div>
          )}
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  )
}
