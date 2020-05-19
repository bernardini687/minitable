interface TableOptions {
  padding?: number
  upcaseHeader?: boolean
  emptyReplacer?: string
}

/** TODO */
export type Datum = Record<string, any>

/** TODO */
export function table(
  data: Datum[],
  header: string[],
  opts?: TableOptions
): string {
  // validate inputs

  const cols = takeCols(data, header)
  const rows = makeRows(cols, opts?.padding)

  return rows.map(x => x.trimEnd()).join('\n')
}

function takeCols(data: Datum[], header: string[]): string[][] {
  const cols: string[][] = []

  header.forEach((key, idx) => {
    cols.push([key]) // upcaseHeader
    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[idx].push(datum[key]?.toString() || '') // emptyReplacer
      }
    }
  })

  return cols
}

function makeRows(cols: string[][], padding: number = 2) {
  const maxWidths = cols.map(col => Math.max(...col.map(x => x.length)))
  const rowsCount = cols[0].length
  const rows: string[] = []

  for (let row = 0; row < rowsCount; row++) {
    rows.push(
      cols
        .map(col => col[row])
        .reduce(
          (memo, value, colIdx) =>
            (memo += value.padEnd(maxWidths[colIdx] + padding)),
          ''
        )
    )
  }

  return rows
}
