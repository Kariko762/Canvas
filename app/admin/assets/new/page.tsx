'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewAssetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace') || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft' as 'draft' | 'published',
    canvas_background_color: '#6366f1',
    canvas_text_color: '#ffffff',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!workspaceId) {
      setError('No workspace selected. Please go back and select a workspace.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          workspace_id: workspaceId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create asset')
      }

      const { asset } = await response.json()
      router.push(`/admin/assets/${asset.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }))
  }

  const handleColorChange = (field: 'canvas_background_color' | 'canvas_text_color', value: string) => {
    // Only update if it's a valid hex color (3 or 6 digits after #)
    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value) || /^#[0-9A-Fa-f]{3}$/.test(value)
    if (isValidHex || value === '') {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={workspaceId ? `/admin?workspace=${workspaceId}` : '/admin'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">New Asset</h1>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Asset'}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {!workspaceId && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">No workspace selected</p>
            <p className="text-sm mt-1">
              Please <Link href="/admin" className="underline font-medium">go back to the dashboard</Link> and select a workspace, then click "New Asset" from there.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="My Asset"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-gray-900"
              placeholder="my-asset"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL: /e/{formData.slug || 'my-asset'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Brief description of this asset..."
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Canvas Colors */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="bg-color" className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="bg-color"
                  value={formData.canvas_background_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, canvas_background_color: e.target.value }))}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.canvas_background_color}
                  onChange={(e) => handleColorChange('canvas_background_color', e.target.value)}
                  onBlur={(e) => {
                    // Reset to valid color on blur if invalid
                    if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setFormData(prev => ({ ...prev, canvas_background_color: '#6366f1' }))
                    }
                  }}
                  placeholder="#6366f1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="text-color"
                  value={formData.canvas_text_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, canvas_text_color: e.target.value }))}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.canvas_text_color}
                  onChange={(e) => handleColorChange('canvas_text_color', e.target.value)}
                  onBlur={(e) => {
                    // Reset to valid color on blur if invalid
                    if (!/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setFormData(prev => ({ ...prev, canvas_text_color: '#ffffff' }))
                    }
                  }}
                  placeholder="#ffffff"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div
              className="w-full aspect-video rounded-lg flex items-center justify-center text-6xl font-bold"
              style={{
                backgroundColor: formData.canvas_background_color,
                color: formData.canvas_text_color,
              }}
            >
              {formData.title ? formData.title.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
