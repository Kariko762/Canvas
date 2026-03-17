import React from 'react';

interface TableProps {
  headers?: string[] | string;
  rows?: string[][] | string;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  headerColor?: string;
  headerTextColor?: string;
  rowColor?: string;
  rowTextColor?: string;
  borderColor?: string;
  mode?: 'view' | 'edit';
}

export default function Table({
  headers = ['Name', 'Role', 'Email'],
  rows = [
    ['John Doe', 'Engineer', 'john@example.com'],
    ['Jane Smith', 'Designer', 'jane@example.com'],
    ['Bob Johnson', 'Manager', 'bob@example.com']
  ],
  striped = true,
  bordered = true,
  compact = false,
  headerColor = '#1e293b',
  headerTextColor = '#ffffff',
  rowColor = '#0f172a',
  rowTextColor = '#e2e8f0',
  borderColor = '#334155',
  mode = 'view'
}: TableProps) {
  // Parse JSON if needed
  const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
  const parsedRows = typeof rows === 'string' ? JSON.parse(rows) : rows;

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className={`overflow-x-auto rounded-lg ${bordered ? 'border' : ''}`} style={{ borderColor: bordered ? borderColor : undefined }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: headerColor }}>
            {parsedHeaders.map((header: string, index: number) => (
              <th
                key={index}
                className={`${cellPadding} text-left font-semibold ${bordered ? 'border-b' : ''}`}
                style={{
                  color: headerTextColor,
                  borderColor: bordered ? borderColor : undefined
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedRows.map((row: string[], rowIndex: number) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: striped && rowIndex % 2 === 1 ? `${rowColor}99` : rowColor
              }}
            >
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  className={`${cellPadding} ${bordered ? 'border-b' : ''}`}
                  style={{
                    color: rowTextColor,
                    borderColor: bordered ? borderColor : undefined
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
