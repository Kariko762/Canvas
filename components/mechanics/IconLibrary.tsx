'use client'

import * as Icons from 'lucide-react'

interface IconLibraryProps {
  iconName: string
  size?: number
  color?: string
  strokeWidth?: number
}

export function IconLibrary({ 
  iconName = 'Star',
  size = 48,
  color = '#3b82f6',
  strokeWidth = 2
}: IconLibraryProps) {
  // Get the icon component from lucide-react
  const IconComponent = (Icons as any)[iconName]

  if (!IconComponent) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 rounded-lg gap-2">
        <Icons.HelpCircle className="w-12 h-12" />
        <p className="text-sm">Icon "{iconName}" not found</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className="drop-shadow-lg"
      />
    </div>
  )
}

// Export popular icon names for the editor
export const popularIcons = [
  'Star', 'Heart', 'CheckCircle', 'XCircle', 'AlertCircle', 'Info',
  'Home', 'User', 'Users', 'Mail', 'Phone', 'MessageCircle',
  'Settings', 'Search', 'Menu', 'X', 'ChevronRight', 'ChevronLeft',
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'Download', 'Upload', 'Share2', 'Link', 'ExternalLink',
  'Calendar', 'Clock', 'MapPin', 'Globe', 'Wifi',
  'Zap', 'Award', 'Target', 'TrendingUp', 'TrendingDown',
  'ShoppingCart', 'CreditCard', 'DollarSign', 'Package',
  'Image', 'Video', 'Music', 'File', 'FileText',
  'Edit', 'Trash2', 'Copy', 'Save', 'Folder',
  'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow',
  'Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Cpu',
  'Coffee', 'Briefcase', 'BookOpen', 'Lightbulb', 'Rocket'
]
