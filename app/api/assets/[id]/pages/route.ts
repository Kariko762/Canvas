import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'
import { verifySessionToken } from '@/lib/auth'
import { getPagesByAssetId, createPage } from '@/lib/data'

// GET /api/assets/[id]/pages - Get all pages for an asset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pages = await getPagesByAssetId(params.id)
    return NextResponse.json({ pages })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST /api/assets/[id]/pages - Create new page
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { 
      title, 
      slug, 
      order, 
      status = 'draft',
      transition_type = 'fade',
      transition_duration = 300
    } = body

    // Create page
    const page = await createPage({
      id: nanoid(),
      asset_id: params.id,
      title: title || 'New Page',
      slug: slug || 'new-page',
      order: order ?? 0,
      status,
      transition_type,
      transition_duration,
      mechanics: '[]',
    })

    return NextResponse.json({ page }, { status: 201 })
  } catch (error: any) {
    console.error('Page creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create page' },
      { status: 500 }
    )
  }
}
