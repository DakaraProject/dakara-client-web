import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  formatDate,
  formatDateLong,
  formatDateRelative,
  formatDuration,
  getEntriesHash,
  getEntry,
  getEntryPlayed,
  getEntryPlaying,
  getEntryQueuing,
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

describe('get playing', () => {
  test('nothing if no status', () => {
    expect(getEntryPlaying([{ id: 1 }], { playlist_entry: null })).toBeFalsy()
  })

  test('entry if found', () => {
    expect(
      getEntryPlaying([{ id: 1 }, { id: 2 }, { id: 3 }], {
        playlist_entry: { id: 2 },
      })
    ).toStrictEqual({ id: 2 })
  })

  test('nothing if not found', () => {
    expect(
      getEntryPlaying([{ id: 1 }, { id: 2 }, { id: 3 }], {
        playlist_entry: { id: 4 },
      })
    ).toBeFalsy()
  })
})

describe('get queuing', () => {
  test('entry if found', () => {
    expect(
      getEntryQueuing([
        { id: 1, will_play: false },
        { id: 2, will_play: true },
        { id: 3, will_play: false },
      ])
    ).toStrictEqual({ id: 2, will_play: true })
  })

  test('nothing if not found', () => {
    expect(
      getEntryQueuing([
        { id: 1, will_play: false },
        { id: 2, will_play: false },
        { id: 3, will_play: false },
      ])
    ).toBeFalsy()
  })
})

describe('get played', () => {
  test('entry if found', () => {
    expect(
      getEntryPlayed([
        { id: 1, was_played: false },
        { id: 2, was_played: true },
        { id: 3, was_played: false },
      ])
    ).toStrictEqual({ id: 2, was_played: true })
  })

  test('nothing if not found', () => {
    expect(
      getEntryPlayed([
        { id: 1, was_played: false },
        { id: 2, was_played: false },
        { id: 3, was_played: false },
      ])
    ).toBeFalsy()
  })
})

describe('get entry', () => {
  const entries = [
    { id: 1, will_play: false, was_played: true },
    { id: 2, will_play: true, was_played: false },
    { id: 3, will_play: true, was_played: false },
  ]

  test('get playing', () => {
    expect(getEntry(entries, { playlist_entry: { id: 3 } })).toStrictEqual({
      entry: entries[2],
      position: 'playing',
    })
  })

  test('get queuing', () => {
    expect(
      getEntry([entries[0], entries[1]], { playlist_entry: { id: 3 } })
    ).toStrictEqual({
      entry: entries[1],
      position: 'queuing',
    })
  })

  test('get played', () => {
    expect(getEntry([entries[0]], { playlist_entry: { id: 3 } })).toStrictEqual(
      {
        entry: entries[0],
        position: 'played',
      }
    )
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
