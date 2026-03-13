'use client';

import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface MechanicInstance {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  layer: number;
  props: Record<string, any>;
}

interface LayerPanelProps {
  mechanics: MechanicInstance[];
  selectedMechanicId: string | null;
  onSelectMechanic: (id: string) => void;
  onDeleteMechanic: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

export function LayerPanel({
  mechanics,
  selectedMechanicId,
  onSelectMechanic,
  onDeleteMechanic,
  onMoveLayer,
}: LayerPanelProps) {
  // Sort mechanics by layer (lowest first - 1 is front)
  const sortedMechanics = [...mechanics].sort((a, b) => a.layer - b.layer);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-semibold">Layers</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedMechanics.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-sm">
            No objects yet
          </div>
        ) : (
          <div className="p-2">
            {sortedMechanics.map((mechanic, index) => (
              <div
                key={mechanic.id}
                onClick={() => onSelectMechanic(mechanic.id)}
                className={`px-3 py-2 rounded cursor-pointer transition-colors mb-1 ${
                  selectedMechanicId === mechanic.id ? 'bg-blue-600' : 'hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{mechanic.name}</div>
                    <div className="text-xs text-zinc-400">
                      {mechanic.type}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(mechanic.id, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move forward (lower layer number)"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(mechanic.id, 'down');
                      }}
                      disabled={index === sortedMechanics.length - 1}
                      className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move backward (higher layer number)"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMechanic(mechanic.id);
                      }}
                      className="p-1 hover:bg-red-600/20 text-red-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
