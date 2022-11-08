import test from 'node:test'
import { strict as assert } from 'node:assert'
import { strip } from '../src/strip.js'

test('strip', () => {
  assert.strictEqual(strip('hello     abcdef    \n   a a   \n   \n   a    '), 'hello abcdef\na a\na')
  assert.strictEqual(strip('  \n  \n   \n\n\n   \n'), '')
  assert.strictEqual(strip('  \n  \n  xxx \n\n\n   \n'), 'xxx')
  assert.strictEqual(strip('  \n  \n  xxx \n\n\nyyyy   \n'), 'xxx\nyyyy')
})
