// Reusable DataTable component
// Replaces the repeated table-wrap + table pattern in all pages

import type { ReactNode } from 'react'

export interface Column<T> {
  /** Column header label */
  header: string
  /** Key accessor or render function */
  accessor?: keyof T
  /** Custom cell renderer */
  render?: (row: T, index: number) => ReactNode
  /** Custom cell style */
  style?: React.CSSProperties
  /** Add mono class to cell */
  mono?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  /** Unique key extractor */
  rowKey?: (row: T, index: number) => string
}

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex}>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={col.mono ? 'mono' : undefined}
                  style={col.style}
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : col.accessor
                      ? String((row as any)[col.accessor] ?? '-')
                      : '-'
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
