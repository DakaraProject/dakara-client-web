import { expect, test } from 'vitest'

import { formatDuration } from '.'

test('duration of more than one day', () => {
  expect(formatDuration(3600 * 25)).toBe('25:00:00')
})

test('duration of more than one hour', () => {
  expect(formatDuration(3620)).toBe('1:00:20')
})

test('duration of less than one hour', () => {
  expect(formatDuration(160)).toBe('2:40')
})
