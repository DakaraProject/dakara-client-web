import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const params = {
    baseUrl: "/api",
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
    const duration = dayjs.duration(seconds, "seconds")

    // for very long durations exceeding one day, express it in hours
    if (duration.days() > 0) {
        const hours = duration.asHours().toFixed()
        return duration.format(`${hours}:mm:ss`)
    }

    // display hours only if needed
    if (duration.hours() > 0) {
        return duration.format("H:mm:ss")
    }

    // default to minutes and seconds
    return duration.format("m:ss")
}

/**
 * Merge current date with the provided time.
 * @param timeString Formated time as hh:mm.
 * @returns Date object.
 */
export function mergeTime(timeString) {
    if (!/^\d{1,2}:\d{1,2}$/.test(timeString)) {
        throw new Error("Invalid time format")
    }

    let date = dayjs()
    const time = timeString.split(":")
    date = date.set('hours', time[0])
    date = date.set('minutes', time[1])
    date = date.set('seconds', 0)
    return date
}
