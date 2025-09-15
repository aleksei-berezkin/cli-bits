import { readFileSync } from 'fs'

export function readInputLines() {
  const lines = readFileSync(0, 'utf-8').split('\n')
  const lastNonEmptyIndex = lines.findLastIndex(l => l)
  return lastNonEmptyIndex === -1 ? [] : lines.slice(0, lastNonEmptyIndex + 1)
}
