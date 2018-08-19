import { sprintf } from 'sprintf-js'
import dayjs from 'dayjs'

export function formatHourTime(timestamp) {
    return dayjs(timestamp).format('HH:mm')
}

export function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600)
    let remaining = seconds % 3600
    let minsec = sprintf("%02d:%02d", Math.floor(remaining / 60), remaining % 60)
    return (hours == 0 ? '' : (hours + ":")) + minsec
}

export function formatDuration(seconds) {
    let hours = Math.floor(seconds / 3600)
    let remaining = seconds % 3600
    let minsec = sprintf("%01d:%02d", Math.floor(remaining / 60), remaining % 60)
    return (hours == 0 ? '' : (hours + ":")) + minsec
}

export const params = {
    baseUrl: "/api/",
    pollInterval: 1000
}

export function updateData(newData, resultsKey) {
    const { results, ...remaining } = newData
    return {
        [resultsKey]: results,
        ...remaining,
    }
}

export function parseTime(timeString) {
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
