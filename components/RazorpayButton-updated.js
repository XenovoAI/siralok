'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function RazorpayButton({ material, onSuccess, disabled = false }) {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue')
      return
    }

    // Validate material data
    if (!material || !material.id) {
      toast.error('Invalid material data')
      console.error('Material missing:', material)
      return
    }

    if (!material.price || material.price <= 0) {
      toast.error('Invalid material price')
      console.error('Material price missing or invalid:', material.price)
      return
    }

    setLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay SDK')
        setLoading(false)
        return
      }

      // Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: material.price,
          subscriptionType: 'material_purchase',
          userId: user.id,
          materialId: material.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.alreadyPurchased) {
          toast.info('You have already purchased this material')
          if (onSuccess) onSuccess()
          return
        }
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'SIR CBSE',
        description: material.title || 'Study Material',
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Show success message first
            toast.success('🎉 Payment successful! Processing download access...')

            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                materialId: material.id
              })
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            toast.success('✅ Download access granted! Refreshing page...')
            if (onSuccess) onSuccess()

            // Reload page after 2 seconds to show download button
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error(error.message || 'Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student',
          email: user?.email || '',
          contact: user?.user_metadata?.phone || ''
        },
        theme: {
          color: '#0EA5E9'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            toast.info('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
      setLoading(false)
    }
  }

  if (material.is_free) {
    return null
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || disabled}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Buy for ₹{material.price}
        </>
      )}
    </Button>
  )
}
