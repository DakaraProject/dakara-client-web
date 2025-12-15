import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

import UserWidget from 'components/user/widgets/User'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { formatDate, formatDateRelative, getMostPertinentEntry } from 'utils'

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
    <div className="position queuing">
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

export default function InPlaylist({
  playedEntries,
  playingEntries,
  queuingEntries,
  expanded,
}) {
  const playerStatus = useSelector((state) => state.playlist.playerStatus.data)
  const { entry, position } = getMostPertinentEntry(
    playedEntries,
    playingEntries,
    queuingEntries
  )

  let main
  let message
  switch (position) {
    case 'playing':
      main = <Playing entry={entry} />
      if (expanded) {
        if (playerStatus.paused) {
          message = (
            <div className="message">
              This song is requested by <UserWidget user={entry.owner} /> and is
              currently on pause
            </div>
          )
        } else {
          message = (
            <div className="message">
              This song is requested by <UserWidget user={entry.owner} /> and is
              currently playing
            </div>
          )
        }
      }
      break

    case 'queuing':
      main = <Queuing entry={entry} />
      if (expanded) {
        message = (
          <div className="message">
            This song is requested by <UserWidget user={entry.owner} /> and{' '}
            <Link
              to={{
                pathname: '/playlist/queuing',
                search: queryString.stringify({
                  query: `id:""${entry.id}""`,
                  expanded: entry.id,
                }),
              }}
            >
              will play
            </Link>{' '}
            {formatDateRelative(entry.date_play)}
          </div>
        )
      }
      break

    case 'played':
      main = <Played entry={entry} />
      if (expanded) {
        message = (
          <div className="message">
            This song was requested by <UserWidget user={entry.owner} /> and{' '}
            <Link
              to={{
                pathname: '/playlist/played',
                search: queryString.stringify({
                  query: `id:""${entry.id}""`,
                  expanded: entry.id,
                }),
              }}
            >
              played
            </Link>{' '}
            {formatDateRelative(entry.date_play)}
          </div>
        )
      }
  }

  return (
    <li
      className={classNames('status in-playlist info', {
        'expanded listable': expanded,
      })}
    >
      {main}
      {message}
    </li>
  )
}

InPlaylist.propTypes = {
  playedEntries: PropTypes.arrayOf(playlistEntryPropType),
  playingEntries: PropTypes.arrayOf(playlistEntryPropType),
  queuingEntries: PropTypes.arrayOf(playlistEntryPropType),
  expanded: PropTypes.bool,
}
