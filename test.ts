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

  data = [{ a: 'A', b: 'B', c: 'C' }]
  assertEquals('a  c  b\nA  C  B', table(data, ['a', 'c', 'b']))

  data = []
  assertEquals('foo', table(data, ['foo']))
})
