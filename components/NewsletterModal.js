'use client'

import { useState, useEffect } from 'react'
import { X, Mail, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewsletterSignup from './NewsletterSignup'

export default function NewsletterModal({ isOpen, onClose }) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => setShowModal(true), 100)
    } else {
      setShowModal(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setShowModal(false)
    setTimeout(() => onClose(), 300) // Wait for animation to complete
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      showModal ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
        showModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Stay Updated!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            Get the latest study materials, tips, and updates delivered straight to your inbox.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3 h-3 text-sky-600" />
              </div>
              <span>New study materials every week</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-sky-600" />
              </div>
              <span>Exam preparation tips & strategies</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-3 h-3 text-sky-600" />
              </div>
              <span>Exclusive content for subscribers</span>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <NewsletterSignup
            variant="modal"
            placeholder="Enter your email address"
            onSuccess={handleClose}
            className="mb-4"
          />

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
