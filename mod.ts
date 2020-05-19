interface TableOptions {
  padding?: number
}

/** TODO */
export type Datum = Record<string, any>

/** TODO */
export function table(
  data: Datum[],
  header: string[],
  opts?: TableOptions
): string {
  /*
    validate inputs
  */

  const cols = takeCols(data, header)
  // console.log(cols)
  const rows = makeRows(cols) // padding
  // console.log(rows)

  return rows.map(x => x.trimEnd()).join('\n')
}

function takeCols(data: Datum[], header: string[]): string[][] {
  const cols: string[][] = []

  header.forEach((key, i) => {
    cols.push([key])
    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[i].push(datum[key].toString())
      }
    }
  })

  return cols
}

function makeRows(cols: string[][], padding: number = 2) {
  const widths = cols.map(col => Math.max(...col.map(x => x.length)))
  // console.log(widths)
  const rows: string[] = []

  for (let i = 0; i < cols[0].length; i++) {
    rows.push(
      cols
        .map(col => col[i])
        .reduce(
          (prev, curr, i) => (prev += curr.padEnd(widths[i] + padding)), // trim here?
          ''
        )
    )
  }

  return rows
}
