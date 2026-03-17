import { NextRequest, NextResponse } from 'next/server';
import { getAssetMenu, updateAssetMenu } from '@/lib/data';

// GET /api/assets/[id]/menu - Get menu config for an asset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assetId = params.id;
    const menuConfig = await getAssetMenu(assetId);
    
    return NextResponse.json({ menuConfig });
  } catch (error: any) {
    console.error('Error fetching menu config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu configuration' },
      { status: 500 }
    );
  }
}

// PATCH /api/assets/[id]/menu - Update menu config
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assetId = params.id;
    const body = await request.json();
    
    const updatedMenu = await updateAssetMenu(assetId, body);
    
    return NextResponse.json({ menuConfig: updatedMenu });
  } catch (error: any) {
    console.error('Error updating menu config:', error);
    return NextResponse.json(
      { error: 'Failed to update menu configuration' },
      { status: 500 }
    );
  }
}
