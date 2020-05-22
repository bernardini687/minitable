interface TableOptions {
  /** Padding: desired distance between column widths */
  padding?: number
  /** Upcase header: make the header upper case */
  upcaseHeader?: boolean
  /** Empty replacer: replace empty values (null, undefined, "") with a custom string */
  emptyReplacer?: string
}

type Datum = Record<string, any>

/**
 * Build a flexible table from a list of objects
 * @param data Data to print
 * @param header Desired header of the table
 * @param options Modify the padding, upcase the header, set empty-values replacer
 */
export function table(data: Datum[], header: string[], opts?: TableOptions): string {
  const pad = opts?.padding || 2
  const upcase = opts?.upcaseHeader || false
  const empty = opts?.emptyReplacer || ''

  if (!data.length || !header.length) {
    return header.join(' '.repeat(pad))
  }

  const validHeader = intersect(Object.keys(data[0]), header)

  if (!validHeader.length) {
    throw new Error('Given header does not match any datum property!')
  }

  const cols = takeCols(data, validHeader, upcase, empty)
  const rows = makeRows(cols, pad)

  return rows.map(x => x.trimEnd()).join('\n')
}

/*
  HELPERS
*/
function intersect(props: string[], header: string[]) {
  // keep original order of `header`
  const propsSet = new Set(props)
  const intersection = new Set(header.filter(prop => propsSet.has(prop)))

  return Array.from(intersection)
}

function takeCols(data: Datum[], header: string[], upcase: boolean, empty: string) {
  const cols: string[][] = []

  header.forEach((key, idx) => {
    const keyMod = upcase ? key.toUpperCase() : key
    cols.push([keyMod])

    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[idx].push(datum[key]?.toString() || empty)
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
