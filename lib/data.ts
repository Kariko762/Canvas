import fs from 'fs/promises'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data.json')

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

export interface Page {
  id: string
  asset_id: string
  title: string
  slug: string
  order: number
  status: 'draft' | 'published'
  transition_type?: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
  transition_duration?: number // in milliseconds
  canvas_background_color?: string
  canvas_background_image?: string
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

export async function readDatabase(): Promise<Database> {
  try {
    const content = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    // Return empty database if file doesn't exist
    return { users: [], workspaces: [], assets: [], pages: [] }
  }
}

export async function writeDatabase(data: Database): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
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
