import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { getPageById, updatePage, deletePage } from '@/lib/data'

// GET /api/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await getPageById(params.id)
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PATCH /api/pages/[id] - Update page
export async function PATCH(
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
    
    // Update page
    const page = await updatePage(params.id, body)
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error: any) {
    console.error('Page update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
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

    // Delete page
    const success = await deletePage(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Page deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete page' },
      { status: 500 }
    )
  }
}
