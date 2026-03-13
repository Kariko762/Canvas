import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'
import { verifySessionToken } from '@/lib/auth'
import { createAsset, getAssets, getAssetBySlug } from '@/lib/data'

// GET /api/assets - List all assets
export async function GET() {
  try {
    const assets = await getAssets()
    return NextResponse.json({ assets })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

// POST /api/assets - Create new asset
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifySessionToken(session.value)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { workspace_id, title, slug, description, status, canvas_background_color, canvas_text_color } = body

    // Validate required fields
    if (!workspace_id || !title || !slug) {
      return NextResponse.json(
        { error: 'Workspace ID, title and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await getAssetBySlug(slug)
    if (existing) {
      return NextResponse.json(
        { error: 'An asset with this slug already exists' },
        { status: 400 }
      )
    }

    // Create asset
    const asset = await createAsset({
      id: nanoid(),
      workspace_id,
      title,
      slug,
      description: description || '',
      status: status || 'draft',
      canvas_background_color: canvas_background_color || '#6366f1',
      canvas_text_color: canvas_text_color || '#ffffff',
      created_by: user.userId,
    })

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error: any) {
    console.error('Asset creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create asset' },
      { status: 500 }
    )
  }
}
