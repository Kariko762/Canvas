import React, { useState } from 'react';
import { X, Plus, Trash2, MoveUp, MoveDown, Star } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  buttonText: string;
  buttonLink: string;
}

interface PricingCardEditorProps {
  plans: PricingPlan[];
  onSave: (plans: PricingPlan[]) => void;
  onClose: () => void;
}

export default function PricingCardEditor({ plans, onSave, onClose }: PricingCardEditorProps) {
  const [localPlans, setLocalPlans] = useState<PricingPlan[]>(plans);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  const addPlan = () => {
    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      name: 'New Plan',
      price: '$0',
      period: 'per month',
      features: ['Feature 1'],
      highlighted: false,
      buttonText: 'Get Started',
      buttonLink: '#'
    };
    setLocalPlans([...localPlans, newPlan]);
    setSelectedPlanIndex(localPlans.length);
  };

  const removePlan = (index: number) => {
    const updated = localPlans.filter((_, i) => i !== index);
    setLocalPlans(updated);
    if (selectedPlanIndex >= updated.length) {
      setSelectedPlanIndex(Math.max(0, updated.length - 1));
    }
  };

  const movePlan = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === localPlans.length - 1)) return;
    const updated = [...localPlans];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setLocalPlans(updated);
    setSelectedPlanIndex(newIndex);
  };

  const updatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...localPlans];
    updated[index] = { ...updated[index], [field]: value };
    setLocalPlans(updated);
  };

  const addFeature = (planIndex: number) => {
    const updated = [...localPlans];
    updated[planIndex] = {
      ...updated[planIndex],
      features: [...updated[planIndex].features, 'New Feature']
    };
    setLocalPlans(updated);
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updated = [...localPlans];
    updated[planIndex] = {
      ...updated[planIndex],
      features: updated[planIndex].features.map((f, i) => (i === featureIndex ? value : f))
    };
    setLocalPlans(updated);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updated = [...localPlans];
    updated[planIndex] = {
      ...updated[planIndex],
      features: updated[planIndex].features.filter((_, i) => i !== featureIndex)
    };
    setLocalPlans(updated);
  };

  const handleSave = () => {
    onSave(localPlans);
    onClose();
  };

  const selectedPlan = localPlans[selectedPlanIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Left Sidebar - Plan List */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pricing Plans</h2>
          <button
            onClick={addPlan}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
            title="Add Plan"
          >
            <Plus size={20} className="text-zinc-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {localPlans.map((plan, index) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanIndex(index)}
              className={`p-3 border-b border-zinc-800 cursor-pointer transition-colors ${
                selectedPlanIndex === index ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{plan.name}</span>
                    {plan.highlighted && <Star size={14} fill="#fbbf24" className="text-yellow-400" />}
                  </div>
                  <span className="text-sm text-zinc-400">{plan.price}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); movePlan(index, 'up'); }}
                    disabled={index === 0}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <MoveUp size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); movePlan(index, 'down'); }}
                    disabled={index === localPlans.length - 1}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <MoveDown size={14} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePlan(index); }}
                    className="p-1 hover:bg-red-900/50 rounded"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Preview */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
            >
              Save
            </button>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded transition-colors">
              <X size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(localPlans.length, 3)} gap-8`}>
              {localPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-8 border-2 ${
                    index === selectedPlanIndex ? 'ring-2 ring-blue-500' : ''
                  } ${plan.highlighted ? 'ring-4 ring-purple-500' : ''}`}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: plan.highlighted ? '#8b5cf6' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  {plan.highlighted && (
                    <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4 bg-purple-500">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-70 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-400">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-3 rounded-lg font-semibold"
                    style={{
                      backgroundColor: plan.highlighted ? '#8b5cf6' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedPlan && (
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Plan Name</label>
              <input
                type="text"
                value={selectedPlan.name}
                onChange={(e) => updatePlan(selectedPlanIndex, 'name', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Price</label>
                <input
                  type="text"
                  value={selectedPlan.price}
                  onChange={(e) => updatePlan(selectedPlanIndex, 'price', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                  placeholder="$29"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">Period</label>
                <input
                  type="text"
                  value={selectedPlan.period}
                  onChange={(e) => updatePlan(selectedPlanIndex, 'period', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                  placeholder="per month"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-zinc-300">
                <input
                  type="checkbox"
                  checked={selectedPlan.highlighted}
                  onChange={(e) => updatePlan(selectedPlanIndex, 'highlighted', e.target.checked)}
                  className="rounded"
                />
                Highlight as Popular
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Features</label>
              <div className="space-y-2">
                {selectedPlan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(selectedPlanIndex, fidx, e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm"
                    />
                    <button
                      onClick={() => removeFeature(selectedPlanIndex, fidx)}
                      className="p-2 hover:bg-red-900/50 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addFeature(selectedPlanIndex)}
                  className="w-full py-2 border border-dashed border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Button Text</label>
              <input
                type="text"
                value={selectedPlan.buttonText}
                onChange={(e) => updatePlan(selectedPlanIndex, 'buttonText', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">Button Link</label>
              <input
                type="text"
                value={selectedPlan.buttonLink}
                onChange={(e) => updatePlan(selectedPlanIndex, 'buttonLink', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                placeholder="#"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
