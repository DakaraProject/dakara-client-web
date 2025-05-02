import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import UserWidget from 'components/generics/UserWidget'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { formatDate, formatDateRelative, getEntry } from 'utils'

function Playing({ entry }) {
  const playerStatus = useSelector((state) => state.playlist.playerStatus.data)

  return (
    <div className="position playing">
      <span className="icon">
        <i
          className={classNames(
            'las',
            playerStatus.paused ? 'la-pause' : 'la-play'
          )}
        ></i>
      </span>
    </div>
  )
}

Playing.propTypes = {
  entry: playlistEntryPropType,
}

function Queuing({ entry }) {
  return (
    <div className="position queueing">
      <span className="icon">
        <i className="las la-chevron-right"></i>
      </span>
      <time className="date">{formatDate(entry.date_play)}</time>
    </div>
  )
}

Queuing.propTypes = {
  entry: playlistEntryPropType,
}

function Played({ entry }) {
  return (
    <div className="position played">
      <span className="icon">
        <i className="las la-chevron-left"></i>
      </span>
      <time className="date">{formatDate(entry.date_play)}</time>
    </div>
  )
}

Played.propTypes = {
  entry: playlistEntryPropType,
}

function Position({ entry, position }) {
  switch (position) {
    case 'playing':
      return <Playing entry={entry} />

    case 'queuing':
      return <Queuing entry={entry} />

    case 'played':
      return <Played entry={entry} />

    default:
      return null
  }
}

Position.propTypes = {
  entry: playlistEntryPropType,
  position: PropTypes.string,
}

export default function PositionInPlaylist({ entries, expanded }) {
  const playerStatus = useSelector((state) => state.playlist.playerStatus.data)
  const { entry, position } = getEntry(entries, playerStatus)

  let message
  if (expanded) {
    switch (position) {
      case 'playing':
        message = (
          <span className="message">
            This song is requested by <UserWidget user={entry.owner} /> and is
            currently playing
          </span>
        )
        break

      case 'queuing':
        message = (
          <span className="message">
            This song is requested by <UserWidget user={entry.owner} /> and will
            play {formatDateRelative(entry.date_play)}
          </span>
        )
        break

      case 'played':
        message = (
          <span className="message">
            This song was requested by <UserWidget user={entry.owner} /> and
            played {formatDateRelative(entry.date_play)}
          </span>
        )
    }
  }

  return (
    <li
      className={classNames('song-status position-in-playlist info', {
        'expanded listable': expanded,
      })}
    >
      <Position entry={entry} position={position} />
      {message}
    </li>
  )
}

PositionInPlaylist.propTypes = {
  entries: PropTypes.arrayOf(playlistEntryPropType),
  expanded: PropTypes.bool,
}
