import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { getAssetById, updateAsset, deleteAsset } from '@/lib/data'

// GET /api/assets/[id] - Get single asset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await getAssetById(params.id)
    
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ asset })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch asset' },
      { status: 500 }
    )
  }
}

// PATCH /api/assets/[id] - Update asset
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
    
    // Update asset
    const asset = await updateAsset(params.id, body)
    
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ asset })
  } catch (error: any) {
    console.error('Asset update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update asset' },
      { status: 500 }
    )
  }
}

// DELETE /api/assets/[id] - Delete asset
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

    // Delete asset
    const success = await deleteAsset(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Asset deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete asset' },
      { status: 500 }
    )
  }
}
