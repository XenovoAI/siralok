import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    // Get user from session
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user's purchases with detailed information using admin client (bypasses RLS)
    if (supabaseAdmin) {
      const { data: purchases, error } = await supabaseAdmin
        .from('purchases')
        .select(`
          id,
          material_id,
          payment_id,
          amount,
          status,
          created_at,
          updated_at,
          materials (
            id,
            title,
            description,
            subject,
            class,
            pdf_url,
            thumbnail_url,
            price
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get payment details and download history for each purchase
      const purchasesWithDetails = await Promise.all(
        (purchases || []).map(async (purchase) => {
          // Get payment details using payment_id (which is transaction_id)
          const { data: payment } = await supabaseAdmin
            .from('payments')
            .select('id, transaction_id, razorpay_order_id, razorpay_payment_id, payment_method, created_at')
            .eq('transaction_id', purchase.payment_id)
            .single()

          // Get download history
          const { data: downloads } = await supabaseAdmin
            .from('material_downloads')
            .select('downloaded_at')
            .eq('user_id', user.id)
            .eq('material_id', purchase.material_id)
            .order('downloaded_at', { ascending: false })
            .limit(1)

          return {
            ...purchase,
            payments: payment || null,
            last_downloaded: downloads?.[0]?.downloaded_at || null
          }
        })
      )

      return NextResponse.json(purchasesWithDetails)
    } else {
      // Fallback: return empty array
      console.warn('Supabase admin client not available')
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    )
  }
}
