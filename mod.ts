interface TableOptions {
  padding?: number
  upcaseHeader?: boolean // headerMod?: 'lower' | 'upper'
  emptyReplacer?: string
}

/** TODO */
export type Datum = Record<string, any>

/** TODO */
export function table(data: Datum[], header: string[], opts?: TableOptions): string {
  const pad = opts?.padding || 2
  const upcase = opts?.upcaseHeader || false // undefined

  if (!data.length || !header.length) {
    return header.join(' '.repeat(pad))
  }

  const validHeader = intersect(Object.keys(data[0]), header)

  if (!validHeader.length) {
    throw new Error('Given header does not match any datum property!')
  }

  const cols = takeCols(data, validHeader, upcase)
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

function takeCols(data: Datum[], header: string[], upcase: boolean) {
  const cols: string[][] = []

  header.forEach((key, idx) => {
    const keyMod = upcase ? key.toUpperCase() : key

    cols.push([keyMod])

    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[idx].push(datum[key]?.toString() || '') // TODO: emptyReplacer
      } else {
        throw new Error(`No property '${key}' in one of the given data!`)
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
          (memo, value, colIdx) => (memo += value.padEnd(maxWidths[colIdx] + pad)),
          ''
        )
    )
  }

  return rows
}
