import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
import { table, Datum } from './mod.ts'

const { test } = Deno

test('it formats an array of objects into a simple, flexible table', () => {
  const data = [
    { foo: 0, bar: 0 },
    { foo: 1, bar: 1 },
    { foo: 4, bar: 4 },
  ]
  assertEquals('foo  bar\n0    0\n1    1\n4    4', table(data, ['foo', 'bar']))
})

test('the given header decides the order of the columns', () => {
  const data = [
    { foo: 'fff', bar: 'bbb' },
    { foo: 'ffff', bar: 'bbbb' },
  ]
  assertEquals('bar   foo\nbbb   fff\nbbbb  ffff', table(data, ['bar', 'foo']))
})

test('it overwrites the default padding', () => {
  const data = [{ a: 'A', b: 'B', c: 'C' }]
  assertEquals(
    'a    c    b\nA    C    B',
    table(data, ['a', 'c', 'b'], { padding: 4 })
  )
})

test('it does not complain when passed empty data', () => {
  const data: Datum[] = []
  assertEquals('foo', table(data, ['foo']))
})

test('it simply does not display null or undefined values', () => {
  const data = [
    { foo: 'fff', bar: undefined, baz: 'zzzzz' },
    { bar: 'bbbb', foo: null, baz: '' },
  ]
  assertEquals(
    'bar   baz    foo\n      zzzzz  fff\nbbbb',
    table(data, ['bar', 'baz', 'foo'])
  )
})

// TODO: unhappy path
// data = [{ foo: 'fff', bar: 'bbb' }, { bar: 'bbbb' }]
// assertEquals('bar   foo\nbbb   fff\n      ffff', table(data, ['bar', 'foo']))
