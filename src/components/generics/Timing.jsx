import PropTypes from 'prop-types'

import {
  formatDuration,
  formatTime,
  formatDateTime,
  formatTimeRelative,
} from 'utils'

export function Duration({ duration }) {
  const [iso, hhmm, ss] = formatDuration(duration)

  return (
    <time className="timing duration" dateTime={iso}>
      {hhmm}
      <span className="seconds">{ss}</span>
    </time>
  )
}

Duration.propTypes = {
  duration: PropTypes.string.isRequired,
}

export function Time({ iso }) {
  const date = formatTime(iso)

  return (
    <time className="timing time" dateTime={iso}>
      {date}
    </time>
  )
}

Time.propTypes = {
  iso: PropTypes.string.isRequired,
}

export function DateTime({ iso, showSeconds = false }) {
  const [date, ss] = formatDateTime(iso, showSeconds)

  return (
    <time className="timing date-time" dateTime={iso}>
      {date}
      {showSeconds && <span className="seconds">{ss}</span>}
    </time>
  )
}

DateTime.propTypes = {
  iso: PropTypes.string.isRequired,
  showSeconds: PropTypes.bool,
}

export function TimeRelative({
  iso,
  relativeToIso,
  withoutSuffix = false,
  withoutTimeTruncate = false,
}) {
  const date = formatTimeRelative(
    iso,
    relativeToIso,
    withoutSuffix,
    withoutTimeTruncate
  )

  return (
    <time className="timing time-relative" dateTime={iso}>
      {date}
    </time>
  )
}

TimeRelative.propTypes = {
  iso: PropTypes.string.isRequired,
  relativeToIso: PropTypes.string,
  withoutSuffix: PropTypes.bool,
  withoutTimeTruncate: PropTypes.bool,
}
