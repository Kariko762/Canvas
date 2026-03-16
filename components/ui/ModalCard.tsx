'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Lock } from 'lucide-react';

interface Modal {
  id: string;
  workspace_id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published';
  trigger_type?: 'manual' | 'auto' | 'timed' | 'interaction';
  created_at: number;
  updated_at: number;
}

interface ModalCardProps {
  modal: Modal;
}

export function ModalCard({ modal }: ModalCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/admin/modals/${modal.id}?workspace=${modal.workspace_id}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
    >
      {/* Icon Header */}
      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 relative">
        <MessageSquare className="w-16 h-16 text-indigo-400" />
        {modal.status === 'draft' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Lock className="w-3 h-3" />
            Draft
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {modal.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {modal.description || 'No description'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">
            {modal.trigger_type || 'manual'}
          </span>
          <span title={`Updated ${formatDate(modal.updated_at)}`}>
            {formatDate(modal.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
