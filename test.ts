import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { table, Datum } from './mod.ts'

const { test } = Deno

test('it formats an array of objects into a simple, flexible table', () => {
  let data: Datum[] = [
    { foo: 1, bar: 2 },
    { foo: 2, bar: 4 },
    { foo: 4, bar: 8 },
  ]
  assertEquals('foo  bar\n1    2\n2    4\n4    8', table(data, ['foo', 'bar']))

  data = [
    { foo: 'fff', bar: 'bbb' },
    { foo: 'ffff', bar: 'bbbb' },
  ]
  assertEquals('bar   foo\nbbb   fff\nbbbb  ffff', table(data, ['bar', 'foo']))
})

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
