import React from 'react';

export type MatrixValue = Record<string, Record<string, boolean>>;

interface MatrixLabel {
  key: string;
  label: string;
}

interface MatrixFieldProps {
  label: string;
  fieldName: string;
  matrixDimensions?: { rows: number; columns: number };
  rowLabels?: MatrixLabel[];
  columnLabels?: MatrixLabel[];
  applicableCells?: Record<string, string[]>; // activityKey -> [productTypeKey1, productTypeKey2, ...]
  value?: MatrixValue;
  onChange: (next: MatrixValue) => void;
  readOnly?: boolean;
}

export const MatrixField: React.FC<MatrixFieldProps> = ({
  label,
  fieldName,
  matrixDimensions,
  rowLabels,
  columnLabels,
  applicableCells,
  value = {},
  onChange,
  readOnly = false,
}) => {
  // Use rowLabels/columnLabels if provided, otherwise fall back to generic dimensions
  const rows = rowLabels || Array.from({ length: matrixDimensions?.rows || 0 }, (_, i) => ({ key: `row_${i}`, label: `Row ${i + 1}` }));
  const cols = columnLabels || Array.from({ length: matrixDimensions?.columns || 2 }, (_, i) => ({ key: `col_${i}`, label: `Col ${i + 1}` }));

  const handleToggle = (rowKey: string, colKey: string) => {
    const currentRow = value[rowKey] || {};
    const hasCol = Object.prototype.hasOwnProperty.call(currentRow, colKey);
    const current = hasCol ? currentRow[colKey] : undefined;

    // Tri-state cycle:
    // - undefined (not answered) -> true
    // - true -> false
    // - false -> undefined (clear back to not answered)
    const next = current === undefined ? true : current === true ? false : undefined;

    const nextRow = { ...currentRow };
    if (next === undefined) {
      delete nextRow[colKey];
    } else {
      nextRow[colKey] = next;
    }

    const nextValue = { ...value };
    if (Object.keys(nextRow).length === 0) {
      delete nextValue[rowKey];
    } else {
      nextValue[rowKey] = nextRow;
    }

    onChange(nextValue);
  };

  const isCellApplicable = (rowKey: string, colKey: string): boolean => {
    // If no applicableCells defined, all cells are applicable
    if (!applicableCells) return true;
    
    // Check if this cell is in the applicable list for this row
    const applicableForRow = applicableCells[rowKey];
    if (!applicableForRow) return false;
    
    return applicableForRow.includes(colKey);
  };

  const renderCell = (rowKey: string, colKey: string) => {
    const isApplicable = isCellApplicable(rowKey, colKey);
    
    // If cell is not applicable, show empty cell or disabled state
    if (!isApplicable) {
      return (
        <span className="text-gray-300 text-xs">-</span>
      );
    }

    const row = value?.[rowKey] || {};
    const hasCol = Object.prototype.hasOwnProperty.call(row, colKey);
    const cellValue = hasCol ? row[colKey] : undefined;

    if (readOnly) {
      if (cellValue === undefined) {
        return (
          <span className="text-gray-300 text-xs" title="Not answered">—</span>
        );
      }

      return (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${cellValue ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {cellValue ? 'Yes' : 'No'}
        </span>
      );
    }
    return (
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={cellValue === true}
        ref={(el) => {
          if (!el) return;
          el.indeterminate = cellValue === undefined;
        }}
        onChange={() => handleToggle(rowKey, colKey)}
      />
    );
  };

  return (
    <div className="space-y-3">
      {label && <div className="text-sm font-medium text-gray-800">{label}</div>}
      <div className="overflow-x-auto border-t border-gray-200 pt-3">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Activity</th>
              {cols.map((col) => (
                <th key={col.key} className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t">
                <td className="px-3 py-2 text-xs text-gray-700 font-medium">{row.label}</td>
                {cols.map((col) => (
                  <td key={col.key} className="px-3 py-2 text-center">
                    {renderCell(row.key, col.key)}
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
