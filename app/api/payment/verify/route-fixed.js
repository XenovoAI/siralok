import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, materialId } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !materialId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update payment status using admin client (bypasses RLS)
    if (supabaseAdmin) {
      const { data: payment, error: updateError } = await supabaseAdmin
        .from('payments')
        .update({
          status: 'completed',
          razorpay_payment_id: razorpay_payment_id,
          completed_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .select()
        .single()

      if (updateError) throw updateError

      // Create purchase record
      const { error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .insert([
          {
            user_id: payment.user_id,
            material_id: materialId,
            payment_id: razorpay_payment_id,
            amount: payment.amount,
            status: 'completed'
          }
        ])

      if (purchaseError) {
        console.error('Error creating purchase record:', purchaseError)
        // Don't fail the payment for this
      }

      // Get user email from auth.users using admin client
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(payment.user_id)

      let userEmail = null
      if (!userError && userData?.user?.email) {
        userEmail = userData.user.email
      }

      // Create material download record
      const { error: downloadError } = await supabaseAdmin
        .from('material_downloads')
        .insert([
          {
            user_id: payment.user_id,
            user_email: userEmail || 'unknown@example.com', // Fallback if email not found
            material_id: materialId,
            payment_id: payment.id,
            downloaded_at: new Date().toISOString()
          }
        ])

      if (downloadError) {
        console.error('Error creating download record:', downloadError)
        // Don't fail the payment for this
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: payment.id
      })
    } else {
      // Fallback: return success without updating database
      console.warn('Supabase admin client not available, payment verified but not recorded')
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully'
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
