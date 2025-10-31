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

    // Get user's purchases using admin client (bypasses RLS)
    if (supabaseAdmin) {
      const { data: purchases, error } = await supabaseAdmin
        .from('purchases')
        .select('material_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')

      if (error) throw error

      return NextResponse.json(purchases || [])
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
