import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  differentiateEntries,
  formatDate,
  formatDateLong,
  formatDateRelative,
  formatDuration,
  getEntriesHash,
  getMostPertinentEntry,
} from '.'

describe('format duration', () => {
  test('more than one day', () => {
    expect(formatDuration(25 * 3600)).toBe('25:00:00')
  })

  test('more than one hour', () => {
    expect(formatDuration(3600 + 20)).toBe('1:00:20')
  })

  test('less than one hour', () => {
    expect(formatDuration(2 * 60 + 40)).toBe('2:40')
  })

  test('less than one minute', () => {
    expect(formatDuration(40)).toBe('0:40')
  })
})

describe('format date long', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    const date = new Date(1970, 0, 5, 0, 30)
    vi.setSystemTime(date)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('before more than 6 hours', () => {
    expect(formatDateLong('1970-01-03T00:00:00')).toBe('01/03/1970 12:00 AM')
    expect(formatDateLong('1970-01-04T18:29:00')).toBe('01/04/1970 6:29 PM')
  })

  test('after more than 12 hours', () => {
    expect(formatDateLong('1970-01-07T00:00:00')).toBe('01/07/1970 12:00 AM')
    expect(formatDateLong('1970-01-05T12:31:00')).toBe('01/05/1970 12:31 PM')
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatDateLong('1970-01-05T00:35:00')).toBe('12:35 AM')
    expect(formatDateLong('1970-01-05T00:25:00')).toBe('12:25 AM')
    expect(formatDateLong('1970-01-04T18:30:00')).toBe('6:30 PM')
    expect(formatDateLong('1970-01-05T12:29:00')).toBe('12:29 PM')
  })
})

describe('format date', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    const date = new Date(1970, 0, 5, 0, 30)
    vi.setSystemTime(date)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('before more than 6 hours', () => {
    expect(formatDate('1970-01-03T00:00:00')).toBe('long ago')
    expect(formatDate('1970-01-04T18:29:00')).toBe('long ago')
  })

  test('after more than 12 hours', () => {
    expect(formatDate('1970-01-07T00:00:00')).toBe('not soon')
    expect(formatDate('1970-01-05T12:31:00')).toBe('not soon')
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatDate('1970-01-05T00:35:00')).toBe('12:35 AM')
    expect(formatDate('1970-01-05T00:25:00')).toBe('12:25 AM')
    expect(formatDate('1970-01-04T18:30:00')).toBe('6:30 PM')
    expect(formatDate('1970-01-05T12:29:00')).toBe('12:29 PM')
  })
})

describe('format date relative', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    const date = new Date(1970, 0, 5, 0, 30)
    vi.setSystemTime(date)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('before more than 6 hours', () => {
    expect(formatDateRelative('1970-01-03T00:00:00')).toBe('long ago')
    expect(formatDateRelative('1970-01-04T18:29:00')).toBe('long ago')
  })

  test('after more than 12 hours', () => {
    expect(formatDateRelative('1970-01-07T00:00:00')).toBe('not soon')
    expect(formatDateRelative('1970-01-05T12:31:00')).toBe('not soon')
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatDateRelative('1970-01-05T00:35:00')).toBe('in 5 minutes')
    expect(formatDateRelative('1970-01-05T00:25:00')).toBe('5 minutes ago')
  })

  test('after less than 5 seconds', () => {
    expect(formatDateRelative('1970-01-05T00:30:00')).toBe('in a few seconds')
  })
})

describe('differentiate entries', () => {
  const entries = [
    { id: 1, date_play: '1970-01-01T00:00', was_played: true },
    { id: 2, date_play: '1970-01-01T00:05', was_played: false },
    { id: 3, date_play: null, was_played: false },
  ]

  const { playedEntries, playingEntries, queuingEntries } =
    differentiateEntries(entries)

  test('get played', () => {
    expect(playedEntries[0]).toStrictEqual(entries[0])
  })

  test('get playing', () => {
    expect(playingEntries[0]).toStrictEqual(entries[1])
  })

  test('get queuing', () => {
    expect(queuingEntries[0]).toStrictEqual(entries[2])
  })
})

describe('get most pertinent entry', () => {
  const entries = [{ id: 1 }, { id: 2 }, { id: 3 }]

  test('get played', () => {
    expect(
      getMostPertinentEntry([entries[0]], [], [], {
        playlist_entry: { id: 99 },
      })
    ).toStrictEqual({
      entry: entries[0],
      position: 'played',
    })
  })

  test('get playing', () => {
    expect(
      getMostPertinentEntry([entries[0]], [entries[1]], [entries[2]], {
        playlist_entry: { id: 2 },
      })
    ).toStrictEqual({
      entry: entries[1],
      position: 'playing',
    })
  })

  test('get queuing', () => {
    expect(
      getMostPertinentEntry([entries[0]], [], [entries[2]], {
        playlist_entry: { id: 99 },
      })
    ).toStrictEqual({
      entry: entries[2],
      position: 'queuing',
    })
  })
})

describe('get entries hash', () => {
  test('0 on empty', () => {
    expect(getEntriesHash([])).toBe(0)
    expect(getEntriesHash([{ id: 1 }])).not.toBe(0)
  })

  test('idempotent', () => {
    const hash1 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    const hash2 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    expect(hash1).toBe(hash2)
  })

  test('unique by cardinal', () => {
    const hash1 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    const hash2 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(hash1).not.toBe(hash2)
  })

  test('unique by substitution', () => {
    const hash1 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    const hash2 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }])
    expect(hash1).not.toBe(hash2)
  })

  test('unique by permutation', () => {
    const hash1 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    const hash2 = getEntriesHash([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 3 }])
    expect(hash1).not.toBe(hash2)
  })
})
