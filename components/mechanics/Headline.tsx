'use client';

interface HeadlineProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  align?: 'left' | 'center' | 'right';
  color?: string;
  useGradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  mode?: 'edit' | 'view';
}

const sizeMap = {
  sm: '1.5rem',    // 24px
  md: '2rem',      // 32px
  lg: '2.5rem',    // 40px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
  '3xl': '5rem',   // 80px
  '4xl': '6rem',   // 96px
};

const weightMap = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
};

const letterSpacingMap = {
  tight: '-0.05em',
  normal: '0em',
  wide: '0.05em',
  wider: '0.1em',
};

const lineHeightMap = {
  tight: '1.1',
  normal: '1.3',
  relaxed: '1.5',
};

export function Headline({
  text = 'Your Headline Here',
  size = 'xl',
  weight = 'bold',
  align = 'center',
  color = '#ffffff',
  useGradient = false,
  gradientFrom = '#3b82f6',
  gradientTo = '#8b5cf6',
  gradientDirection = 'to-r',
  letterSpacing = 'normal',
  lineHeight = 'tight',
  textTransform = 'none',
  mode = 'view',
}: HeadlineProps) {
  const gradientDirectionMap: Record<string, string> = {
    'to-r': 'to right',
    'to-br': 'to bottom right',
    'to-b': 'to bottom',
    'to-bl': 'to bottom left',
    'to-l': 'to left',
    'to-tl': 'to top left',
    'to-t': 'to top',
    'to-tr': 'to top right',
  };

  const style: React.CSSProperties = {
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    textAlign: align,
    letterSpacing: letterSpacingMap[letterSpacing],
    lineHeight: lineHeightMap[lineHeight],
    textTransform,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
  };

  if (useGradient) {
    style.background = `linear-gradient(${gradientDirectionMap[gradientDirection]}, ${gradientFrom}, ${gradientTo})`;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
    style.backgroundClip = 'text';
  } else {
    style.color = color;
  }

  return (
    <h1 style={style}>
      {text}
    </h1>
  );
}
