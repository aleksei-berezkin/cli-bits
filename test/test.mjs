import assert from 'node:assert'
import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

let testQueue = []

test('enq', () => {
  const stdout = child_process.execFileSync('enq', [], {
    input: `\nab\n\ncd ef\n"gh ij"\n'kl mn'\n\n\n`
  })
  assert.equal(
    String(stdout),
    `\nab\n\n"cd ef"\n"gh ij"\n'kl mn'\n`
  )
})


// *** Testing util ***
function test(name, cb) {
  testQueue.push({name, cb})
}

let passed = 0
let failed = 0
for ( ; ; ) {
  const {name, cb} = testQueue.shift() ?? {}
  if (!cb) break

  try {
    cb()
    console.info(`✅ ${name}`)
    passed++
  } catch (e) {
    console.error(`❌ ${name}`)
    console.error(e)
    failed++
  }
}

console.log(`${ failed ? '❌' : '✅' } ${passed}/${passed + failed} passed`)
if (failed) {
  process.exit(1)
}
