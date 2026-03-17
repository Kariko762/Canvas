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
  | 'modalAsset'
  | 'boolean'
  | 'json'

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
  external?: boolean // For complex properties requiring external editors
  externalEditor?: string // Name of the external editor component
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

  list: {
    type: 'list',
    name: 'List',
    description: 'Bullet points or numbered lists',
    category: 'content',
    icon: 'List',
    properties: {
      items: {
        type: 'textarea',
        label: 'List Items',
        defaultValue: 'First item\nSecond item\nThird item',
        placeholder: 'Enter items, one per line',
        help: 'Each line becomes a list item'
      },
      listStyle: {
        type: 'select',
        label: 'List Style',
        defaultValue: 'bullet',
        options: [
          { label: 'Bullet', value: 'bullet' },
          { label: 'Numbered', value: 'numbered' },
          { label: 'Checkmark', value: 'checkmark' },
          { label: 'Arrow', value: 'arrow' }
        ]
      },
      size: {
        type: 'select',
        label: 'Text Size',
        defaultValue: 'base',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Base', value: 'base' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      },
      color: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      spacing: {
        type: 'select',
        label: 'Item Spacing',
        defaultValue: 'normal',
        options: [
          { label: 'Tight', value: 'tight' },
          { label: 'Normal', value: 'normal' },
          { label: 'Relaxed', value: 'relaxed' },
          { label: 'Loose', value: 'loose' }
        ]
      },
      iconColor: {
        type: 'color',
        label: 'Icon/Marker Color',
        defaultValue: '#8b5cf6',
        help: 'Color for bullet, checkmark, or arrow'
      }
    }
  },

  quote: {
    type: 'quote',
    name: 'Quote Block',
    description: 'Formatted quotation with optional attribution',
    category: 'content',
    icon: 'Quote',
    properties: {
      quote: {
        type: 'textarea',
        label: 'Quote Text',
        defaultValue: 'The best way to predict the future is to invent it.',
        placeholder: 'Enter quote text'
      },
      author: {
        type: 'text',
        label: 'Author',
        defaultValue: 'Alan Kay',
        placeholder: 'Author name'
      },
      role: {
        type: 'text',
        label: 'Role/Title',
        defaultValue: 'Computer Scientist',
        placeholder: 'Author role or title'
      },
      size: {
        type: 'select',
        label: 'Text Size',
        defaultValue: 'lg',
        options: [
          { label: 'Base', value: 'base' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2XL', value: '2xl' }
        ]
      },
      quoteColor: {
        type: 'color',
        label: 'Quote Color',
        defaultValue: '#ffffff'
      },
      authorColor: {
        type: 'color',
        label: 'Author Color',
        defaultValue: '#94a3b8'
      },
      accentColor: {
        type: 'color',
        label: 'Accent Color',
        defaultValue: '#8b5cf6',
        help: 'Quote mark color'
      },
      style: {
        type: 'select',
        label: 'Quote Style',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Bordered', value: 'bordered' },
          { label: 'Card', value: 'card' }
        ]
      }
    }
  },

  codeblock: {
    type: 'codeblock',
    name: 'Code Block',
    description: 'Syntax-highlighted code snippet',
    category: 'content',
    icon: 'Code',
    properties: {
      code: {
        type: 'textarea',
        label: 'Code',
        defaultValue: 'const greeting = "Hello, World!";\nconsole.log(greeting);',
        placeholder: 'Enter code snippet'
      },
      language: {
        type: 'select',
        label: 'Language',
        defaultValue: 'javascript',
        options: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'Python', value: 'python' },
          { label: 'Java', value: 'java' },
          { label: 'C#', value: 'csharp' },
          { label: 'Go', value: 'go' },
          { label: 'Rust', value: 'rust' },
          { label: 'HTML', value: 'html' },
          { label: 'CSS', value: 'css' },
          { label: 'JSON', value: 'json' },
          { label: 'Markdown', value: 'markdown' },
          { label: 'Shell', value: 'shell' },
          { label: 'SQL', value: 'sql' }
        ]
      },
      theme: {
        type: 'select',
        label: 'Theme',
        defaultValue: 'dark',
        options: [
          { label: 'Dark', value: 'dark' },
          { label: 'Light', value: 'light' }
        ]
      },
      showLineNumbers: {
        type: 'boolean',
        label: 'Show Line Numbers',
        defaultValue: true
      },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        defaultValue: 'sm',
        options: [
          { label: 'Extra Small', value: 'xs' },
          { label: 'Small', value: 'sm' },
          { label: 'Base', value: 'base' },
          { label: 'Large', value: 'lg' }
        ]
      },
      filename: {
        type: 'text',
        label: 'Filename (optional)',
        defaultValue: '',
        placeholder: 'index.js'
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

  container: {
    type: 'container',
    name: 'Container',
    description: 'Wrapper with padding and max-width',
    category: 'layout',
    icon: 'Box',
    properties: {
      maxWidth: {
        type: 'select',
        label: 'Max Width',
        defaultValue: 'xl',
        options: [
          { label: 'Small (640px)', value: 'sm' },
          { label: 'Medium (768px)', value: 'md' },
          { label: 'Large (1024px)', value: 'lg' },
          { label: 'Extra Large (1280px)', value: 'xl' },
          { label: '2XL (1536px)', value: '2xl' },
          { label: 'Full Width', value: 'full' }
        ]
      },
      padding: {
        type: 'select',
        label: 'Padding',
        defaultValue: 'medium',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
          { label: 'Extra Large', value: 'xlarge' }
        ]
      },
      centerContent: {
        type: 'boolean',
        label: 'Center Horizontally',
        defaultValue: true
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: 'transparent'
      },
      borderRadius: {
        type: 'select',
        label: 'Border Radius',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      }
    }
  },

  columns: {
    type: 'columns',
    name: 'Columns',
    description: 'Multi-column layout wrapper',
    category: 'layout',
    icon: 'Columns',
    properties: {
      columnCount: {
        type: 'select',
        label: 'Columns',
        defaultValue: '2',
        options: [
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' }
        ]
      },
      gap: {
        type: 'select',
        label: 'Gap',
        defaultValue: 'medium',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
          { label: 'Extra Large', value: 'xlarge' }
        ]
      },
      columnWidth: {
        type: 'select',
        label: 'Column Width',
        defaultValue: 'equal',
        options: [
          { label: 'Equal', value: 'equal' },
          { label: '30/70', value: '30-70' },
          { label: '40/60', value: '40-60' },
          { label: '60/40', value: '60-40' },
          { label: '70/30', value: '70-30' }
        ]
      },
      verticalAlign: {
        type: 'select',
        label: 'Vertical Align',
        defaultValue: 'start',
        options: [
          { label: 'Top', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'Bottom', value: 'end' },
          { label: 'Stretch', value: 'stretch' }
        ]
      },
      responsive: {
        type: 'boolean',
        label: 'Stack on Mobile',
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
          { label: 'External Link', value: 'link' },
          { label: 'Open Modal', value: 'modal' }
        ]
      },
      actionValue: {
        type: 'text',
        label: 'Action Value',
        defaultValue: '',
        placeholder: 'Page slug, URL, or Modal ID',
        help: 'For "Go to Page" enter page slug, for "External Link" enter URL, for "Open Modal" select from dropdown'
      },
      modalAsset: {
        type: 'modalAsset',
        label: 'Select Modal',
        defaultValue: '',
        help: 'Choose a modal from your modal assets'
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

  badge: {
    type: 'badge',
    name: 'Badge',
    description: 'Labels and tags for categorization',
    category: 'interactive',
    icon: 'Tag',
    properties: {
      text: {
        type: 'text',
        label: 'Badge Text',
        defaultValue: 'New',
        placeholder: 'Enter badge text'
      },
      variant: {
        type: 'select',
        label: 'Variant',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Primary', value: 'primary' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
          { label: 'Info', value: 'info' }
        ]
      },
      size: {
        type: 'select',
        label: 'Size',
        defaultValue: 'medium',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' }
        ]
      },
      outlined: {
        type: 'boolean',
        label: 'Outlined Style',
        defaultValue: false
      },
      customColor: {
        type: 'color',
        label: 'Custom Color (optional)',
        defaultValue: '',
        help: 'Override variant color'
      }
    }
  },

  tooltip: {
    type: 'tooltip',
    name: 'Tooltip',
    description: 'Hover info popup',
    category: 'interactive',
    icon: 'Info',
    properties: {
      text: {
        type: 'text',
        label: 'Trigger Text',
        defaultValue: 'Hover me',
        placeholder: 'Text to hover over'
      },
      tooltipContent: {
        type: 'textarea',
        label: 'Tooltip Content',
        defaultValue: 'Additional information appears here',
        placeholder: 'Enter tooltip content'
      },
      position: {
        type: 'select',
        label: 'Position',
        defaultValue: 'top',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' }
        ]
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#1f2937'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      }
    }
  },

  // ============================================================================
  // DATA & VISUALIZATION MECHANICS
  // ============================================================================

  table: {
    type: 'table',
    name: 'Table',
    description: 'Data table with rows and columns',
    category: 'data',
    icon: 'Table',
    properties: {
      headers: {
        type: 'json',
        label: 'Column Headers',
        defaultValue: JSON.stringify(['Name', 'Role', 'Email']),
        help: 'JSON array of column headers'
      },
      rows: {
        type: 'json',
        label: 'Table Rows',
        defaultValue: JSON.stringify([
          ['John Doe', 'Engineer', 'john@example.com'],
          ['Jane Smith', 'Designer', 'jane@example.com'],
          ['Bob Johnson', 'Manager', 'bob@example.com']
        ]),
        help: 'JSON array of row arrays',
        external: true,
        externalEditor: 'table'
      },
      striped: {
        type: 'boolean',
        label: 'Striped Rows',
        defaultValue: true
      },
      bordered: {
        type: 'boolean',
        label: 'Show Borders',
        defaultValue: true
      },
      compact: {
        type: 'boolean',
        label: 'Compact Mode',
        defaultValue: false
      },
      headerColor: {
        type: 'color',
        label: 'Header Background',
        defaultValue: '#1e293b'
      },
      headerTextColor: {
        type: 'color',
        label: 'Header Text Color',
        defaultValue: '#ffffff'
      },
      rowColor: {
        type: 'color',
        label: 'Row Background',
        defaultValue: '#0f172a'
      },
      rowTextColor: {
        type: 'color',
        label: 'Row Text Color',
        defaultValue: '#e2e8f0'
      },
      borderColor: {
        type: 'color',
        label: 'Border Color',
        defaultValue: '#334155'
      }
    }
  },

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
      },
      icon: {
        type: 'toggle',
        label: 'Show Icon',
        defaultValue: true
      }
    }
  },

  testimonial: {
    type: 'testimonial',
    name: 'Testimonial',
    description: 'Customer testimonial with rating',
    category: 'data',
    icon: 'MessageSquareQuote',
    properties: {
      testimonials: {
        type: 'json',
        label: 'Testimonials',
        defaultValue: JSON.stringify([
          {
            id: '1',
            quote: 'This product has transformed our business. Highly recommended!',
            author: 'Sarah Johnson',
            role: 'CEO, TechCorp',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=1'
          }
        ]),
        help: 'JSON array of testimonials',
        external: true,
        externalEditor: 'testimonial'
      },
      displayStyle: {
        type: 'select',
        label: 'Display Style',
        defaultValue: 'card',
        options: [
          { label: 'Card', value: 'card' },
          { label: 'Quote', value: 'quote' },
          { label: 'Compact', value: 'compact' }
        ]
      },
      showRating: {
        type: 'boolean',
        label: 'Show Rating',
        defaultValue: true
      },
      showImage: {
        type: 'boolean',
        label: 'Show Image',
        defaultValue: true
      },
      backgroundColor: {
        type: 'color',
        label: 'Card Background',
        defaultValue: '#1e293b'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      accentColor: {
        type: 'color',
        label: 'Accent Color',
        defaultValue: '#fbbf24'
      }
    }
  },

  featuregrid: {
    type: 'featuregrid',
    name: 'Feature Grid',
    description: 'Grid of features with icons',
    category: 'data',
    icon: 'Grid2x2',
    properties: {
      features: {
        type: 'json',
        label: 'Features',
        defaultValue: JSON.stringify([
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
        ]),
        help: 'JSON array of features',
        external: true,
        externalEditor: 'featuregrid'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        defaultValue: '3',
        options: [
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' }
        ]
      },
      gap: {
        type: 'select',
        label: 'Gap',
        defaultValue: 'medium',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' }
        ]
      },
      iconSize: {
        type: 'select',
        label: 'Icon Size',
        defaultValue: 'medium',
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' }
        ]
      },
      iconColor: {
        type: 'color',
        label: 'Icon Color',
        defaultValue: '#8b5cf6'
      },
      backgroundColor: {
        type: 'color',
        label: 'Card Background',
        defaultValue: '#1e293b'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      borderRadius: {
        type: 'select',
        label: 'Border Radius',
        defaultValue: 'lg',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      }
    }
  },

  pricingcard: {
    type: 'pricingcard',
    name: 'Pricing Card',
    description: 'Pricing plan card with features',
    category: 'data',
    icon: 'DollarSign',
    properties: {
      plans: {
        type: 'json',
        label: 'Pricing Plans',
        defaultValue: JSON.stringify([
          {
            id: '1',
            name: 'Starter',
            price: '$29',
            period: 'per month',
            features: ['10 Projects', '5GB Storage', 'Basic Support', 'Email Reports'],
            highlighted: false,
            buttonText: 'Get Started',
            buttonLink: '#'
          },
          {
            id: '2',
            name: 'Pro',
            price: '$79',
            period: 'per month',
            features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access'],
            highlighted: true,
            buttonText: 'Start Pro Trial',
            buttonLink: '#'
          },
          {
            id: '3',
            name: 'Enterprise',
            price: '$199',
            period: 'per month',
            features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integration', 'SLA Guarantee'],
            highlighted: false,
            buttonText: 'Contact Sales',
            buttonLink: '#'
          }
        ]),
        help: 'JSON array of pricing plans',
        external: true,
        externalEditor: 'pricingcard'
      },
      columns: {
        type: 'select',
        label: 'Columns',
        defaultValue: '3',
        options: [
          { label: '2 Columns', value: '2' },
          { label: '3 Columns', value: '3' },
          { label: '4 Columns', value: '4' }
        ]
      },
      cardBackground: {
        type: 'color',
        label: 'Card Background',
        defaultValue: '#1e293b'
      },
      highlightColor: {
        type: 'color',
        label: 'Highlight Color',
        defaultValue: '#8b5cf6'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      }
    }
  },

  carousel: {
    type: 'carousel',
    name: 'Carousel',
    description: 'Image/content slider',
    category: 'media',
    icon: 'Images',
    properties: {
      slides: {
        type: 'json',
        label: 'Slides',
        defaultValue: JSON.stringify([
          {
            id: '1',
            type: 'image',
            imageUrl: 'https://picsum.photos/800/400?random=1',
            caption: 'Slide 1'
          },
          {
            id: '2',
            type: 'image',
            imageUrl: 'https://picsum.photos/800/400?random=2',
            caption: 'Slide 2'
          },
          {
            id: '3',
            type: 'image',
            imageUrl: 'https://picsum.photos/800/400?random=3',
            caption: 'Slide 3'
          }
        ]),
        help: 'JSON array of slides',
        external: true,
        externalEditor: 'carousel'
      },
      autoplay: {
        type: 'boolean',
        label: 'Autoplay',
        defaultValue: true
      },
      interval: {
        type: 'number',
        label: 'Autoplay Interval (ms)',
        defaultValue: 5000,
        min: 1000,
        max: 10000,
        step: 500
      },
      showDots: {
        type: 'boolean',
        label: 'Show Dots',
        defaultValue: true
      },
      showArrows: {
        type: 'boolean',
        label: 'Show Arrows',
        defaultValue: true
      },
      height: {
        type: 'select',
        label: 'Height',
        defaultValue: 'medium',
        options: [
          { label: 'Small (300px)', value: 'small' },
          { label: 'Medium (400px)', value: 'medium' },
          { label: 'Large (500px)', value: 'large' },
          { label: 'Extra Large (600px)', value: 'xlarge' }
        ]
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
      tabBarBackgroundColor: {
        type: 'color',
        label: 'Tab Bar Background Color',
        defaultValue: '#f3f4f6'
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
      modalAsset: {
        type: 'modalAsset',
        label: 'Modal Asset',
        defaultValue: '',
        help: 'Select a modal from your modal assets, or leave empty to use custom content below'
      },
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

  ctacard: {
    type: 'ctacard',
    name: 'CTA Card',
    description: 'Call-to-action card with headline, text, and button',
    category: 'interactive',
    icon: 'SquareArrowOutUpRight',
    properties: {
      headline: {
        type: 'text',
        label: 'Headline',
        defaultValue: 'Ready to Get Started?',
        placeholder: 'Enter headline'
      },
      description: {
        type: 'textarea',
        label: 'Description',
        defaultValue: 'Join thousands of customers who trust us to deliver exceptional results.',
        placeholder: 'Enter description'
      },
      buttonText: {
        type: 'text',
        label: 'Button Text',
        defaultValue: 'Get Started',
        placeholder: 'Button label'
      },
      buttonLink: {
        type: 'text',
        label: 'Button Link',
        defaultValue: '#',
        placeholder: 'URL or page slug'
      },
      alignment: {
        type: 'select',
        label: 'Text Alignment',
        defaultValue: 'center',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' }
        ]
      },
      backgroundColor: {
        type: 'color',
        label: 'Background Color',
        defaultValue: '#1e293b'
      },
      textColor: {
        type: 'color',
        label: 'Text Color',
        defaultValue: '#ffffff'
      },
      buttonColor: {
        type: 'color',
        label: 'Button Color',
        defaultValue: '#8b5cf6'
      },
      buttonTextColor: {
        type: 'color',
        label: 'Button Text Color',
        defaultValue: '#ffffff'
      },
      borderRadius: {
        type: 'select',
        label: 'Border Radius',
        defaultValue: 'lg',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' }
        ]
      }
    }
  },

  alert: {
    type: 'alert',
    name: 'Alert',
    description: 'Info, warning, error, or success notifications',
    category: 'interactive',
    icon: 'AlertCircle',
    properties: {
      message: {
        type: 'textarea',
        label: 'Message',
        defaultValue: 'This is an important notification.',
        placeholder: 'Enter alert message'
      },
      type: {
        type: 'select',
        label: 'Alert Type',
        defaultValue: 'info',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' }
        ]
      },
      dismissible: {
        type: 'boolean',
        label: 'Dismissible',
        defaultValue: true
      },
      bordered: {
        type: 'boolean',
        label: 'Show Border',
        defaultValue: true
      },
      icon: {
        type: 'boolean',
        label: 'Show Icon',
        defaultValue: true
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

  // Set default tabs for tabs component
  if (type === 'tabs' && !props.tabs) {
    props.tabs = [
      { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
      { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
      { id: '3', label: 'Tab 3', content: 'Content for tab 3' }
    ]
  }

  // Set default sections for accordion component
  if (type === 'accordion' && !props.items) {
    props.items = [
      { id: '1', title: 'Section 1', content: 'Content for section 1' },
      { id: '2', title: 'Section 2', content: 'Content for section 2' },
      { id: '3', title: 'Section 3', content: 'Content for section 3' }
    ]
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
