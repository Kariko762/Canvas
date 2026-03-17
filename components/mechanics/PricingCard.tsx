import React from 'react';
import { Check } from 'lucide-react';

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

interface PricingCardProps {
  plans?: PricingPlan[] | string;
  columns?: '2' | '3' | '4';
  cardBackground?: string;
  highlightColor?: string;
  textColor?: string;
  mode?: 'view' | 'edit';
}

export default function PricingCard({
  plans = [
    {
      id: '1',
      name: 'Starter',
      price: '$29',
      period: 'per month',
      features: ['10 Projects', '5GB Storage', 'Basic Support'],
      highlighted: false,
      buttonText: 'Get Started',
      buttonLink: '#'
    }
  ],
  columns = '3',
  cardBackground = '#1e293b',
  highlightColor = '#8b5cf6',
  textColor = '#ffffff',
  mode = 'view'
}: PricingCardProps) {
  // Parse JSON if needed
  const parsedPlans = typeof plans === 'string' ? JSON.parse(plans) : plans;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}>
      {parsedPlans.map((plan: PricingPlan) => (
        <div
          key={plan.id}
          className={`rounded-xl p-8 border-2 transition-transform hover:scale-105`}
          style={{
            backgroundColor: cardBackground,
            color: textColor,
            borderColor: plan.highlighted ? highlightColor : 'rgba(255,255,255,0.1)',
            boxShadow: plan.highlighted ? `0 0 0 4px ${highlightColor}40` : undefined
          }}
        >
          {plan.highlighted && (
            <div
              className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4"
              style={{ backgroundColor: highlightColor }}
            >
              POPULAR
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <div className="mb-6">
            <span className="text-5xl font-bold">{plan.price}</span>
            <span className="text-sm opacity-70 ml-2">{plan.period}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check size={20} className="flex-shrink-0 mt-0.5" style={{ color: highlightColor }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              if (mode === 'view' && plan.buttonLink !== '#') {
                window.location.href = plan.buttonLink;
              }
            }}
            className="w-full py-3 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: plan.highlighted ? highlightColor : 'rgba(255,255,255,0.1)',
              color: plan.highlighted ? '#ffffff' : textColor
            }}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
