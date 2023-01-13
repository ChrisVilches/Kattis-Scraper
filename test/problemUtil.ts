import test, { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import { getDifficultyString, parseRange, parseTimeLimit } from '../src/problemUtil'

describe(getDifficultyString.name, () => {
  it('parses one value', () => {
    assert.strictEqual(getDifficultyString('Difficulty 4.0'), '4.0')
    assert.strictEqual(getDifficultyString('Difficulty    5.1'), '5.1')
    assert.strictEqual(getDifficultyString('aa Difficulty    6.5bb'), '6.5')
    assert.strictEqual(getDifficultyString('Difficulty 5.0-2'), '5.0')
    assert.strictEqual(getDifficultyString('Difficulty 5.5 2.1'), '5.5')
  })

  it('parses two values', () => {
    assert.strictEqual(getDifficultyString('Difficulty 4.0 - 5.6'), '4.0 - 5.6')
    assert.strictEqual(getDifficultyString('Difficulty    5.1 - 1.4'), '5.1 - 1.4')
    assert.strictEqual(getDifficultyString('aa Difficulty    6.5- 5.6bb'), '6.5- 5.6')
    assert.strictEqual(getDifficultyString('aa Difficulty    1.1 -2.2bb'), '1.1 -2.2')
    assert.strictEqual(getDifficultyString('aa Difficulty    1.1   -   2.2bb'), '1.1   -   2.2')
    assert.strictEqual(getDifficultyString('aaDifficulty    3.3-4.4 bb'), '3.3-4.4')
  })

  it('rejects wrong format', () => {
    assert.throws(() => getDifficultyString('difficulty 5.6'))
    assert.throws(() => getDifficultyString('difficulty 5.0'))
    assert.throws(() => getDifficultyString('Difficulty 5.'))
    assert.throws(() => getDifficultyString('Difficulty5.'))
  })
})

test(parseRange.name, () => {
  assert.deepEqual(parseRange('4.5'), { min: 4.5, max: 4.5 })
  assert.deepEqual(parseRange('4.5 - 7.8'), { min: 4.5, max: 7.8 })
  assert.deepEqual(parseRange('8.5 - 7.8'), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('4 - 2'), { min: 2, max: 4 })

  assert.deepEqual(parseRange('   4.5  '), { min: 4.5, max: 4.5 })
  assert.deepEqual(parseRange('4.5 -    7.8'), { min: 4.5, max: 7.8 })
  assert.deepEqual(parseRange('8.5    - 7.8'), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('8.5-7.8'), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('   8.5-7.8   '), { min: 7.8, max: 8.5 })
  assert.deepEqual(parseRange('4-2'), { min: 2, max: 4 })
}).catch(() => {})

describe(parseTimeLimit.name, () => {
  it('parses correctly', () => {
    assert.strictEqual(parseTimeLimit('CPU Time limit 1 second'), 1)
    assert.strictEqual(parseTimeLimit('some text CPU Time limit   2 second some other text'), 2)
    assert.strictEqual(parseTimeLimit('...CPU Time limit 20  seconds...'), 20)
    assert.strictEqual(parseTimeLimit('CPU Time limit 4   second'), 4)
    assert.strictEqual(parseTimeLimit('xxxCPU Time limit 7   secondxxx'), 7)
  })

  it('rejects wrong format', () => {
    assert.throws(() => parseTimeLimit('CPU Time limit1 second'))
    assert.throws(() => parseTimeLimit('CPU Time Limit 1 second'))
    assert.throws(() => parseTimeLimit('CPU Time limit 4 sekond'))
    assert.throws(() => parseTimeLimit('CPU Time limit 4 minutes'))
    assert.throws(() => parseTimeLimit('CPU Time limit 4 seconss'))
    assert.throws(() => parseTimeLimit('CPU Time limit 4.5 second'))
    assert.throws(() => parseTimeLimit('CPU Time limit 1 2 second'))
  })
})
