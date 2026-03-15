'use client';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const CORPORATE_COLORS = {
  primary: [
    { name: 'Eggplant', hex: '#431C5B' },
    { name: 'Navy', hex: '#1D1F48' },
  ],
  secondary: [
    { name: 'Raspberry', hex: '#B21A53' },
    { name: 'Charcoal', hex: '#3D3D40' },
    { name: 'Gray', hex: '#E6E7E8' },
  ],
  tertiary: [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
  ],
  accent: [
    { name: 'Core Green', hex: '#4bcd3e' },
  ],
};

export function ColorPicker({ value, onChange, label, className = '' }: ColorPickerProps) {
  const allColors = [
    ...CORPORATE_COLORS.primary,
    ...CORPORATE_COLORS.secondary,
    ...CORPORATE_COLORS.tertiary,
    ...CORPORATE_COLORS.accent,
  ];

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white font-mono text-sm"
            placeholder="#000000"
          />
        </div>
        
        {/* Corporate Color Palette */}
        <div className="flex flex-wrap gap-1.5">
          {allColors.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={() => onChange(color.hex)}
              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                value.toLowerCase() === color.hex.toLowerCase()
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-zinc-600 hover:border-zinc-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
