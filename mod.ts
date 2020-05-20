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
  const pad = opts?.padding || 2

  // validate inputs
  if (!data.length) {
    return header.join(' '.repeat(pad))
  }
  const validHeader = intersect(Object.keys(data[0]), header)
  console.log(validHeader)

  const cols = takeCols(data, validHeader)
  const rows = makeRows(cols, pad)

  return rows.map(x => x.trimEnd()).join('\n')
}

/*
  HELPERS
*/

function intersect(a: string[], b: string[]) {
  // keep original order of `b`
  const setA = new Set(a)
  const intersection = new Set(b.filter(e => setA.has(e)))

  return Array.from(intersection)
}

function takeCols(data: Datum[], header: string[]) {
  const cols: string[][] = []

  header.forEach((key, idx) => {
    cols.push([key]) // TODO: upcaseHeader
    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[idx].push(datum[key]?.toString() || '') // TODO: emptyReplacer
      }
    }
  })

  return cols
}

function makeRows(cols: string[][], pad: number) {
  const maxWidths = cols.map(col => Math.max(...col.map(x => x.length)))
  const rowsCount = cols[0].length
  const rows: string[] = []

  for (let row = 0; row < rowsCount; row++) {
    rows.push(
      cols
        .map(col => col[row])
        .reduce(
          (memo, value, colIdx) =>
            (memo += value.padEnd(maxWidths[colIdx] + pad)),
          ''
        )
    )
  }

  return rows
}
