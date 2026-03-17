import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_PATH = path.join(DATA_DIR, 'users.json')
const WORKSPACES_PATH = path.join(DATA_DIR, 'workspaces.json')
const ASSETS_DIR = path.join(DATA_DIR, 'assets')
const MODALS_DIR = path.join(DATA_DIR, 'modals')

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  created_at: number
  updated_at: number
}

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_by: string
  created_at: number
  updated_at: number
}

export interface Asset {
  id: string
  workspace_id: string
  title: string
  slug: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  canvas_background_color?: string
  canvas_text_color?: string
  canvas_background_image?: string
  view_count?: number
  created_by: string
  created_at: number
  updated_at: number
}

export interface Modal {
  id: string
  workspace_id: string
  title: string
  slug: string
  description?: string
  content: string // Rich text content or HTML
  status: 'draft' | 'published'
  trigger_type?: 'manual' | 'auto' | 'timed' | 'interaction'
  trigger_config?: string // JSON config for trigger settings
  style?: {
    width?: string
    max_width?: string
    background_color?: string
    text_color?: string
    border_radius?: string
    padding?: string
  }
  created_by: string
  created_at: number
  updated_at: number
}

export interface MenuLink {
  id: string
  icon?: string
  title: string
  url?: string
  experienceId?: string
  description?: string
  type: 'experience' | 'external'
}

export interface MenuConfig {
  enabled: boolean
  menuType: 'vertical-expanding' | 'burger' | 'fullscreen-split'
  position: 'top' | 'bottom' | 'left' | 'right'
  animation: 'slide-down' | 'slide-out' | 'fade' | 'scale'
  backgroundColor: string
  textColor: string
  accentColor: string
  rightPanelItems: MenuLink[]
}

export interface Page {
  id: string
  asset_id: string
  title: string
  slug: string
  order: number
  status: 'draft' | 'qa' | 'complete'
  transition_type?: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
  transition_duration?: number // in milliseconds
  canvas_background_color?: string
  canvas_background_image?: string
  background_type?: 'colour' | 'gradient' | 'image' | 'animated-image'
  background_gradient_type?: 'linear' | 'radial'
  background_gradient_colors?: string
  background_gradient_angle?: number
  background_image_url?: string
  background_image_size?: 'cover' | 'contain' | 'auto'
  background_image_position?: string
  background_animation_type?: 'ken-burns' | 'parallax' | 'pulse'
  background_animation_duration?: number
  mechanics: string // JSON string of mechanics array
  created_at: number
  updated_at: number
}

export interface Database {
  users: User[]
  workspaces: Workspace[]
  assets: Asset[]
  pages: Page[]
}

// Helper functions for file I/O
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    return defaultValue
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(ASSETS_DIR, { recursive: true })
  await fs.mkdir(MODALS_DIR, { recursive: true })
}

// Legacy compatibility - reads all data into single object
export async function readDatabase(): Promise<Database> {
  try {
    const [users, workspaces] = await Promise.all([
      readJsonFile<User[]>(USERS_PATH, []),
      readJsonFile<Workspace[]>(WORKSPACES_PATH, [])
    ])
    
    // Read all assets and their pages
    const assetDirs = await fs.readdir(ASSETS_DIR).catch(() => [])
    const assetsData = await Promise.all(
      assetDirs.map(async (assetId) => {
        const metaPath = path.join(ASSETS_DIR, assetId, 'meta.json')
        const pagesPath = path.join(ASSETS_DIR, assetId, 'pages.json')
        const asset = await readJsonFile<Asset>(metaPath, null as any)
        const pages = await readJsonFile<Page[]>(pagesPath, [])
        return { asset, pages }
      })
    )
    
    const assets = assetsData.filter(d => d.asset).map(d => d.asset)
    const pages = assetsData.flatMap(d => d.pages)
    
    return { users, workspaces, assets, pages }
  } catch (error) {
    return { users: [], workspaces: [], assets: [], pages: [] }
  }
}

