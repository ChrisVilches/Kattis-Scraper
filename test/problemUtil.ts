import test, { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import { parseRange, parseTimeLimit } from '../src/problemUtil'

test('parseRange', () => {
  assert.deepEqual(parseRange('4.5'), { min: 4.5, max: 4.5 })
  assert.deepEqual(parseRange('4.5 - 7.8'), { min: 4.5, max: 7.8 })
  assert.deepEqual(parseRange('8.5 - 7.8'), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('4 - 2'), { min: 2, max: 4 })
}).catch(() => {})

describe('parseTimeLimit', () => {
  it('parses correctly', () => {
    assert.strictEqual(parseTimeLimit('1 second'), 1)
    assert.strictEqual(parseTimeLimit('2 seconds'), 2)
    assert.strictEqual(parseTimeLimit('20 seconds'), 20)
    assert.strictEqual(parseTimeLimit('4 second'), 4)
  })

  it('is case insensitive', () => {
    assert.strictEqual(parseTimeLimit('11 sECONd'), 11)
    assert.strictEqual(parseTimeLimit('22 sEcOnDs'), 22)
    assert.strictEqual(parseTimeLimit('1 secondS'), 1)
    assert.strictEqual(parseTimeLimit('0 Second'), 0)
  })

  it('accepts extra spaces', () => {
    assert.strictEqual(parseTimeLimit(' 11 sECONd'), 11)
    assert.strictEqual(parseTimeLimit('22    sEcOnDs'), 22)
    assert.strictEqual(parseTimeLimit('1 secondS  '), 1)
    assert.strictEqual(parseTimeLimit('  0   Second  '), 0)
    assert.strictEqual(parseTimeLimit('  110   Second  '), 110)
  })

  it('rejects wrong format', () => {
    assert.throws(() => parseTimeLimit('4 sekond'))
    assert.throws(() => parseTimeLimit('4 minutes'))
    assert.throws(() => parseTimeLimit('4 secondss'))
    assert.throws(() => parseTimeLimit('4.5 second'))
    assert.throws(() => parseTimeLimit('1 2 second'))
  })
})
