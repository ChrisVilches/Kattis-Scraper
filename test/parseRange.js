import test from 'node:test'
import { strict as assert } from 'node:assert'
import { parseRange } from '../src/parseRange.js'

test('parseRange', () => {
  assert.deepEqual(parseRange('4.5'), { min: 4.5, max: 4.5 })
  assert.deepEqual(parseRange('4.5 - 7.8'), { min: 4.5, max: 7.8 })
  assert.deepEqual(parseRange('8.5 - 7.8'), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('4 - 2'), { min: 2, max: 4 })
})
