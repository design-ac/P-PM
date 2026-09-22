import { Fragment } from 'react'
import { Text } from 'design-system-project'

// The row/column toggle-grid extracted from the Staff Member Roles screen
// (rotated column headers, rotated row-axis label, filled-square checked
// state) so it can be reused for Staff Group x Role and Role x Activity
// without re-implementing the same grid three times. Surrounding chrome
// (tabs, search, mode toggle, legend, footer) stays page-specific since it
// differs per screen.
type PermissionMatrixProps<Row, Col> = {
  rows: Row[]
  columns: Col[]
  getRowId: (row: Row) => string
  getRowLabel: (row: Row) => string
  getColId: (col: Col) => string
  getColLabel: (col: Col) => string
  isChecked: (rowId: string, colId: string) => boolean
  onToggle: (rowId: string, colId: string) => void
  editable: boolean
  rowAxisLabel: string
  /** Width of the row-label column in px. Defaults to 200 (the original Staff Member Roles measurement) — widen for row labels longer than staff names, e.g. role names on Role mapping. */
  rowLabelWidth?: number
}

export function PermissionMatrix<Row, Col>({
  rows,
  columns,
  getRowId,
  getRowLabel,
  getColId,
  getColLabel,
  isChecked,
  onToggle,
  editable,
  rowAxisLabel,
  rowLabelWidth = 200,
}: PermissionMatrixProps<Row, Col>) {
  return (
    <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
      <div className="relative w-8 shrink-0">
        <Text as="p" variant="h1" className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-center">
          {rowAxisLabel}
        </Text>
      </div>

      {/* "safe center" (not plain center) — plain center clips content you can
          never scroll to when it overflows the container (the browser centers
          around the midpoint and won't let scrollTop go negative to reach the
          top overflow). "safe" falls back to start-alignment once content no
          longer fits, so a large role/activity list stays fully reachable. */}
      <div className="flex min-h-0 flex-1 items-[safe_center] justify-[safe_center] overflow-auto">
        <div className="grid h-max w-max gap-x-2 gap-y-2" style={{ gridTemplateColumns: `${rowLabelWidth}px repeat(${columns.length}, 40px)` }}>
          <div className="h-[140px]" />
          {columns.map((col) => (
            <div key={getColId(col)} className="relative h-[140px] w-[40px]">
              <div className="absolute bottom-2 left-3 origin-bottom-left -rotate-45 whitespace-nowrap">
                <span className="type-overline text-text-primary">{getColLabel(col)}</span>
              </div>
            </div>
          ))}

          {rows.map((row) => {
            const rowId = getRowId(row)
            return (
              <Fragment key={rowId}>
                <div className="flex items-center justify-end pr-2">
                  <span className="type-overline whitespace-nowrap text-text-primary">{getRowLabel(row)}</span>
                </div>
                {columns.map((col) => {
                  const colId = getColId(col)
                  const checked = isChecked(rowId, colId)
                  return (
                    <button
                      key={colId}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-label={`${checked ? 'Remove' : 'Assign'} ${getColLabel(col)} for ${getRowLabel(row)}`}
                      disabled={!editable}
                      onClick={() => onToggle(rowId, colId)}
                      className={[
                        'flex h-[40px] w-[40px] items-center justify-center rounded-lg border bg-background-white transition-colors',
                        editable ? 'cursor-pointer border-other-border hover:bg-action-hover' : 'cursor-default border-transparent',
                      ].join(' ')}
                    >
                      {checked ? <span className="h-6 w-6 rounded bg-primary-main" /> : null}
                    </button>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
