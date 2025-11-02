import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing subscriber:', checkError)
      return NextResponse.json(
        { success: false, message: 'Database error. Please try again.' },
        { status: 500 }
      )
    }

    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, message: 'You are already subscribed to our newsletter!' },
        { status: 409 }
      )
    }

    // Generate verification token (for future email confirmation)
    const verificationToken = crypto.randomUUID()

    // Insert new subscriber
    const { data, error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        verification_token: verificationToken,
        verified: false // Set to true if skipping email verification
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting subscriber:', insertError)

      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'You are already subscribed to our newsletter!' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { success: false, message: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email here (when email service is set up)
    // For now, we'll mark as verified immediately for MVP
    const { error: updateError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({
        verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', data.id)

    if (updateError) {
      console.error('Error updating verification status:', updateError)
      // Don't fail the request for this - user is still subscribed
    }

    console.log(`New newsletter subscriber: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Welcome to SIRCBSE newsletter.'
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
