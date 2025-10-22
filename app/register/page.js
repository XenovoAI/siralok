'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [returnUrl, setReturnUrl] = useState('/')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Get returnUrl from query params
    const url = searchParams.get('returnUrl')
    if (url) {
      setReturnUrl(url)
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'student' // Default role
          }
        }
      })

      if (error) throw error

      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        toast.success('Registration successful! Please check your email to confirm your account.')
        router.push(`/login${returnUrl !== '/' ? `?returnUrl=${returnUrl}` : ''}`)
      } else {
        // Auto-login successful (email confirmation disabled)
        toast.success('Registration successful! Welcome to SIR CBSE!')
        router.push(returnUrl !== '/' ? returnUrl : '/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: '', color: '' }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength()

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
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Minimum 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                Login
              </Link>
            </p>
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
