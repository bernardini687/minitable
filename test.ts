import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
// import { table } from './mod.ts'

interface TableOptions {
  padding?: number
}

type Datum = Record<string, any>

function table(data: Datum[], header: string[], opts?: TableOptions): string {
  /*
    validate inputs
    build columns
    find max
    stitch together with padding
    join with newline
  */
  const PADDING = 2

  const cols: string[][] = []
  header.forEach((key, i) => {
    cols.push([key])
    for (const datum of data) {
      if (datum.hasOwnProperty(key)) {
        cols[i].push(datum[key].toString())
      }
    }
  })
  // console.log(cols)

  const widths = cols.map(col => Math.max(...col.map(x => x.length)))
  // console.log(widths)

  const rows: string[] = []
  for (let i = 0; i < cols[0].length; i++) {
    rows.push(
      cols
        .map(col => col[i])
        .reduce(
          (prev, curr, i) => (prev += curr.padEnd(widths[i] + PADDING)), // trim here?
          ''
        )
    )
  }
  // console.log(rows)

  return rows.map(x => x.trimEnd()).join('\n')
}

Deno.test(
  'it formats an array of objects into a simple, flexible table',
  () => {
    let data: Datum[] = [
      { foo: 1, bar: 2 },
      { foo: 2, bar: 4 },
      { foo: 4, bar: 8 },
    ]
    assertEquals(
      'foo  bar\n1    2\n2    4\n4    8',
      table(data, ['foo', 'bar'])
    )

    data = [
      { foo: 'fff', bar: 'bbb' },
      { foo: 'ffff', bar: 'bbbb' },
    ]
    assertEquals(
      'bar   foo\nbbb   fff\nbbbb  ffff',
      table(data, ['bar', 'foo'])
    )
  }
)

// console.log(
//   table(
//     [
//       { cat: 'sophie', age: 19 },
//       { cat: 'margot', age: 12 },
//       { cat: 'leopoldo', age: 1 },
//     ],
//     ['cat', 'age']
//   )
// )
