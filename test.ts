import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts'
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
  assertEquals('foo  bar', table(data, ['foo', 'bar']))
})

test('it does not complain when passed empty header', () => {
  const data = [{ foo: 0, bar: 1 }]
  assertEquals('', table(data, []))
})

test('it does not display null or undefined values', () => {
  const data = [
    { foo: 'fff', bar: undefined, baz: 'zzzzz' },
    { bar: 'bbbb', foo: null, baz: '' },
  ]
  assertEquals(
    'bar   baz    foo\n      zzzzz  fff\nbbbb',
    table(data, ['bar', 'baz', 'foo'])
  )
})

test('it ignores discrepancies between data properties and passed header', () => {
  const data = [
    { item: 'potato', id: 1 },
    { item: 'tomato', id: 2 },
  ]
  /*
    id  item
    1   potato
    2   tomato
  */
  assertEquals(
    'id  item\n1   potato\n2   tomato',
    table(data, ['foo', 'id', 'bar', 'item'])
  )
})

test('it throws on non-consistent data', () => {
  let data: Datum[] = [
    { foo: 0, bar: 1 },
    { foo: 1, gnu: 0 },
  ]
  assertThrows(
    () => {
      table(data, ['foo', 'bar'])
    },
    Error,
    "No property 'bar'"
  )

  data = [
    { foo: 0, gnu: 0 },
    { bar: 1, baz: 0 },
  ]
  assertThrows(
    () => {
      table(data, ['gnu'])
    },
    Error,
    "No property 'gnu'"
  )

  data = [{ foo: 0 }, { foo: 1, gnu: 0 }]
  assertThrows(
    () => {
      table(data, ['gnu'])
    },
    Error,
    'Given header does not match'
  )
})
