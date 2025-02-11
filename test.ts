import { assertEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts'
import { table } from './mod.ts'

const { test } = Deno

test('it formats an array of objects into a simple, flexible table', () => {
  const data = [
    { foo: 0, bar: 0 },
    { foo: 1, bar: 1 },
    { foo: 4, bar: 4 },
  ]
  /*
    foo  bar
    0    0
    1    1
    4    4
  */
  assertEquals('foo  bar\n0    0\n1    1\n4    4', table(data, ['foo', 'bar']))
})

test('the given header sets the order of the columns', () => {
  const data = [
    { foo: 'fff', bar: 'bbb' },
    { foo: 'ffff', bar: 'bbbb' },
  ]
  /*
    bar   foo
    bbb   fff
    bbbb  ffff
  */
  assertEquals('bar   foo\nbbb   fff\nbbbb  ffff', table(data, ['bar', 'foo']))
})

test('it does not display null or undefined values', () => {
  const data = [
    { foo: 'fff', bar: undefined, baz: 'zzzzz' },
    { bar: 'bbbb', foo: null, baz: '' },
  ]
  /*
    bar   baz    foo
          zzzzz  fff
    bbbb
  */
  assertEquals(
    'bar   baz    foo\n      zzzzz  fff\nbbbb',
    table(data, ['bar', 'baz', 'foo'])
  )
})

test('it ignores discrepancies between data properties and given header', () => {
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

test('it replaces null or undefined values', () => {
  const data = [
    { foo: 'fff', bar: undefined, baz: 'zzzzz' },
    { bar: 'bbbb', foo: null, baz: '' },
  ]
  /*
    bar   baz    foo
    NULL  zzzzz  fff
    bbbb  NULL   NULL
  */
  assertEquals(
    'bar   baz    foo\nNULL  zzzzz  fff\nbbbb  NULL   NULL',
    table(data, ['bar', 'baz', 'foo'], { emptyReplacer: 'NULL' })
  )
})

test('it overwrites the default padding', () => {
  const data = [{ a: 'A', b: 'B', c: 'C' }]
  /*
    a    c    b
    A    C    B
  */
  assertEquals(
    'a    c    b\nA    C    B',
    table(data, ['a', 'c', 'b'], { padding: 4 })
  )
})

test('it makes the header upcase', () => {
  const data = [{ foo: 1, bar: 2, baz: 3 }]
  /*
    FOO  BAR  BAZ
    1    2    3
  */
  assertEquals(
    'FOO  BAR  BAZ\n1    2    3',
    table(data, ['foo', 'bar', 'baz'], { upcaseHeader: true })
  )
})

test('it handles multiple options', () => {
  const data = [{ foo: 1, bar: 2, baz: null }]
  /*
    FOO    BAR    BAZ
    1      2      X
  */
  assertEquals(
    'FOO    BAR    BAZ\n1      2      X',
    table(data, ['foo', 'bar', 'baz'], {
      upcaseHeader: true,
      padding: 4,
      emptyReplacer: 'X',
    })
  )
})

test('it behaves as usual when passed default options', () => {
  const data = [{ foo: 1, bar: 2, baz: null }]
  /*
    foo  bar  baz
    1    2
  */
  assertEquals(
    'foo  bar  baz\n1    2',
    table(data, ['foo', 'bar', 'baz'], {
      upcaseHeader: false,
      padding: 2,
      emptyReplacer: '',
    })
  )
})

test('it handles various value types', () => {
  const data = [
    { foo: null, bar: new Date() },
    { foo: ['1', 13, 3333], bar: { doo: 'daloo', h: 3 } },
  ]
  /*
    foo        bar
               Fri May 22 2020 08:52:18 GMT+0200 (CEST)
    1,13,3333  [object Object]
  */
  assertEquals(
    `foo        bar\n           ${new Date()}\n1,13,3333  [object Object]`,
    table(data, ['foo', 'bar'])
  )
})

test('it does not complain when given empty data', () => {
  const data: Record<string, any>[] = []
  assertEquals('foo  bar', table(data, ['foo', 'bar']))
})

test('it does not complain when given empty header', () => {
  const data = [{ foo: 0, bar: 1 }]
  assertEquals('', table(data, []))
})

test('it throws on non-consistent data', () => {
  let data: Record<string, any>[] = [
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
