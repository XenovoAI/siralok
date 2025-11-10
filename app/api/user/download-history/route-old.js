import { NextResponse } from 'next/server'
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

    // Get user's download history
    const { data: downloads, error } = await supabase
      .from('material_downloads')
      .select(`
        id,
        material_id,
        material_title,
        material_type,
        downloaded_at,
        materials (
          id,
          title,
          description,
          subject,
          class,
          thumbnail_url,
          is_free,
          price
        )
      `)
      .eq('user_id', user.id)
      .order('downloaded_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(downloads || [])
  } catch (error) {
    console.error('Error fetching download history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download history' },
      { status: 500 }
    )
  }
}
