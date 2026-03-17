'use client';

import { useState } from 'react';
import { X, Save, Upload, Mail, Linkedin, Twitter, Github } from 'lucide-react';

interface AvatarCardEditorProps {
  imageUrl: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  layout?: 'vertical' | 'horizontal';
  backgroundColor?: string;
  textColor?: string;
  onSave: (data: {
    imageUrl: string;
    name: string;
    title: string;
    bio?: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    layout?: 'vertical' | 'horizontal';
    backgroundColor?: string;
    textColor?: string;
  }) => void;
  onClose: () => void;
}

export function AvatarCardEditor({
  imageUrl: initialImageUrl,
  name: initialName,
  title: initialTitle,
  bio: initialBio,
  email: initialEmail,
  linkedin: initialLinkedin,
  twitter: initialTwitter,
  github: initialGithub,
  layout: initialLayout,
  backgroundColor: initialBackgroundColor,
  textColor: initialTextColor,
  onSave,
  onClose
}: AvatarCardEditorProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '');
  const [name, setName] = useState(initialName || 'Team Member');
  const [title, setTitle] = useState(initialTitle || 'Position');
  const [bio, setBio] = useState(initialBio || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [linkedin, setLinkedin] = useState(initialLinkedin || '');
  const [twitter, setTwitter] = useState(initialTwitter || '');
  const [github, setGithub] = useState(initialGithub || '');
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>(initialLayout || 'vertical');
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || '#18181b');
  const [textColor, setTextColor] = useState(initialTextColor || '#ffffff');

  const handleSave = () => {
    onSave({
      imageUrl,
      name,
      title,
      bio,
      email,
      linkedin,
      twitter,
      github,
      layout,
      backgroundColor,
      textColor
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Avatar Card Editor</h1>
          <span className="text-sm text-zinc-500">{name || 'Untitled'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Close
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Preview */}
        <div className="flex-1 bg-zinc-950 p-8 overflow-auto flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-zinc-400">Live Preview</h2>
            </div>
            
            {/* Preview Card */}
            <div 
              className="w-full rounded-lg overflow-auto"
              style={{ 
                backgroundColor,
                minHeight: layout === 'vertical' ? '400px' : '300px'
              }}
            >
              {layout === 'horizontal' ? (
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center text-4xl font-bold text-zinc-400">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                        {name}
                      </h3>
                      <p className="text-lg mb-3" style={{ color: `${textColor}99` }}>
                        {title}
                      </p>
                      {bio && (
                        <p className="mb-4 leading-relaxed" style={{ color: `${textColor}cc` }}>
                          {bio}
                        </p>
                      )}
                      {(email || linkedin || twitter || github) && (
                        <div className="flex gap-3">
                          {email && (
                            <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                              <Mail className="w-5 h-5" />
                            </div>
                          )}
                          {linkedin && (
                            <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                              <Linkedin className="w-5 h-5" />
                            </div>
                          )}
                          {twitter && (
                            <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                              <Twitter className="w-5 h-5" />
                            </div>
                          )}
                          {github && (
                            <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                              <Github className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-zinc-700 flex items-center justify-center text-4xl font-bold text-zinc-400">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                    {name}
                  </h3>
                  <p className="text-lg mb-3" style={{ color: `${textColor}99` }}>
                    {title}
                  </p>
                  {bio && (
                    <p className="mb-4 leading-relaxed max-w-md" style={{ color: `${textColor}cc` }}>
                      {bio}
                    </p>
                  )}
                  {(email || linkedin || twitter || github) && (
                    <div className="flex gap-3 mt-auto pt-4">
                      {email && (
                        <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                          <Mail className="w-5 h-5" />
                        </div>
                      )}
                      {linkedin && (
                        <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                          <Linkedin className="w-5 h-5" />
                        </div>
                      )}
                      {twitter && (
                        <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                          <Twitter className="w-5 h-5" />
                        </div>
                      )}
                      {github && (
                        <div className="p-2 rounded-full bg-white/10" style={{ color: textColor }}>
                          <Github className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-[400px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">
                <Upload className="w-4 h-4 inline mr-2" />
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-zinc-500 mt-1">Enter the URL of the avatar image</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-300">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief description about this person..."
                rows={4}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Social Links</h3>
              
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    <Twitter className="w-4 h-4 inline mr-2" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/johndoe"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/johndoe"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">Appearance</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLayout('vertical')}
                    className={`px-4 py-2 rounded transition-colors ${
                      layout === 'vertical'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setLayout('horizontal')}
                    className={`px-4 py-2 rounded transition-colors ${
                      layout === 'horizontal'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>

              {/* Background Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#18181b"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
