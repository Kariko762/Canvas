/**
 * Mechanics Registry
 * Defines all available page building blocks and their configurations
 */

export type MechanicCategory = 'content' | 'layout' | 'media' | 'decoration' | 'interactive' | 'data'

export type PropertyType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'color' 
  | 'select' 
  | 'toggle' 
  | 'range'
  | 'image'

export interface PropertyDefinition {
  type: PropertyType
  label: string
  defaultValue: any
  options?: { label: string; value: any }[] // For select
  min?: number // For number/range
  max?: number // For number/range
  step?: number // For number/range
  placeholder?: string
  help?: string
}

export interface MechanicDefinition {
  type: string
  name: string
  description: string
  category: MechanicCategory
  icon: string // Lucide icon name
  properties: Record<string, PropertyDefinition>
}

/**
 * Core Mechanics Registry
 */
export const MECHANICS_REGISTRY: Record<string, MechanicDefinition> = {
  // ============================================================================
  // CONTENT MECHANICS
  // ============================================================================
  
  title: {
    type: 'title',
    name: 'Title',
    description: 'Large heading text for page titles',
    category: 'content',
    icon: 'Type',
    properties: {
      text: {
        type: 'text',
        label: 'Title Text',
        defaultValue: 'Your Title Here',
        placeholder: 'Enter title...'
      },
      size: {
        type: 'select',
        label: 'Size',
        defaultValue: 'xl',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2X Large', value: '2xl' },
          { label: '3X Large', value: '3xl' }
        ]
      },
      weight: {
        type: 'select',
        label: 'Weight',
        defaultValue: 'bold',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Medium', value: 'medium' },
          { label: 'Semibold', value: 'semibold' },
          { label: 'Bold', value: 'bold' }
        ]
      },
      align: {
        type: 'select',
        label: 'Alignment',
        defaultValue: 'center',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      },
      color: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff',
        help: 'Leave empty to use page default'
      }
    }
  },

  text: {
    type: 'text',
    name: 'Text Block',
    description: 'Paragraph or body text',
    category: 'content',
    icon: 'AlignLeft',
    properties: {
      content: {
        type: 'textarea',
        label: 'Text Content',
        defaultValue: 'Enter your text here...',
        placeholder: 'Type your content...'
      },
      size: {
        type: 'select',
        label: 'Size',
        defaultValue: 'base',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Base', value: 'base' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      },
      align: {
        type: 'select',
        label: 'Alignment',
        defaultValue: 'left',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
          { label: 'Justify', value: 'justify' }
        ]
      },
      color: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff',
        help: 'Leave empty to use page default'
      },
      maxWidth: {
        type: 'select',
        label: 'Max Width',
        defaultValue: 'full',
        options: [
          { label: 'Full', value: 'full' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2X Large', value: '2xl' },
          { label: '4X Large', value: '4xl' }
        ],
        help: 'Constrains text width for readability'
      }
    }
  },

  // ============================================================================
  // MEDIA MECHANICS
  // ============================================================================

  image: {
    type: 'image',
    name: 'Image',
    description: 'Display an image',
    category: 'media',
    icon: 'Image',
    properties: {
      src: {
        type: 'text',
        label: 'Image URL',
        defaultValue: 'https://placehold.co/800x600',
        placeholder: 'https://...'
      },
      alt: {
        type: 'text',
        label: 'Alt Text',
        defaultValue: '',
        placeholder: 'Describe the image...'
      },
      width: {
        type: 'select',
        label: 'Width',
        defaultValue: 'full',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Full', value: 'full' }
        ]
      },
      rounded: {
        type: 'select',
        label: 'Rounded Corners',
        defaultValue: 'md',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Full', value: 'full' }
        ]
      },
      shadow: {
        type: 'toggle',
        label: 'Drop Shadow',
        defaultValue: true
      }
    }
  },

  // ============================================================================
  // DECORATION MECHANICS
  // ============================================================================

  shape: {
    type: 'shape',
    name: 'Shape',
    description: 'Geometric shapes for decoration',
    category: 'decoration',
    icon: 'Square',
    properties: {
      shapeType: {
        type: 'select',
        label: 'Shape Type',
        defaultValue: 'rectangle',
        options: [
          { label: 'Rectangle', value: 'rectangle' },
          { label: 'Circle', value: 'circle' },
          { label: 'Triangle', value: 'triangle' }
        ]
      },
      width: {
        type: 'number',
        label: 'Width (px)',
        defaultValue: 200,
        min: 10,
        max: 1000,
        step: 10
      },
      height: {
        type: 'number',
        label: 'Height (px)',
        defaultValue: 200,
        min: 10,
        max: 1000,
        step: 10
      },
      backgroundColor: {
        type: 'color',
        label: 'Fill Color',
        defaultValue: '#6366f1'
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        defaultValue: '#ffffff'
      },
      borderWidth: {
        type: 'number',
        label: 'Border Width (px)',
        defaultValue: 0,
        min: 0,
        max: 20,
        step: 1
      },
      opacity: {
        type: 'range',
        label: 'Opacity',
        defaultValue: 100,
        min: 0,
        max: 100,
        step: 5
      }
    }
  },

  divider: {
    type: 'divider',
    name: 'Divider',
    description: 'Horizontal line to separate content',
    category: 'decoration',
    icon: 'Minus',
    properties: {
      width: {
        type: 'select',
        label: 'Width',
        defaultValue: 'full',
        options: [
          { label: 'Quarter', value: '1/4' },
          { label: 'Half', value: '1/2' },
          { label: 'Three Quarters', value: '3/4' },
          { label: 'Full', value: 'full' }
        ]
      },
      thickness: {
        type: 'number',
        label: 'Thickness (px)',
        defaultValue: 2,
        min: 1,
        max: 10,
        step: 1
      },
      color: {
        type: 'color',
        label: 'Color',
        defaultValue: '#ffffff'
      },
      style: {
        type: 'select',
        label: 'Style',
        defaultValue: 'solid',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' }
        ]
      }
    }
  },

  // ============================================================================
  // LAYOUT MECHANICS
  // ============================================================================

  spacer: {
    type: 'spacer',
    name: 'Spacer',
    description: 'Vertical spacing between elements',
    category: 'layout',
    icon: 'MoveVertical',
    properties: {
      height: {
        type: 'select',
        label: 'Height',
        defaultValue: 'md',
        options: [
          { label: 'Extra Small', value: 'xs' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2X Large', value: '2xl' }
        ]
      }
    }
  },

  // ============================================================================
  // INTERACTIVE MECHANICS
  // ============================================================================

  button: {
    type: 'button',
    name: 'Button',
    description: 'Interactive button element',
    category: 'interactive',
    icon: 'Square',
    properties: {
      text: {
        type: 'text',
        label: 'Button Text',
        defaultValue: 'Click Me',
        placeholder: 'Enter button text'
      },
      action: {
        type: 'select',
        label: 'Action',
        defaultValue: 'next',
        options: [
          { label: 'Next Page', value: 'next' },
          { label: 'Previous Page', value: 'prev' },
          { label: 'Go to Page', value: 'goto' },
          { label: 'External Link', value: 'link' }
        ]
      },
      actionValue: {
        type: 'text',
        label: 'Action Value',
        defaultValue: '',
        placeholder: 'Page slug or URL',
        help: 'For "Go to Page" enter page slug, for "External Link" enter URL'
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#6366f1'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      fontSize: {
        type: 'select',
        label: 'Size',
        defaultValue: 'md',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      },
      rounded: {
        type: 'select',
        label: 'Border Radius',
        defaultValue: 'md',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Full', value: 'full' }
        ]
      }
    }
  },

  flipcard: {
    type: 'flipcard',
    name: 'Flip Card',
    description: 'Card that flips to reveal back content',
    category: 'interactive',
    icon: 'FlipHorizontal',
    properties: {
      frontText: {
        type: 'textarea',
        label: 'Front Text',
        defaultValue: 'Click to flip',
        placeholder: 'Enter front side text'
      },
      backText: {
        type: 'textarea',
        label: 'Back Text',
        defaultValue: 'Back content',
        placeholder: 'Enter back side text'
      },
      frontColor: {
        type: 'color',
        label: 'Front Background',
        defaultValue: '#6366f1'
      },
      backColor: {
        type: 'color',
        label: 'Back Background',
        defaultValue: '#8b5cf6'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      rounded: {
        type: 'select',
        label: 'Border Radius',
        defaultValue: 'lg',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' }
        ]
      }
    }
  },

  // ============================================================================
  // DATA & VISUALIZATION MECHANICS
  // ============================================================================

  statscounter: {
    type: 'statscounter',
    name: 'Stats Counter',
    description: 'Animated counting number display',
    category: 'data',
    icon: 'Hash',
    properties: {
      startValue: {
        type: 'number',
        label: 'Start Value',
        defaultValue: 0,
        min: 0,
        max: 999999,
        step: 1
      },
      endValue: {
        type: 'number',
        label: 'End Value',
        defaultValue: 1000,
        min: 0,
        max: 999999,
        step: 1
      },
      duration: {
        type: 'number',
        label: 'Animation Duration (ms)',
        defaultValue: 2000,
        min: 500,
        max: 5000,
        step: 100
      },
      prefix: {
        type: 'text',
        label: 'Prefix',
        defaultValue: '',
        placeholder: '$, #, etc.'
      },
      suffix: {
        type: 'text',
        label: 'Suffix',
        defaultValue: '',
        placeholder: '+, %, K, M, etc.'
      },
      decimals: {
        type: 'number',
        label: 'Decimal Places',
        defaultValue: 0,
        min: 0,
        max: 4,
        step: 1
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        defaultValue: '48px',
        options: [
          { label: 'Small (24px)', value: '24px' },
          { label: 'Medium (36px)', value: '36px' },
          { label: 'Large (48px)', value: '48px' },
          { label: 'Extra Large (64px)', value: '64px' },
          { label: 'Huge (80px)', value: '80px' }
        ]
      },
      fontWeight: {
        type: 'select',
        label: 'Font Weight',
        defaultValue: 'bold',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Medium', value: '500' },
          { label: 'Semibold', value: '600' },
          { label: 'Bold', value: 'bold' },
          { label: 'Black', value: '900' }
        ]
      },
      color: {
        type: 'color',
        label: 'Number Color',
        defaultValue: '#3b82f6'
      },
      label: {
        type: 'text',
        label: 'Label',
        defaultValue: 'Total Users',
        placeholder: 'e.g., Total Revenue'
      },
      labelSize: {
        type: 'select',
        label: 'Label Size',
        defaultValue: '16px',
        options: [
          { label: 'Small (12px)', value: '12px' },
          { label: 'Medium (14px)', value: '14px' },
          { label: 'Large (16px)', value: '16px' },
          { label: 'Extra Large (18px)', value: '18px' }
        ]
      },
      alignment: {
        type: 'select',
        label: 'Alignment',
        defaultValue: 'center',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      }
    }
  },

  progressbar: {
    type: 'progressbar',
    name: 'Progress Bar',
    description: 'Animated progress indicator',
    category: 'data',
    icon: 'BarChart3',
    properties: {
      percentage: {
        type: 'number',
        label: 'Percentage',
        defaultValue: 75,
        min: 0,
        max: 100,
        step: 1
      },
      height: {
        type: 'number',
        label: 'Height (px)',
        defaultValue: 24,
        min: 8,
        max: 60,
        step: 2
      },
      orientation: {
        type: 'select',
        label: 'Orientation',
        defaultValue: 'horizontal',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' }
        ]
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#1f2937'
      },
      fillColor: {
        type: 'color',
        label: 'Fill Color',
        defaultValue: '#3b82f6'
      },
      showLabel: {
        type: 'toggle',
        label: 'Show Label',
        defaultValue: true
      },
      labelPosition: {
        type: 'select',
        label: 'Label Position',
        defaultValue: 'inside',
        options: [
          { label: 'Inside', value: 'inside' },
          { label: 'Outside', value: 'outside' }
        ]
      },
      animated: {
        type: 'toggle',
        label: 'Animated',
        defaultValue: true
      },
      animationDuration: {
        type: 'number',
        label: 'Animation Duration (ms)',
        defaultValue: 1500,
        min: 500,
        max: 5000,
        step: 100
      },
      borderRadius: {
        type: 'number',
        label: 'Border Radius (px)',
        defaultValue: 12,
        min: 0,
        max: 30,
        step: 1
      },
      label: {
        type: 'text',
        label: 'Custom Label',
        defaultValue: '',
        placeholder: 'Leave empty for percentage',
        help: 'Override percentage with custom text'
      }
    }
  },

  headline: {
    type: 'headline',
    name: 'Headline',
    description: 'Large hero text with gradient support',
    category: 'content',
    icon: 'Heading',
    properties: {
      text: {
        type: 'text',
        label: 'Headline Text',
        defaultValue: 'Your Headline Here',
        placeholder: 'Enter headline...'
      },
      size: {
        type: 'select',
        label: 'Size',
        defaultValue: 'xl',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2X Large', value: '2xl' },
          { label: '3X Large', value: '3xl' },
          { label: '4X Large', value: '4xl' }
        ]
      },
      weight: {
        type: 'select',
        label: 'Weight',
        defaultValue: 'bold',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Medium', value: 'medium' },
          { label: 'Semibold', value: 'semibold' },
          { label: 'Bold', value: 'bold' },
          { label: 'Black', value: 'black' }
        ]
      },
      align: {
        type: 'select',
        label: 'Alignment',
        defaultValue: 'center',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      },
      useGradient: {
        type: 'toggle',
        label: 'Use Gradient',
        defaultValue: false
      },
      color: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff',
        help: 'Used when gradient is disabled'
      },
      gradientFrom: {
        type: 'color',
        label: 'Gradient Start',
        defaultValue: '#3b82f6'
      },
      gradientTo: {
        type: 'color',
        label: 'Gradient End',
        defaultValue: '#8b5cf6'
      },
      gradientDirection: {
        type: 'select',
        label: 'Gradient Direction',
        defaultValue: 'to-r',
        options: [
          { label: 'To Right', value: 'to-r' },
          { label: 'To Bottom Right', value: 'to-br' },
          { label: 'To Bottom', value: 'to-b' },
          { label: 'To Bottom Left', value: 'to-bl' },
          { label: 'To Left', value: 'to-l' },
          { label: 'To Top Left', value: 'to-tl' },
          { label: 'To Top', value: 'to-t' },
          { label: 'To Top Right', value: 'to-tr' }
        ]
      },
      letterSpacing: {
        type: 'select',
        label: 'Letter Spacing',
        defaultValue: 'normal',
        options: [
          { label: 'Tight', value: 'tight' },
          { label: 'Normal', value: 'normal' },
          { label: 'Wide', value: 'wide' },
          { label: 'Wider', value: 'wider' }
        ]
      },
      lineHeight: {
        type: 'select',
        label: 'Line Height',
        defaultValue: 'tight',
        options: [
          { label: 'Tight', value: 'tight' },
          { label: 'Normal', value: 'normal' },
          { label: 'Relaxed', value: 'relaxed' }
        ]
      },
      textTransform: {
        type: 'select',
        label: 'Text Transform',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Uppercase', value: 'uppercase' },
          { label: 'Lowercase', value: 'lowercase' },
          { label: 'Capitalize', value: 'capitalize' }
        ]
      }
    }
  },

  scrollcontainer: {
    type: 'scrollcontainer',
    name: 'Scroll Container',
    description: 'Scrollable content region',
    category: 'layout',
    icon: 'ScrollText',
    properties: {
      content: {
        type: 'textarea',
        label: 'Content',
        defaultValue: 'Add your scrollable content here. This container allows you to create scrollable regions within your page without affecting the main page scroll. Perfect for long text sections, terms & conditions, or data tables.',
        placeholder: 'Enter content...'
      },
      scrollDirection: {
        type: 'select',
        label: 'Scroll Direction',
        defaultValue: 'vertical',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Both', value: 'both' }
        ]
      },
      maxHeight: {
        type: 'number',
        label: 'Max Height (px)',
        defaultValue: 300,
        min: 100,
        max: 800,
        step: 10
      },
      maxWidth: {
        type: 'number',
        label: 'Max Width (px)',
        defaultValue: 400,
        min: 200,
        max: 1000,
        step: 10
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#1f2937'
      },
      scrollbarStyle: {
        type: 'select',
        label: 'Scrollbar Style',
        defaultValue: 'minimal',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Glow', value: 'glow' }
        ]
      },
      scrollbarColor: {
        type: 'color',
        label: 'Scrollbar Color',
        defaultValue: '#3b82f6'
      },
      padding: {
        type: 'number',
        label: 'Padding (px)',
        defaultValue: 16,
        min: 0,
        max: 40,
        step: 4
      },
      borderRadius: {
        type: 'number',
        label: 'Border Radius (px)',
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 2
      }
    }
  },

  accordion: {
    type: 'accordion',
    name: 'Accordion',
    description: 'Expandable content sections',
    category: 'layout',
    icon: 'ChevronDown',
    properties: {
      allowMultiple: {
        type: 'toggle',
        label: 'Allow Multiple Open',
        defaultValue: false,
        help: 'Allow multiple sections to be open at once'
      },
      headerBackground: {
        type: 'color',
        label: 'Header Background',
        defaultValue: '#1f2937'
      },
      headerTextColor: {
        type: 'color',
        label: 'Header Text Color',
        defaultValue: '#ffffff'
      },
      contentBackground: {
        type: 'color',
        label: 'Content Background',
        defaultValue: '#111827'
      },
      contentTextColor: {
        type: 'color',
        label: 'Content Text Color',
        defaultValue: '#d1d5db'
      },
      iconStyle: {
        type: 'select',
        label: 'Icon Style',
        defaultValue: 'chevron',
        options: [
          { label: 'Chevron', value: 'chevron' },
          { label: 'Plus/Minus', value: 'plus-minus' }
        ]
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        defaultValue: '#374151'
      },
      transitionSpeed: {
        type: 'number',
        label: 'Transition Speed (ms)',
        defaultValue: 300,
        min: 100,
        max: 1000,
        step: 50
      }
    }
  },
  tabs: {
    type: 'tabs',
    name: 'Tabs',
    description: 'Horizontal tab navigation with content panels',
    category: 'layout',
    icon: 'Columns',
    properties: {
      tabStyle: {
        type: 'select',
        label: 'Tab Style',
        defaultValue: 'underline',
        options: [
          { label: 'Underline', value: 'underline' },
          { label: 'Pills', value: 'pills' },
          { label: 'Rounded', value: 'rounded' },
          { label: 'Minimal', value: 'minimal' }
        ]
      },
      tabPosition: {
        type: 'select',
        label: 'Tab Position',
        defaultValue: 'top',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' }
        ]
      },
      activeColor: {
        type: 'color',
        label: 'Active Color',
        defaultValue: '#3b82f6'
      },
      inactiveColor: {
        type: 'color',
        label: 'Inactive Color',
        defaultValue: '#64748b'
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#ffffff'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#1f2937'
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        defaultValue: '#e5e7eb'
      },
      tabSpacing: {
        type: 'number',
        label: 'Tab Spacing',
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 2
      },
      contentPadding: {
        type: 'number',
        label: 'Content Padding',
        defaultValue: 16,
        min: 0,
        max: 64,
        step: 4
      },
      animateTransition: {
        type: 'toggle',
        label: 'Animate Transitions',
        defaultValue: true
      }
    }
  },
  gridlayout: {
    type: 'gridlayout',
    name: 'Grid Layout',
    description: 'Auto-arranging item grid container',
    category: 'layout',
    icon: 'Grid',
    properties: {
      columns: {
        type: 'number',
        label: 'Columns',
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1
      },
      gap: {
        type: 'number',
        label: 'Gap',
        defaultValue: 16,
        min: 0,
        max: 64,
        step: 4
      },
      minItemWidth: {
        type: 'number',
        label: 'Min Item Width',
        defaultValue: 200,
        min: 100,
        max: 500,
        step: 10
      },
      itemPadding: {
        type: 'number',
        label: 'Item Padding',
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 4
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: 'transparent'
      },
      borderRadius: {
        type: 'number',
        label: 'Border Radius',
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 2
      },
      borderWidth: {
        type: 'number',
        label: 'Border Width',
        defaultValue: 1,
        min: 0,
        max: 8,
        step: 1
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        defaultValue: '#e5e7eb'
      },
      equalHeight: {
        type: 'toggle',
        label: 'Equal Height Items',
        defaultValue: false
      },
      responsive: {
        type: 'toggle',
        label: 'Responsive',
        defaultValue: true,
        help: 'Auto-fit items based on container width'
      }
    }
  },
  modal: {
    type: 'modal',
    name: 'Modal',
    description: 'Popup overlay window',
    category: 'interactive',
    icon: 'Square',
    properties: {
      triggerText: {
        type: 'text',
        label: 'Trigger Button Text',
        defaultValue: 'Open Modal'
      },
      triggerStyle: {
        type: 'select',
        label: 'Trigger Style',
        defaultValue: 'button',
        options: [
          { label: 'Button', value: 'button' },
          { label: 'Link', value: 'link' },
          { label: 'Custom', value: 'custom' }
        ]
      },
      triggerColor: {
        type: 'color',
        label: 'Trigger Color',
        defaultValue: '#3b82f6'
      },
      title: {
        type: 'text',
        label: 'Modal Title',
        defaultValue: 'Modal Title'
      },
      content: {
        type: 'textarea',
        label: 'Modal Content',
        defaultValue: 'This is the modal content. You can add any text or information here.'
      },
      modalWidth: {
        type: 'number',
        label: 'Modal Width',
        defaultValue: 600,
        min: 300,
        max: 1200,
        step: 50
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#ffffff'
      },
      overlayOpacity: {
        type: 'number',
        label: 'Overlay Opacity',
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      },
      borderRadius: {
        type: 'number',
        label: 'Border Radius',
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2
      },
      padding: {
        type: 'number',
        label: 'Padding',
        defaultValue: 24,
        min: 8,
        max: 64,
        step: 4
      },
      closeOnOverlayClick: {
        type: 'toggle',
        label: 'Close on Overlay Click',
        defaultValue: true
      },
      showCloseButton: {
        type: 'toggle',
        label: 'Show Close Button',
        defaultValue: true
      },
      animationStyle: {
        type: 'select',
        label: 'Animation Style',
        defaultValue: 'scale',
        options: [
          { label: 'Fade', value: 'fade' },
          { label: 'Scale', value: 'scale' },
          { label: 'Slide Up', value: 'slide-up' },
          { label: 'Slide Down', value: 'slide-down' }
        ]
      }
    }
  },
  splitscreen: {
    type: 'splitscreen',
    name: 'Split Screen',
    description: 'Two-column layout with divider',
    category: 'layout',
    icon: 'Columns',
    properties: {
      leftContent: {
        type: 'textarea',
        label: 'Left Content',
        defaultValue: 'Left panel content. Add your text, images, or other content here.'
      },
      rightContent: {
        type: 'textarea',
        label: 'Right Content',
        defaultValue: 'Right panel content. This is the second column of your split screen layout.'
      },
      leftWidth: {
        type: 'number',
        label: 'Left Width (%)',
        defaultValue: 50,
        min: 10,
        max: 90,
        step: 5
      },
      orientation: {
        type: 'select',
        label: 'Orientation',
        defaultValue: 'vertical',
        options: [
          { label: 'Vertical (Side by Side)', value: 'vertical' },
          { label: 'Horizontal (Top/Bottom)', value: 'horizontal' }
        ]
      },
      showDivider: {
        type: 'toggle',
        label: 'Show Divider',
        defaultValue: true
      },
      dividerWidth: {
        type: 'number',
        label: 'Divider Width',
        defaultValue: 2,
        min: 1,
        max: 8,
        step: 1
      },
      dividerColor: {
        type: 'color',
        label: 'Divider Color',
        defaultValue: '#e5e7eb'
      },
      resizable: {
        type: 'toggle',
        label: 'Resizable',
        defaultValue: false,
        help: 'Allow users to drag divider to resize panels'
      },
      leftBackground: {
        type: 'color',
        label: 'Left Background',
        defaultValue: '#f9fafb'
      },
      rightBackground: {
        type: 'color',
        label: 'Right Background',
        defaultValue: '#ffffff'
      },
      leftPadding: {
        type: 'number',
        label: 'Left Padding',
        defaultValue: 24,
        min: 0,
        max: 64,
        step: 4
      },
      rightPadding: {
        type: 'number',
        label: 'Right Padding',
        defaultValue: 24,
        min: 0,
        max: 64,
        step: 4
      }
    }
  },

  // ============================================================================
  // MEDIA MECHANICS (Phase 3)
  // ============================================================================

  videoplayer: {
    type: 'videoplayer',
    name: 'Video Player',
    description: 'Embedded video player with custom controls',
    category: 'media',
    icon: 'Video',
    properties: {
      videoUrl: {
        type: 'text',
        label: 'Video URL',
        defaultValue: '',
        placeholder: 'https://example.com/video.mp4'
      },
      poster: {
        type: 'text',
        label: 'Poster Image URL',
        defaultValue: '',
        placeholder: 'https://example.com/poster.jpg',
        help: 'Thumbnail shown before playback'
      },
      autoplay: {
        type: 'toggle',
        label: 'Autoplay',
        defaultValue: false
      },
      loop: {
        type: 'toggle',
        label: 'Loop',
        defaultValue: false
      },
      muted: {
        type: 'toggle',
        label: 'Muted',
        defaultValue: false
      },
      controls: {
        type: 'toggle',
        label: 'Show Controls',
        defaultValue: true
      }
    }
  },

  imagegallery: {
    type: 'imagegallery',
    name: 'Image Gallery',
    description: 'Grid or carousel image gallery with lightbox',
    category: 'media',
    icon: 'Images',
    properties: {
      images: {
        type: 'textarea',
        label: 'Images (JSON)',
        defaultValue: JSON.stringify([
          { url: 'https://picsum.photos/400/300?random=1', caption: 'Image 1' },
          { url: 'https://picsum.photos/400/300?random=2', caption: 'Image 2' },
          { url: 'https://picsum.photos/400/300?random=3', caption: 'Image 3' }
        ], null, 2),
        placeholder: '[{"url": "...", "caption": "..."}]',
        help: 'Array of image objects with url and caption'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        defaultValue: 'grid',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'Carousel', value: 'carousel' }
        ]
      },
      columns: {
        type: 'number',
        label: 'Columns (Grid)',
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1
      },
      gap: {
        type: 'number',
        label: 'Gap (px)',
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 4
      },
      aspectRatio: {
        type: 'text',
        label: 'Aspect Ratio',
        defaultValue: '1/1',
        placeholder: '16/9, 4/3, 1/1'
      },
      showCaptions: {
        type: 'toggle',
        label: 'Show Captions',
        defaultValue: true
      }
    }
  },

  imagecomparison: {
    type: 'imagecomparison',
    name: 'Image Comparison',
    description: 'Before/after image slider',
    category: 'media',
    icon: 'SplitSquareHorizontal',
    properties: {
      beforeImage: {
        type: 'text',
        label: 'Before Image URL',
        defaultValue: 'https://picsum.photos/800/600?random=1',
        placeholder: 'https://example.com/before.jpg'
      },
      afterImage: {
        type: 'text',
        label: 'After Image URL',
        defaultValue: 'https://picsum.photos/800/600?random=2',
        placeholder: 'https://example.com/after.jpg'
      },
      beforeLabel: {
        type: 'text',
        label: 'Before Label',
        defaultValue: 'Before'
      },
      afterLabel: {
        type: 'text',
        label: 'After Label',
        defaultValue: 'After'
      },
      initialPosition: {
        type: 'number',
        label: 'Initial Position (%)',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 5
      }
    }
  },

  iconlibrary: {
    type: 'iconlibrary',
    name: 'Icon',
    description: 'Lucide icon library',
    category: 'media',
    icon: 'Smile',
    properties: {
      iconName: {
        type: 'text',
        label: 'Icon Name',
        defaultValue: 'Star',
        placeholder: 'Star, Heart, CheckCircle...',
        help: 'Browse icons at lucide.dev'
      },
      size: {
        type: 'number',
        label: 'Size (px)',
        defaultValue: 48,
        min: 16,
        max: 256,
        step: 8
      },
      color: {
        type: 'color',
        label: 'Color',
        defaultValue: '#3b82f6'
      },
      strokeWidth: {
        type: 'number',
        label: 'Stroke Width',
        defaultValue: 2,
        min: 0.5,
        max: 4,
        step: 0.5
      }
    }
  },

  logogrid: {
    type: 'logogrid',
    name: 'Logo Grid',
    description: 'Client/partner logo showcase',
    category: 'media',
    icon: 'Grid3x3',
    properties: {
      logos: {
        type: 'textarea',
        label: 'Logos (JSON)',
        defaultValue: JSON.stringify([
          { url: 'https://via.placeholder.com/150x60?text=Logo+1', name: 'Company 1', link: '' },
          { url: 'https://via.placeholder.com/150x60?text=Logo+2', name: 'Company 2', link: '' },
          { url: 'https://via.placeholder.com/150x60?text=Logo+3', name: 'Company 3', link: '' },
          { url: 'https://via.placeholder.com/150x60?text=Logo+4', name: 'Company 4', link: '' }
        ], null, 2),
        placeholder: '[{"url": "...", "name": "...", "link": "..."}]'
      },
      columns: {
        type: 'number',
        label: 'Columns',
        defaultValue: 4,
        min: 2,
        max: 6,
        step: 1
      },
      gap: {
        type: 'number',
        label: 'Gap (px)',
        defaultValue: 24,
        min: 8,
        max: 64,
        step: 8
      },
      logoSize: {
        type: 'text',
        label: 'Logo Height',
        defaultValue: '120px',
        placeholder: '80px, 100px, 120px'
      },
      grayscale: {
        type: 'toggle',
        label: 'Grayscale',
        defaultValue: true,
        help: 'Show logos in grayscale by default'
      },
      hoverEffect: {
        type: 'toggle',
        label: 'Hover Effect',
        defaultValue: true,
        help: 'Scale and remove grayscale on hover'
      }
    }
  },

  avatarcard: {
    type: 'avatarcard',
    name: 'Avatar Card',
    description: 'Team member profile card',
    category: 'media',
    icon: 'UserCircle',
    properties: {
      imageUrl: {
        type: 'text',
        label: 'Image URL',
        defaultValue: '',
        placeholder: 'https://example.com/avatar.jpg'
      },
      name: {
        type: 'text',
        label: 'Name',
        defaultValue: 'Team Member'
      },
      title: {
        type: 'text',
        label: 'Job Title',
        defaultValue: 'Position'
      },
      bio: {
        type: 'textarea',
        label: 'Bio',
        defaultValue: '',
        placeholder: 'Short biography or description'
      },
      email: {
        type: 'text',
        label: 'Email',
        defaultValue: '',
        placeholder: 'email@example.com'
      },
      linkedin: {
        type: 'text',
        label: 'LinkedIn URL',
        defaultValue: '',
        placeholder: 'https://linkedin.com/in/username'
      },
      twitter: {
        type: 'text',
        label: 'Twitter URL',
        defaultValue: '',
        placeholder: 'https://twitter.com/username'
      },
      github: {
        type: 'text',
        label: 'GitHub URL',
        defaultValue: '',
        placeholder: 'https://github.com/username'
      },
      layout: {
        type: 'select',
        label: 'Layout',
        defaultValue: 'vertical',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' }
        ]
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#18181b'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      }
    }
  }
}

/**
 * Get mechanic definition by type
 */
export function getMechanic(type: string): MechanicDefinition | undefined {
  return MECHANICS_REGISTRY[type]
}

/**
 * Get all mechanics in a category
 */
export function getMechanicsByCategory(category: MechanicCategory): MechanicDefinition[] {
  return Object.values(MECHANICS_REGISTRY).filter(m => m.category === category)
}

/**
 * Get all mechanics
 */
export function getAllMechanics(): MechanicDefinition[] {
  return Object.values(MECHANICS_REGISTRY)
}

/**
 * Create a new mechanic instance with default values
 */
export function createMechanicInstance(type: string, id: string, x: number = 100, y: number = 100) {
  const definition = getMechanic(type)
  if (!definition) {
    throw new Error(`Unknown mechanic type: ${type}`)
  }

  const props: Record<string, any> = {}
  for (const [key, propDef] of Object.entries(definition.properties)) {
    props[key] = propDef.defaultValue
  }

  // Get the highest layer number + 1
  const nextLayer = 1

  return {
    id,
    type,
    name: `${definition.name} ${id.slice(0, 4)}`,
    x,
    y,
    layer: nextLayer,
    props
  }
}
