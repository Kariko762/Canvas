import { NextRequest, NextResponse } from 'next/server';
import { createModal, getModalsByWorkspaceId } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      id,
      workspace_id,
      title,
      slug,
      description,
      content,
      status,
      created_by
    } = body;

    if (!id || !workspace_id || !title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const modal = await createModal({
      id,
      workspace_id,
      title,
      slug,
      description: description || '',
      content: content || '',
      status: status || 'draft',
      created_by
    });

    return NextResponse.json(modal);
  } catch (error: any) {
    console.error('Error creating modal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create modal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const status = searchParams.get('status'); // Optional filter for status

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    let modals = await getModalsByWorkspaceId(workspaceId);
    
    // Filter by status if provided
    if (status) {
      modals = modals.filter(modal => modal.status === status);
    }
    
    return NextResponse.json(modals);
  } catch (error: any) {
    console.error('Error getting modals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get modals' },
      { status: 500 }
    );
  }
}
