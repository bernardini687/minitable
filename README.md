# minitable

_shape a list of data into a table_

simple helper to get a string designed to be printed as a table.

# usage

```ts
import { table } from 'https://deno.land/x/minitable/mod.ts'

const fruits = [
  { name: 'mango', color: 'orange', quantity: 3 },
  { name: 'lemon', color: 'yellow', quantity: 1 },
  { name: 'strawberry', color: '', quantity: 5 },
  { name: 'tomato', color: 'red', quantity: 17 },
]

// change the order of the columns
const t = table(fruits, ['quantity', 'color', 'name'])

console.log(t)
/*
  quantity  color   name
  3         orange  mango
  1         yellow  lemon
  5                 strawberry
  17        red     tomato
*/
```

# options

```ts
// pick the properties to show
const t = table(fruits, ['color', 'name'], {
  padding: 4,
  upcaseHeader: true,
  emptyReplacer: 'NO DATA POINT',
})

console.log(t)
/*
  COLOR            NAME
  orange           mango
  yellow           lemon
  NO DATA POINT    strawberry
  red              tomato
*/
```
