/**
 * Mechanics Index
 * Central export point for all mechanic components
 */

export { Title } from './Title'
export { TextBlock } from './Text'
export { Image } from './Image'
export { Shape } from './Shape'
export { Divider } from './Divider'
export { Spacer } from './Spacer'

// Export type for mechanic instances
export interface MechanicInstance {
  id: string
  type: string
  props: Record<string, any>
}
