import { NextRequest, NextResponse } from 'next/server';
import { getModalById, updateModal, deleteModal } from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modal = await getModalById(params.id);

    if (!modal) {
      return NextResponse.json(
        { error: 'Modal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(modal);
  } catch (error: any) {
    console.error('Error getting modal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get modal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updates: any = {};
    
    if (body.title !== undefined) updates.title = body.title;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.description !== undefined) updates.description = body.description;
    if (body.content !== undefined) updates.content = body.content;
    if (body.status !== undefined) updates.status = body.status;
    if (body.trigger_type !== undefined) updates.trigger_type = body.trigger_type;
    if (body.trigger_config !== undefined) updates.trigger_config = body.trigger_config;
    if (body.style !== undefined) updates.style = body.style;

    const modal = await updateModal(params.id, updates);

    if (!modal) {
      return NextResponse.json(
        { error: 'Modal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(modal);
  } catch (error: any) {
    console.error('Error updating modal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update modal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteModal(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Modal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting modal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete modal' },
      { status: 500 }
    );
  }
}
