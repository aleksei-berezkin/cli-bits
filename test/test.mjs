import assert from 'node:assert'
import child_process from 'node:child_process'

let passed = 0
let failed = 0

test('enq', () => {
  const stdout = exec(
    'enq',
    `\nab\n\ncd ef\n"gh ij"\n'kl mn'\n\n\n`,
  )
  assert.equal(
    stdout,
    `\nab\n\n"cd ef"\n"gh ij"\n'kl mn'\n`
  )
})

test('enum simple', () => {
  assert.equal(
    exec('enum', 'a\nb\nc\n\n\n'),
    ' 1  -3  a\n 2  -2  b\n 3  -1  c\n'
  )
})

test('enum long', () => {
  assert.equal(
    exec('enum', '\n\na\n\nb\nc\nd\ne\n\n\nf\n'),
    '  1  -11  \n  2  -10  \n  3   -9  a\n  4   -8  \n  5   -7  b\n  6   -6  c\n  7   -5  d\n  8   -4  e\n  9   -3  \n 10   -2  \n 11   -1  f\n'
  )
})

test('getLine first', () => {
  const input = 'a\nb\nc'
  const output = 'a\n'
  assert.equal(exec('getLine 1', input), output)
  assert.equal(exec('getLine 1 1', input), output)
})

test('getLine last', () => {
  const input = 'a\nb\nc\n\n\n'
  const output = 'c\n'
  assert.equal(exec('getLine 3', input), output)
  assert.equal(exec('getLine 3 3', input), output)
  assert.equal(exec('getLine -1', input), output)
  assert.equal(exec('getLine -1 -1', input), output)
})

test('getLine range 1', () => {
  const input = 'a\nb\nc\nd'
  const output = 'a\nb\n'
  assert.equal(exec('getLine 1 2', input), output)
  assert.equal(exec('getLine 1 -3', input), output)
  assert.equal(exec('getLine -4 2', input), output)
  assert.equal(exec('getLine -4 -3', input), output)
})

test('getLine range 2', () => {
  const input = 'a\nb\nc\nd'
  const output = 'b\nc\nd\n'
  assert.equal(exec('getLine 2 4', input), output)
  assert.equal(exec('getLine 2 -1', input), output)
  assert.equal(exec('getLine -3 4', input), output)
  assert.equal(exec('getLine -3 -1', input), output)
})

test('gitb', () => {
  const stdout = exec('gitb')
  assert(/^[a-zA-Z0-9._/-]+\n$/.test(stdout), `gitb output: ${stdout}`)
})

// *** Util ***
function exec(cmd, input) {
  const [executable, ...args] = cmd.split(' ')
  return String(child_process.execFileSync(executable, args, { input }))
}

// *** Testing util ***
function test(name, cb) {
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
