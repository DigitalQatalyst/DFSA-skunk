/**
 * ProfileSectionTable Component
 * Generic table renderer for multi-row sections
 * Will be enhanced per tab with specific column types
 */

import React, { useState } from 'react';
import { XIcon, PlusIcon } from 'lucide-react';
import { Can } from '../RBAC/Can';

export interface TableColumn {
  id: string;
  label: string;
  type?: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ label: string; value: string }>;
}

interface ProfileSectionTableProps {
  columns: TableColumn[];
  rows: Record<string, any>[];
  onAddRow?: () => void;
  onUpdateRow?: (index: number, data: Record<string, any>) => void;
  onDeleteRow?: (index: number) => void;
  isReadOnly?: boolean;
}

export function ProfileSectionTable({
  columns,
  rows = [],
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  isReadOnly = false,
}: ProfileSectionTableProps) {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Record<string, any>>({});

  const handleEdit = (index: number) => {
    setEditingRow(index);
    setEditedData({ ...rows[index] });
  };

  const handleSave = (index: number) => {
    onUpdateRow?.(index, editedData);
    setEditingRow(null);
    setEditedData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleCellChange = (columnId: string, value: any) => {
    setEditedData((prev) => ({ ...prev, [columnId]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-3 py-2 text-left font-medium text-gray-700"
                >
                  {column.label}
                </th>
              ))}
              {!isReadOnly && <th className="px-3 py-2"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-3 text-gray-400 italic text-center"
                  colSpan={columns.length + (isReadOnly ? 0 : 1)}
                >
                  No rows added yet
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => {
                    const isEditing = editingRow === rowIndex;
                    const value = isEditing
                      ? editedData[column.id] || ''
                      : row[column.id] || '';

                    return (
                      <td key={column.id} className="px-3 py-2">
                        {isEditing && !isReadOnly ? (
                          column.type === 'select' && column.options ? (
                            <select
                              value={value}
                              onChange={(e) =>
                                handleCellChange(column.id, e.target.value)
                              }
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="">Select...</option>
                              {column.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : column.type === 'date' ? (
                            <input
                              type="date"
                              value={value}
                              onChange={(e) =>
                                handleCellChange(column.id, e.target.value)
                              }
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                handleCellChange(column.id, e.target.value)
                              }
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          )
                        ) : (
                          <span className="text-gray-800">{value || '-'}</span>
                        )}
                      </td>
                    );
                  })}
                  {!isReadOnly && (
                    <td className="px-3 py-2">
                      {editingRow === rowIndex ? (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleSave(rowIndex)}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="text-xs text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(rowIndex)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRow?.(rowIndex)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isReadOnly && onAddRow && (
        <Can I="update" a="user-profile">
          <button
            type="button"
            onClick={onAddRow}
            className="px-3 py-2 text-sm font-medium text-white rounded flex items-center"
            style={{ backgroundColor: '#9b1823' }}
          >
            <PlusIcon size={16} className="mr-2" />
            Add Row
          </button>
        </Can>
      )}
    </div>
  );
}



