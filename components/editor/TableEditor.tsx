'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save, ArrowUp, ArrowDown } from 'lucide-react';

interface TableEditorProps {
  headers: string[];
  rows: string[][];
  onSave: (headers: string[], rows: string[][]) => void;
  onClose: () => void;
}

export function TableEditor({ headers: initialHeaders, rows: initialRows, onSave, onClose }: TableEditorProps) {
  const [headers, setHeaders] = useState<string[]>(initialHeaders);
  const [rows, setRows] = useState<string[][]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleAddColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setRows(rows.map(row => [...row, '']));
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (headers.length <= 1) return; // Keep at least 1 column
    setHeaders(headers.filter((_, i) => i !== colIndex));
    setRows(rows.map(row => row.filter((_, i) => i !== colIndex)));
    if (selectedCell?.col === colIndex) {
      setSelectedCell(null);
    }
  };

  const handleAddRow = () => {
    setRows([...rows, Array(headers.length).fill('')]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return; // Keep at least 1 row
    setRows(rows.filter((_, i) => i !== rowIndex));
    if (selectedCell?.row === rowIndex) {
      setSelectedCell(null);
    }
  };

  const handleMoveRow = (rowIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && rowIndex === 0) return;
    if (direction === 'down' && rowIndex === rows.length - 1) return;
    
    const newRows = [...rows];
    const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
    [newRows[rowIndex], newRows[targetIndex]] = [newRows[targetIndex], newRows[rowIndex]];
    setRows(newRows);
    
    if (selectedCell?.row === rowIndex) {
      setSelectedCell({ ...selectedCell, row: targetIndex });
    } else if (selectedCell?.row === targetIndex) {
      setSelectedCell({ ...selectedCell, row: rowIndex });
    }
  };

  const handleUpdateHeader = (colIndex: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    setHeaders(newHeaders);
  };

  const handleUpdateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const selectedCellValue = selectedCell 
    ? rows[selectedCell.row]?.[selectedCell.col] 
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Table Editor</h1>
          <span className="text-sm text-zinc-500">{rows.length} rows × {headers.length} columns</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSave(headers, rows)}
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
        {/* Left Sidebar - Row Controls */}
        <div className="w-[15%] min-w-[200px] border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddRow}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded transition-colors ${
                  selectedCell?.row === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium">Row {index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveRow(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveRow(index, 'down')}
                      disabled={index === rows.length - 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs opacity-70 truncate">
                  {row[0] || '(empty)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Table Preview & Edit */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Table Data</h2>
                <button
                  onClick={handleAddColumn}
                  className="px-3 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Column
                </button>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-800">
                      {headers.map((header, colIndex) => (
                        <th key={colIndex} className="relative group">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                            <input
                              type="text"
                              value={header}
                              onChange={(e) => handleUpdateHeader(colIndex, e.target.value)}
                              className="flex-1 bg-transparent text-white font-semibold outline-none"
                              placeholder={`Column ${colIndex + 1}`}
                            />
                            <button
                              onClick={() => handleDeleteColumn(colIndex)}
                              className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-opacity"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-900/50'}
                      >
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={`px-4 py-3 border-b border-zinc-800 cursor-pointer transition-colors ${
                              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                ? 'bg-blue-600/30 ring-2 ring-blue-500'
                                : 'hover:bg-zinc-800'
                            }`}
                            onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                          >
                            <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleUpdateCell(rowIndex, colIndex, e.target.value)}
                              className="w-full bg-transparent text-white outline-none"
                              placeholder="Enter value"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Cell Info */}
        <div className="w-[20%] min-w-[280px] border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
          {selectedCell ? (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-2">Cell Editor</h2>
              <p className="text-sm text-zinc-500 mb-6">
                Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Value</label>
                  <textarea
                    value={selectedCellValue}
                    onChange={(e) => handleUpdateCell(selectedCell.row, selectedCell.col, e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-blue-600 focus:outline-none text-white"
                    rows={4}
                    placeholder="Enter cell content"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-2">Column: {headers[selectedCell.col]}</div>
                  <div className="text-xs text-zinc-500">
                    Cell {selectedCell.row * headers.length + selectedCell.col + 1} of {rows.length * headers.length}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-sm">Click a cell to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
