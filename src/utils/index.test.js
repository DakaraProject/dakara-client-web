import { expect, test } from 'vitest'

import { formatDuration } from '.'

test('duration of more than one day', () => {
  expect(formatDuration(25 * 3600)).toBe('25:00:00')
})

test('duration of more than one hour', () => {
  expect(formatDuration(3600 + 20)).toBe('1:00:20')
})

test('duration of less than one hour', () => {
  expect(formatDuration(2 * 60 + 40)).toBe('2:40')
})

test('duration of less than one minute', () => {
  expect(formatDuration(40)).toBe('0:40')
})
