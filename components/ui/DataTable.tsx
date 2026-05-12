import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  accessor?: keyof T
  render?: (row: T, index: number) => ReactNode
  mono?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string
}

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-left text-[0.7rem] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.map((row, ri) => (
              <tr key={rowKey ? rowKey(row, ri) : ri} className="hover:bg-surface/60 transition-colors">
                {columns.map((col, ci) => (
                  <td key={ci} className={`px-4 py-3 text-dark ${col.mono ? 'font-mono text-xs' : ''} ${col.className || ''}`}>
                    {col.render ? col.render(row, ri) : col.accessor ? String((row as Record<string, unknown>)[col.accessor as string] ?? '-') : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
