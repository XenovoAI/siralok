'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      setEmailSent(true)
      toast.success('Password reset email sent! Please check your inbox.')
    } catch (error) {
      console.error('Forgot password error:', error)
      // Don't reveal if email exists or not for security
      toast.success('If an account exists with this email, a password reset link has been sent.')
      setEmailSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SIR<span className="text-sky-600">CBSE</span>
            </h1>
          </Link>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!emailSent ? (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mx-auto mb-4">
                <Mail className="w-8 h-8 text-sky-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h2>
              <p className="text-gray-600 mb-6 text-center">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Check Your Email</h2>
              <p className="text-gray-600 mb-6 text-center">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to reset your password.
              </p>

              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Didn't receive the email?</strong>
                  <br />
                  • Check your spam folder
                  <br />
                  • Make sure you entered the correct email
                  <br />
                  • Wait a few minutes and try again
                </p>
              </div>

              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Try Another Email
              </Button>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sky-600 hover:text-sky-700 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
