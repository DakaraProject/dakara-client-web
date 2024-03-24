import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

/**
 * Front parameters.
 */
export const params = {
    baseUrl: '/api',
    pollInterval: 1000
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
 * Smart formating for a duration.
 * Will format a duration less than one hour as m:ss, and more than one hour as
 * h:mm:ss.
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
 * Find an element in an array starting from the bottom.
 * See: https://stackoverflow.com/a/64445124/4584444
 * @param array Array of elements.
 * @param fn Function to evaluate on array elements.
 * @returns Element of the array where `fn` returns true.
 */
export function findLast(array, fn) {
    for(let i = array.length - 1; i >= 0; i--) {
        if(fn(array[i], i, array)) return array[i];
    }
    return null
}
