/**
 * Mechanics Registry
 * Defines all available page building blocks and their configurations
 */

export type MechanicCategory = 'content' | 'layout' | 'media' | 'decoration' | 'interactive'

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
