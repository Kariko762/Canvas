import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features?: Feature[] | string;
  columns?: '2' | '3' | '4';
  gap?: 'small' | 'medium' | 'large';
  iconSize?: 'small' | 'medium' | 'large';
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'view' | 'edit';
}

export default function FeatureGrid({
  features = [
    {
      id: '1',
      icon: 'Zap',
      title: 'Fast Performance',
      description: 'Lightning-fast load times and smooth interactions.'
    },
    {
      id: '2',
      icon: 'Shield',
      title: 'Secure',
      description: 'Enterprise-grade security to protect your data.'
    },
    {
      id: '3',
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team.'
    }
  ],
  columns = '3',
  gap = 'medium',
  iconSize = 'medium',
  iconColor = '#8b5cf6',
  backgroundColor = '#1e293b',
  textColor = '#ffffff',
  borderRadius = 'lg',
  mode = 'view'
}: FeatureGridProps) {
  // Parse JSON if needed
  const parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;

  const gapClasses = {
    small: 'gap-4',
    medium: 'gap-6',
    large: 'gap-8'
  };

  const iconSizes = {
    small: 32,
    medium: 40,
    large: 48
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} ${gapClasses[gap]}`}>
      {parsedFeatures.map((feature: Feature) => {
        const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Box;

        return (
          <div
            key={feature.id}
            className={`p-6 ${radiusClasses[borderRadius]} border border-white/10 transition-transform hover:scale-105`}
            style={{ backgroundColor, color: textColor }}
          >
            <div className="mb-4">
              <IconComponent
                size={iconSizes[iconSize]}
                style={{ color: iconColor }}
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="opacity-80 leading-relaxed">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
