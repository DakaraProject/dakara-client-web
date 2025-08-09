import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

/**
 * Front parameters.
 */
export const params = {
  baseUrl: '/api',
  pollInterval: 1000,
}

/**
 * Rename the "result" key of an object.
 * @param newData Input object.
 * @param resultsKey Name to remplace the "result" key with.
 * @returns Object with replaced key.
 */
export function updateData(newData, resultsKey) {
  const { results, ...remaining } = newData
  return {
    [resultsKey]: results,
    ...remaining,
  }
}

/**
 * Smart formatting for a duration.
 * Will format a duration less than one hour as `m:ss`, and more than one hour
 * as `h:mm:ss`.
 * @param seconds Duration in seconds.
 * @returns Formatted duration.
 */
export function formatDuration(seconds) {
  const duration = dayjs.duration(seconds, 'seconds')

  // for very long durations exceeding one day, express it in hours
  if (duration.days() > 0) {
    const hours = duration.asHours().toFixed()
    return duration.format(`${hours}:mm:ss`)
  }

  // display hours only if needed
  if (duration.hours() > 0) {
    return duration.format('H:mm:ss')
  }

  // default to minutes and seconds
  return duration.format('m:ss')
}

/**
 * Smart formatting for a date.
 * Formats a date before 6 hours or after 12 hours in long form (date + time),
 * otherwise in short form (time only).
 * @param dateIso Date as a string in ISO format.
 * @returns Formatted date.
 */
export function formatDateLong(dateIso) {
  const date = dayjs(dateIso)
  const now = dayjs()

  // long format if date is before 6 hours or after 12 hours
  if (
    date.isBefore(now.subtract(6, 'hour')) ||
    date.isAfter(now.add(12, 'hour'))
  ) {
    return date.format('L LT')
  }

  // short format otherwise
  return date.format('LT')
}

/**
 * Smart formatting for a date.
 * Formats a date before 6 hours or after 12 hours as "long ago" or "not soon",
 * otherwise in short form.
 * @param dateIso Date as a string in ISO format.
 * @returns Formatted date.
 */
export function formatDate(dateIso) {
  const date = dayjs(dateIso)
  const now = dayjs()

  // long ago if date is before 6 hours
  if (date.isBefore(now.subtract(6, 'hour'))) {
    return 'long ago'
  }

  // not soon if date is after 12 hours
  if (date.isAfter(now.add(12, 'hour'))) {
    return 'not soon'
  }

  // short format otherwise
  return date.format('LT')
}

/**
 * Smart formatting for a date.
 * Formats a date before 6 hours or after 12 hours as "long ago" or "not soon",
 * otherwise in relative form.
 * @param dateIso Date as a string in ISO format.
 * @returns Formatted date.
 */
export function formatDateRelative(dateIso) {
  const date = dayjs(dateIso)
  const now = dayjs()

  // long ago if date is before one day
  if (date.isBefore(now.subtract(6, 'hour'))) {
    return 'long ago'
  }

  // not soon if date is after one day
  if (date.isAfter(now.add(12, 'hour'))) {
    return 'not soon'
  }

  // add 5 seconds to avoid displaying "will play in a few second ago" when
  // the date is within one minute
  return date.add(5, 'second').fromNow()
}

/**
 * Detect if an element or list of elements can be displayed.
 * @param item Element, or list of elements.
 * @returns `true` if the input is not falsy, or not an empty list.
 */
export function isDisplayable(item) {
  if (!item || item?.length === 0) {
    return false
  }

  return true
}

/**
 * Differentiate played, playing, and queuing entries.
 * @param entries Array of entries of any sort.
 * @returns Object of played entries, playing entries (expected to contain 0 or
 * 1 item), and queuing entries.
 */
export function differentiateEntries(entries) {
  const differentiated = Object.groupBy(entries, (e) => {
    if (e.was_played) {
      return 'playedEntries'
    }

    if (e.date_play) {
      return 'playingEntries'
    }

    return 'queuingEntries'
  })

  return {
    ...{ playedEntries: [], playingEntries: [], queuingEntries: [] },
    ...differentiated,
  }
}

/**
 * Return the most pertinent entry of a list of played, playing, and queuing
 * entries.
 * @param playedEntries Array of played entries.
 * @param playingEntries Array of currently playing entries (should be one or 0).
 * @param queuingEntries Array of queuing entries.
 * @returns Object containing the `entry` which is currently playing, or the
 * first entry which is queuing, or the last entry which was played, with the
 * `position` (`played`, `playing`, or `queuing`) as a string. Both default to
 * `null`.
 */
export function getMostPertinentEntry(
  playedEntries,
  playingEntries,
  queuingEntries
) {
  let entry
  if (playingEntries && (entry = playingEntries[0])) {
    return { entry, position: 'playing' }
  }

  if (queuingEntries && (entry = queuingEntries[0])) {
    return { entry, position: 'queuing' }
  }

  if (playedEntries && (entry = playedEntries.slice(-1)[0])) {
    return { entry, position: 'played' }
  }

  return { entry: null, position: null }
}

/**
 * Get a hash unique for a list of entries.
 * The hash should be unique by addition, by substraction, by substitution, and
 * by permutation.
 * It should be 0 only if the list of entries is empty.
 * When tested for lists of 1-50 entries with ids in the range 0-4000, this
 * implementation gave one collision about every 5e7 tries.
 * @param entries List of playlist entries. Each entry must have an `id` key.
 * @returns Hash unique to the given playlist entries.
 */
export function getEntriesHash(entries) {
  return (
    entries.reduce(
      (accumulator, entry, index) =>
        accumulator + (entry.id << (2 * index + (30 >> index))),
      0
    ) + entries.length
  )
}
