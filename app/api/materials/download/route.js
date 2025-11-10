import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
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

    const body = await request.json()
    const { materialId, materialTitle } = body

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }

    // Get material details to check if it's free or paid
    const { data: material, error: materialError } = await supabase
      .from('materials')
      .select('id, title, is_free, price')
      .eq('id', materialId)
      .single()

    if (materialError || !material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Check if user has purchased this material (if it's paid)
    let materialType = 'free'
    if (!material.is_free) {
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', materialId)
        .eq('status', 'completed')
        .single()

      if (!purchase) {
        return NextResponse.json(
          { error: 'Material not purchased' },
          { status: 403 }
        )
      }
      materialType = 'paid'
    }

    // Check if download already exists (to avoid duplicates)
    const { data: existingDownload } = await supabase
      .from('material_downloads')
      .select('id')
      .eq('user_id', user.id)
      .eq('material_id', materialId)
      .single()

    if (!existingDownload) {
      // Record the download
      const { error: downloadError } = await supabase
        .from('material_downloads')
        .insert({
          user_id: user.id,
          user_email: user.email,
          material_id: materialId,
          material_title: materialTitle || material.title,
          material_type: materialType,
          downloaded_at: new Date().toISOString()
        })

      if (downloadError) {
        console.error('Error recording download:', downloadError)
        // Don't fail the request if download tracking fails
      }

      // Increment download count
      const { error: updateError } = await supabase
        .from('materials')
        .update({
          downloads: material.downloads ? material.downloads + 1 : 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', materialId)

      if (updateError) {
        console.error('Error updating download count:', updateError)
        // Don't fail the request if count update fails
      }
    }

    return NextResponse.json({
      success: true,
      message: existingDownload ? 'Download already recorded' : 'Download recorded successfully',
      material: {
        id: material.id,
        title: material.title,
        is_free: material.is_free
      }
    })

  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    )
  }
}
