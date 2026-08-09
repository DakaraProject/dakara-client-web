import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  differentiateEntries,
  formatTime,
  formatDateTime,
  formatTimeRelative,
  formatDuration,
  getEntriesHash,
  getMostPertinentEntry,
  getParentURL,
} from '.'

describe('format duration', () => {
  test('more than one day', () => {
    expect(formatDuration(25 * 3600)).toStrictEqual(['P1DT1H', '25:00', ':00'])
  })

  test('more than one hour', () => {
    expect(formatDuration(3600 + 20)).toStrictEqual(['PT1H20S', '1:00', ':20'])
  })

  test('less than one hour', () => {
    expect(formatDuration(2 * 60 + 40)).toStrictEqual(['PT2M40S', '2', ':40'])
  })

  test('less than one minute', () => {
    expect(formatDuration(40)).toStrictEqual(['PT40S', '0', ':40'])
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
    expect(formatDateTime('1970-01-03T00:00:10')).toStrictEqual([
      '1970-01-03 00:00',
      null,
    ])
    expect(formatDateTime('1970-01-04T18:29:10')).toStrictEqual([
      '1970-01-04 18:29',
      null,
    ])
    expect(formatDateTime('1970-01-03T00:00:10', true)).toStrictEqual([
      '1970-01-03 00:00',
      ':10',
    ])
    expect(formatDateTime('1970-01-04T18:29:10', true)).toStrictEqual([
      '1970-01-04 18:29',
      ':10',
    ])
  })

  test('after more than 12 hours', () => {
    expect(formatDateTime('1970-01-07T00:00:10')).toStrictEqual([
      '1970-01-07 00:00',
      null,
    ])
    expect(formatDateTime('1970-01-05T12:31:10')).toStrictEqual([
      '1970-01-05 12:31',
      null,
    ])
    expect(formatDateTime('1970-01-07T00:00:10', true)).toStrictEqual([
      '1970-01-07 00:00',
      ':10',
    ])
    expect(formatDateTime('1970-01-05T12:31:10', true)).toStrictEqual([
      '1970-01-05 12:31',
      ':10',
    ])
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatDateTime('1970-01-05T00:35:10')).toStrictEqual(['00:35', null])
    expect(formatDateTime('1970-01-05T00:25:10')).toStrictEqual(['00:25', null])
    expect(formatDateTime('1970-01-04T18:30:10')).toStrictEqual(['18:30', null])
    expect(formatDateTime('1970-01-05T12:29:10')).toStrictEqual(['12:29', null])
    expect(formatDateTime('1970-01-05T00:35:10', true)).toStrictEqual([
      '00:35',
      ':10',
    ])
    expect(formatDateTime('1970-01-05T00:25:10', true)).toStrictEqual([
      '00:25',
      ':10',
    ])
    expect(formatDateTime('1970-01-04T18:30:10', true)).toStrictEqual([
      '18:30',
      ':10',
    ])
    expect(formatDateTime('1970-01-05T12:29:10', true)).toStrictEqual([
      '12:29',
      ':10',
    ])
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
    expect(formatTime('1970-01-03T00:00:00')).toBe('long ago')
    expect(formatTime('1970-01-04T18:29:00')).toBe('long ago')
  })

  test('after more than 12 hours', () => {
    expect(formatTime('1970-01-07T00:00:00')).toBe('not soon')
    expect(formatTime('1970-01-05T12:31:00')).toBe('not soon')
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatTime('1970-01-05T00:35:00')).toBe('00:35')
    expect(formatTime('1970-01-05T00:25:00')).toBe('00:25')
    expect(formatTime('1970-01-04T18:30:00')).toBe('18:30')
    expect(formatTime('1970-01-05T12:29:00')).toBe('12:29')
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
    expect(formatTimeRelative('1970-01-03T00:00:00')).toBe('long ago')
    expect(formatTimeRelative('1970-01-04T18:29:00')).toBe('long ago')
  })

  test('after more than 12 hours', () => {
    expect(formatTimeRelative('1970-01-07T00:00:00')).toBe('not soon')
    expect(formatTimeRelative('1970-01-05T12:31:00')).toBe('not soon')
  })

  test('before less than 6 hours and after less than 12 hours', () => {
    expect(formatTimeRelative('1970-01-05T00:35:00')).toBe('in 5 minutes')
    expect(formatTimeRelative('1970-01-05T00:25:00')).toBe('5 minutes ago')
  })

  test('after less than 5 seconds', () => {
    expect(formatTimeRelative('1970-01-05T00:30:00')).toBe('in a few seconds')
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
    expect(getMostPertinentEntry([entries[0]], [], [])).toStrictEqual({
      entry: entries[0],
      position: 'played',
    })

    expect(
      getMostPertinentEntry([entries[0]], undefined, undefined)
    ).toStrictEqual({
      entry: entries[0],
      position: 'played',
    })
  })

  test('get playing', () => {
    expect(
      getMostPertinentEntry([entries[0]], [entries[1]], [entries[2]])
    ).toStrictEqual({
      entry: entries[1],
      position: 'playing',
    })
  })

  test('get queuing', () => {
    expect(getMostPertinentEntry([entries[0]], [], [entries[2]])).toStrictEqual(
      {
        entry: entries[2],
        position: 'queuing',
      }
    )

    expect(
      getMostPertinentEntry([entries[0]], undefined, [entries[2]])
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

describe('get parent URL', () => {
  test('regular URL', () => {
    expect(getParentURL('/aa/bb/cc')).toBe('/aa/bb')
  })

  test('slash trailing URL', () => {
    expect(getParentURL('/aa/bb/cc/')).toBe('/aa/bb')
  })

  test('root URL', () => {
    expect(getParentURL('/')).toBe('/')
  })
})
