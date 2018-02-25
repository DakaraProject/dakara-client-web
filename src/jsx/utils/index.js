import { sprintf } from 'sprintf-js'

export function formatHourTime(timestamp) {
    let date = new Date(timestamp)
    return sprintf("%02d:%02d",date.getHours(), date.getMinutes())
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