// Legacy compatibility - writes everything back
export async function writeDatabase(data: Database): Promise<void> {
  await ensureDataDir()
  await writeJsonFile(USERS_PATH, data.users)
  await writeJsonFile(WORKSPACES_PATH, data.workspaces)
  
  // Write each asset and its pages
  for (const asset of data.assets) {
    const assetDir = path.join(ASSETS_DIR, asset.id)
    await fs.mkdir(assetDir, { recursive: true })
    await writeJsonFile(path.join(assetDir, 'meta.json'), asset)
    
    const assetPages = data.pages.filter(p => p.asset_id === asset.id)
    await writeJsonFile(path.join(assetDir, 'pages.json'), assetPages)
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await readDatabase()
  return db.users.find(u => u.email === email) || null
}

// Workspace functions
export async function getWorkspaces(): Promise<Workspace[]> {
  const db = await readDatabase()
  return db.workspaces
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const db = await readDatabase()
  return db.workspaces.find(w => w.id === id) || null
}

export async function getWorkspaceBySlug(slug: string): Promise<Workspace | null> {
  const db = await readDatabase()
  return db.workspaces.find(w => w.slug === slug) || null
}

export async function createWorkspace(workspace: Omit<Workspace, 'created_at' | 'updated_at'>): Promise<Workspace> {
  const db = await readDatabase()
  const now = Math.floor(Date.now() / 1000)
  const newWorkspace: Workspace = {
    ...workspace,
    created_at: now,
    updated_at: now
  }
  db.workspaces.push(newWorkspace)
  await writeDatabase(db)
  return newWorkspace
}

export async function updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
  const db = await readDatabase()
  const index = db.workspaces.findIndex(w => w.id === id)
  if (index === -1) return null
  
  db.workspaces[index] = {
    ...db.workspaces[index],
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await writeDatabase(db)
  return db.workspaces[index]
}

export async function deleteWorkspace(id: string): Promise<boolean> {
  const db = await readDatabase()
  const index = db.workspaces.findIndex(w => w.id === id)
  if (index === -1) return false
  
  db.workspaces.splice(index, 1)
  await writeDatabase(db)
  return true
}

export async function getAssets(): Promise<Asset[]> {
  const db = await readDatabase()
  return db.assets
}

export async function getAssetsByWorkspaceId(workspaceId: string): Promise<Asset[]> {
  const db = await readDatabase()
  return db.assets.filter(a => a.workspace_id === workspaceId)
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const db = await readDatabase()
  return db.assets.find(a => a.id === id) || null
}

export async function getAssetBySlug(slug: string): Promise<Asset | null> {
  const db = await readDatabase()
  return db.assets.find(a => a.slug === slug) || null
}

export async function createAsset(asset: Omit<Asset, 'created_at' | 'updated_at'>): Promise<Asset> {
  const db = await readDatabase()
  const now = Math.floor(Date.now() / 1000)
  const newAsset: Asset = {
    ...asset,
    created_at: now,
    updated_at: now
  }
  db.assets.push(newAsset)
  await writeDatabase(db)
  
  // Create asset directory and initialize empty pages and default menu
  const assetDir = path.join(ASSETS_DIR, newAsset.id)
  await fs.mkdir(assetDir, { recursive: true })
  await writeJsonFile(path.join(assetDir, 'meta.json'), newAsset)
  await writeJsonFile(path.join(assetDir, 'pages.json'), [])
  await writeJsonFile(path.join(assetDir, 'menu.json'), getDefaultMenuConfig())
  
  return newAsset
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset | null> {
  const db = await readDatabase()
  const index = db.assets.findIndex(a => a.id === id)
  if (index === -1) return null
  
  db.assets[index] = {
    ...db.assets[index],
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await writeDatabase(db)
  
  // Also update the meta.json file
  const metaPath = path.join(ASSETS_DIR, id, 'meta.json')
  await writeJsonFile(metaPath, db.assets[index])
  
  return db.assets[index]
}

export async function deleteAsset(id: string): Promise<boolean> {
  const db = await readDatabase()
  const index = db.assets.findIndex(a => a.id === id)
  if (index === -1) return false
  
  db.assets.splice(index, 1)
  // Also delete associated pages
  db.pages = db.pages.filter(p => p.asset_id !== id)
  await writeDatabase(db)
  
  // Delete asset directory
  const assetDir = path.join(ASSETS_DIR, id)
  try {
    await fs.rm(assetDir, { recursive: true, force: true })
  } catch (error) {
    // Ignore if directory doesn't exist
  }
  
  return true
}

export async function getPagesByAssetId(assetId: string): Promise<Page[]> {
  const db = await readDatabase()
  return db.pages
    .filter(p => p.asset_id === assetId)
    .sort((a, b) => a.order - b.order)
}

export async function getPageById(id: string): Promise<Page | null> {
  const db = await readDatabase()
  return db.pages.find(p => p.id === id) || null
}

export async function createPage(page: Omit<Page, 'created_at' | 'updated_at'>): Promise<Page> {
  const db = await readDatabase()
  const now = Math.floor(Date.now() / 1000)
  const newPage: Page = {
    ...page,
    created_at: now,
    updated_at: now
  }
  db.pages.push(newPage)
  await writeDatabase(db)
  return newPage
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
  const db = await readDatabase()
  const index = db.pages.findIndex(p => p.id === id)
  if (index === -1) return null
  
  db.pages[index] = {
    ...db.pages[index],
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await writeDatabase(db)
  return db.pages[index]
}

export async function deletePage(id: string): Promise<boolean> {
  const db = await readDatabase()
  const index = db.pages.findIndex(p => p.id === id)
  if (index === -1) return false
  
  db.pages.splice(index, 1)
  await writeDatabase(db)
  return true
}

// Optimized functions for direct file access (avoid loading entire DB)
export async function getAssetMeta(assetId: string): Promise<Asset | null> {
  const metaPath = path.join(ASSETS_DIR, assetId, 'meta.json')
  return await readJsonFile<Asset>(metaPath, null as any)
}

export async function updateAssetMeta(assetId: string, updates: Partial<Asset>): Promise<Asset | null> {
  const metaPath = path.join(ASSETS_DIR, assetId, 'meta.json')
  const asset = await readJsonFile<Asset>(metaPath, null as any)
  if (!asset) return null
  
  const updated = {
    ...asset,
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await writeJsonFile(metaPath, updated)
  return updated
}

export async function getAssetPages(assetId: string): Promise<Page[]> {
  const pagesPath = path.join(ASSETS_DIR, assetId, 'pages.json')
  const pages = await readJsonFile<Page[]>(pagesPath, [])
  return pages.sort((a, b) => a.order - b.order)
}

export async function updateAssetPages(assetId: string, pages: Page[]): Promise<void> {
  const pagesPath = path.join(ASSETS_DIR, assetId, 'pages.json')
  await writeJsonFile(pagesPath, pages)
}

export async function getAssetPage(assetId: string, pageId: string): Promise<Page | null> {
  const pages = await getAssetPages(assetId)
  return pages.find(p => p.id === pageId) || null
}

export async function updateAssetPage(assetId: string, pageId: string, updates: Partial<Page>): Promise<Page | null> {
  const pages = await getAssetPages(assetId)
  const index = pages.findIndex(p => p.id === pageId)
  if (index === -1) return null
  
  pages[index] = {
    ...pages[index],
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await updateAssetPages(assetId, pages)
  return pages[index]
}

export async function createAssetPage(assetId: string, page: Omit<Page, 'created_at' | 'updated_at'>): Promise<Page> {
  const pages = await getAssetPages(assetId)
  const now = Math.floor(Date.now() / 1000)
  const newPage: Page = {
    ...page,
    asset_id: assetId,
    created_at: now,
    updated_at: now
  }
  pages.push(newPage)
  await updateAssetPages(assetId, pages)
  return newPage
}

export async function deleteAssetPage(assetId: string, pageId: string): Promise<boolean> {
  const pages = await getAssetPages(assetId)
  const index = pages.findIndex(p => p.id === pageId)
  if (index === -1) return false
  
  pages.splice(index, 1)
  await updateAssetPages(assetId, pages)
  return true
}

// ============================================
// Modal functions - uses dedicated file system
// ============================================

export async function getModalsByWorkspaceId(workspaceId: string): Promise<Modal[]> {
  await ensureDataDir()
  
  try {
    const modalDirs = await fs.readdir(MODALS_DIR).catch(() => [])
    const modals: Modal[] = []
    
    for (const modalId of modalDirs) {
      const metaPath = path.join(MODALS_DIR, modalId, 'meta.json')
      const modal = await readJsonFile<Modal>(metaPath, null as any)
      if (modal && modal.workspace_id === workspaceId) {
        modals.push(modal)
      }
    }
    
    return modals.sort((a, b) => b.created_at - a.created_at)
  } catch (error) {
    return []
  }
}

export async function getModalById(id: string): Promise<Modal | null> {
  const metaPath = path.join(MODALS_DIR, id, 'meta.json')
  return await readJsonFile<Modal>(metaPath, null as any)
}

export async function getModalBySlug(slug: string, workspaceId: string): Promise<Modal | null> {
  const modals = await getModalsByWorkspaceId(workspaceId)
  return modals.find(m => m.slug === slug) || null
}

export async function createModal(modal: Omit<Modal, 'created_at' | 'updated_at'>): Promise<Modal> {
  await ensureDataDir()
  const now = Math.floor(Date.now() / 1000)
  const newModal: Modal = {
    ...modal,
    created_at: now,
    updated_at: now
  }
  
  const modalDir = path.join(MODALS_DIR, newModal.id)
  await fs.mkdir(modalDir, { recursive: true })
  await writeJsonFile(path.join(modalDir, 'meta.json'), newModal)
  
  return newModal
}

export async function updateModal(id: string, updates: Partial<Modal>): Promise<Modal | null> {
  const metaPath = path.join(MODALS_DIR, id, 'meta.json')
  const modal = await readJsonFile<Modal>(metaPath, null as any)
  if (!modal) return null
  
  const updated = {
    ...modal,
    ...updates,
    updated_at: Math.floor(Date.now() / 1000)
  }
  await writeJsonFile(metaPath, updated)
  return updated
}

export async function deleteModal(id: string): Promise<boolean> {
  const modalDir = path.join(MODALS_DIR, id)
  try {
    await fs.rm(modalDir, { recursive: true, force: true })
    return true
  } catch (error) {
    return false
  }
}

// ============================================
// Menu functions - asset-level menu configuration
// ============================================

export function getDefaultMenuConfig(): MenuConfig {
  return {
    enabled: true,
    menuType: 'vertical-expanding',
    position: 'left',
    animation: 'slide-out',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#3b82f6',
    rightPanelItems: []
  }
}

export async function getAssetMenu(assetId: string): Promise<MenuConfig> {
  const menuPath = path.join(ASSETS_DIR, assetId, 'menu.json')
  const menu = await readJsonFile<MenuConfig>(menuPath, null as any)
  return menu || getDefaultMenuConfig()
}

export async function updateAssetMenu(assetId: string, menuConfig: MenuConfig): Promise<MenuConfig> {
  const menuPath = path.join(ASSETS_DIR, assetId, 'menu.json')
  await writeJsonFile(menuPath, menuConfig)
  return menuConfig
}
