import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(request) {
  try {
    const { amount, subscriptionType, userId, materialId } = await request.json()

    if (!amount || !subscriptionType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        subscription_type: subscriptionType,
        user_id: userId
      }
    }

    const order = await razorpay.orders.create(options)

    // Save payment record in database using admin client (bypasses RLS)
    if (supabaseAdmin) {
      const { data: payment, error } = await supabaseAdmin
        .from('payments')
        .insert([
          {
            user_id: userId,
            amount: amount,
            payment_method: 'razorpay',
            transaction_id: order.id,
            razorpay_order_id: order.id,
            status: 'pending',
            subscription_type: subscriptionType
          }
        ])
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id
      })
    } else {
      // Fallback: return order without saving to database
      console.warn('Supabase admin client not available, returning order without saving')
      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: null
      })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
