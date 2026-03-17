import React from 'react';

interface CodeBlockProps {
  code?: string;
  language?: string;
  theme?: 'dark' | 'light';
  showLineNumbers?: boolean;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg';
  filename?: string;
  mode?: 'view' | 'edit';
}

export default function CodeBlock({
  code = 'const greeting = "Hello, World!";\nconsole.log(greeting);',
  language = 'javascript',
  theme = 'dark',
  showLineNumbers = true,
  fontSize = 'sm',
  filename = '',
  mode = 'view'
}: CodeBlockProps) {
  const lines = code.split('\n');

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  const themeClasses = {
    dark: {
      bg: 'bg-slate-900/90',
      text: 'text-slate-100',
      lineNumber: 'text-slate-500',
      border: 'border-slate-700',
      header: 'bg-slate-800/50 text-slate-300'
    },
    light: {
      bg: 'bg-slate-50',
      text: 'text-slate-900',
      lineNumber: 'text-slate-400',
      border: 'border-slate-300',
      header: 'bg-slate-200 text-slate-700'
    }
  };

  const themeStyle = themeClasses[theme];

  return (
    <div className={`rounded-lg border overflow-hidden ${themeStyle.border}`}>
      {filename && (
        <div className={`px-4 py-2 text-sm font-mono ${themeStyle.header}`}>
          {filename}
        </div>
      )}
      <div className={`${themeStyle.bg} ${themeStyle.text} font-mono ${fontSizeClasses[fontSize]} overflow-x-auto`}>
        <div className="p-4">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className={`${themeStyle.lineNumber} select-none mr-4 text-right w-8 flex-shrink-0`}>
                  {index + 1}
                </span>
              )}
              <pre className="flex-1">
                <code>{line || ' '}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
      <div className={`px-4 py-2 text-xs font-mono ${themeStyle.header} flex justify-between items-center`}>
        <span className="opacity-60">{language}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
