'use client'

import { Mail, Linkedin, Twitter, Github } from 'lucide-react'

interface AvatarCardProps {
  imageUrl: string
  name: string
  title: string
  bio?: string
  email?: string
  linkedin?: string
  twitter?: string
  github?: string
  layout?: 'vertical' | 'horizontal'
  backgroundColor?: string
  textColor?: string
}

export function AvatarCard({
  imageUrl,
  name = 'Team Member',
  title = 'Position',
  bio = '',
  email = '',
  linkedin = '',
  twitter = '',
  github = '',
  layout = 'vertical',
  backgroundColor = '#18181b',
  textColor = '#ffffff'
}: AvatarCardProps) {
  const socialLinks = [
    { icon: Mail, url: email ? `mailto:${email}` : '', label: 'Email' },
    { icon: Linkedin, url: linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: twitter, label: 'Twitter' },
    { icon: Github, url: github, label: 'GitHub' },
  ].filter(link => link.url)

  if (layout === 'horizontal') {
    return (
      <div 
        className="w-full h-full p-6 rounded-lg overflow-auto"
        style={{ backgroundColor }}
      >
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
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      title={link.label}
                      style={{ color: textColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Vertical layout
  return (
    <div 
      className="w-full h-full p-6 rounded-lg overflow-auto flex flex-col items-center text-center"
      style={{ backgroundColor }}
    >
      {/* Avatar */}
      <div className="mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10 hover:scale-105 transition-transform"
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
      {socialLinks.length > 0 && (
        <div className="flex gap-3 mt-auto pt-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title={link.label}
                style={{ color: textColor }}
              >
                <Icon className="w-5 h-5" />
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
