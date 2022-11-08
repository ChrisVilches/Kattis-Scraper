// import test from 'node:test'
// import { strict as assert } from 'node:assert'

const STRIP_REGEX = /[ \t]+/g

export const strip = str => str.split('\n').map(line => line.replace(STRIP_REGEX, ' ').trim()).filter(line => line.length).join('\n')

/*
TODO: Don't execute these tests along with the main program
test('strip', (t) => {
  assert.strictEqual(strip('hello     abcdef    \n   a a   \n   \n   a    '), 'hello abcdef\na a\na')
  assert.strictEqual(strip('  \n  \n   \n\n\n   \n'), '')
  assert.strictEqual(strip('  \n  \n  xxx \n\n\n   \n'), 'xxx')
  assert.strictEqual(strip('  \n  \n  xxx \n\n\nyyyy   \n'), 'xxx\nyyyy')
})
*/
