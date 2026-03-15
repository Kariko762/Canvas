'use client';

import { useRouter } from 'next/navigation';
import { useGlobalLoading } from './GlobalLoadingContext';

interface Asset {
  id: string;
  title: string;
  description?: string;
  status: string;
  canvas_background_color?: string;
  view_count?: number;
}

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const router = useRouter();
  const { showLoading } = useGlobalLoading();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showLoading();
    router.push(`/admin/assets/${asset.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
    >
      {/* Thumbnail */}
      <div 
        className="aspect-video flex items-center justify-center text-white text-4xl font-bold"
        style={{ backgroundColor: asset.canvas_background_color || '#6366f1' }}
      >
        {asset.title.charAt(0).toUpperCase()}
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {asset.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {asset.description || 'No description'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">{asset.status}</span>
          <span>{asset.view_count || 0} views</span>
        </div>
      </div>
    </div>
  );
}
