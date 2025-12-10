import React from 'react';

export type MatrixValue = Record<string, Record<string, boolean>>;

interface MatrixFieldProps {
  label: string;
  fieldName: string;
  matrixDimensions?: { rows: number; columns: number };
  value?: MatrixValue;
  onChange: (next: MatrixValue) => void;
  readOnly?: boolean;
}

export const MatrixField: React.FC<MatrixFieldProps> = ({
  label,
  fieldName,
  matrixDimensions,
  value = {},
  onChange,
  readOnly = false,
}) => {
  const rows = matrixDimensions?.rows || 0;
  const cols = matrixDimensions?.columns || 2;

  const handleToggle = (rowKey: string, colKey: string) => {
    const currentRow = value[rowKey] || {};
    const nextRow = { ...currentRow, [colKey]: !currentRow[colKey] };
    const nextValue = { ...value, [rowKey]: nextRow };
    onChange(nextValue);
  };

  const renderCell = (rowKey: string, colKey: string) => {
    const checked = Boolean(value?.[rowKey]?.[colKey]);
    if (readOnly) {
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {checked ? 'Yes' : 'No'}
        </span>
      );
    }
    return (
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={checked}
        onChange={() => handleToggle(rowKey, colKey)}
      />
    );
  };

  const rowKeys = Array.from({ length: rows }, (_, i) => `row_${i}`);
  const colKeys = Array.from({ length: cols }, (_, i) => `col_${i}`);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Row</th>
              {colKeys.map((colKey) => (
                <th key={colKey} className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                  {colKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((rowKey) => (
              <tr key={rowKey} className="border-t">
                <td className="px-3 py-2 text-xs text-gray-700">{rowKey}</td>
                {colKeys.map((colKey) => (
                  <td key={colKey} className="px-3 py-2 text-center">
                    {renderCell(rowKey, colKey)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
