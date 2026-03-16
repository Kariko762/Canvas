'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (publishAll: boolean) => void;
}

export function PublishModal({ isOpen, onClose, onPublish }: PublishModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handlePublishComplete = () => {
    onPublish(false);
  };

  const handlePublishAll = () => {
    setShowConfirmation(true);
  };

  const handleConfirmPublishAll = () => {
    onPublish(true);
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!showConfirmation ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">
              Publish Asset
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Choose how you want to publish this asset
            </p>

            <div className="space-y-3">
              <button
                onClick={handlePublishComplete}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left"
              >
                <div className="font-medium">Publish Complete Pages</div>
                <div className="text-sm text-blue-100 mt-1">
                  Only pages marked as "Complete" will be visible in Live View
                </div>
              </button>

              <button
                onClick={handlePublishAll}
                className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left"
              >
                <div className="font-medium">Publish All Pages</div>
                <div className="text-sm text-zinc-400 mt-1">
                  All pages will be marked "Complete" and published
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">
              Confirm Publish All
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>Warning:</strong> All Pages will be marked "Complete" and be published to Live View.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelConfirmation}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmPublishAll}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Yes, Publish All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
