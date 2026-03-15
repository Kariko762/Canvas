import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { getWorkspaces, getAssetsByWorkspaceId } from '@/lib/data'
import { Plus, LogOut, Grid3x3, Layers, Folder } from 'lucide-react'
import Link from 'next/link'
import { AssetCard } from '@/components/ui/AssetCard'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { workspace?: string }
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  if (!session) {
    redirect('/admin/login')
  }

  const user = verifySessionToken(session.value)
  if (!user) {
    redirect('/admin/login')
  }

  const workspaces = await getWorkspaces()
  const selectedWorkspaceId = searchParams.workspace || workspaces[0]?.id || ''
  const assets = selectedWorkspaceId ? await getAssetsByWorkspaceId(selectedWorkspaceId) : []
  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Layers className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">FIS Presents</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.userId}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Layout - Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Workspaces</h2>
              <Link
                href="/admin/workspaces/new"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="New Workspace"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {workspaces.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No workspaces yet
              </div>
            ) : (
              <div className="space-y-1">
                {workspaces.map((workspace) => (
                  <Link
                    key={workspace.id}
                    href={`/admin?workspace=${workspace.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                      workspace.id === selectedWorkspaceId
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: workspace.color || '#6366f1' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {workspace.name}
                      </div>
                      {workspace.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {workspace.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Grid3x3 className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedWorkspace?.name || 'Assets'}
                </h2>
                <span className="text-sm text-gray-500">({assets.length})</span>
              </div>
              
              {selectedWorkspaceId && (
                <Link
                  href={`/admin/assets/new?workspace=${selectedWorkspaceId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Asset
                </Link>
              )}
            </div>

            {/* Asset Grid */}
            {!selectedWorkspaceId ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a workspace</h3>
                <p className="text-gray-500">Choose a workspace from the sidebar to view assets</p>
              </div>
            ) : assets.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first asset</p>
                <Link
                  href={`/admin/assets/new?workspace=${selectedWorkspaceId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Asset
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
