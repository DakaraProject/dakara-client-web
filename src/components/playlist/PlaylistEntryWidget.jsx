import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import UserWidget from 'components/generics/UserWidget'
import SongWidget from 'components/song/SongWidget'
import { formatDateRelative } from 'utils'

export default function PlaylistEntryWidget({ entry, truncatable }) {
  /**
   * Instrumental
   */
  let instrumental
  if (entry.use_instrumental) {
    instrumental = (
      <span className="instrumental">
        <span className="icon">
          <i className="las la-microphone-slash"></i>
        </span>
      </span>
    )
  }

  const playlistEntries = useSelector(
    (state) => state.playlist.digest.entries.data.playlistEntries
  )
  const playlistEntry = playlistEntries.find((e) => e.id === entry.id)

  return (
    <div className={classNames('playlist-entry-widget', { truncatable })}>
      <SongWidget song={entry.song} noRelations noDuration noTags truncatable />
      <UserWidget user={entry.owner} truncatable />
      {instrumental}
      <span className="relative-date">
        <span className="icon">
          <i className="las la-clock"></i>
        </span>
        {playlistEntry && (
          <time className="date">
            {formatDateRelative(playlistEntry.date_play)}
          </time>
        )}
      </span>
    </div>
  )
}

PlaylistEntryWidget.propTypes = {
  entry: PropTypes.object.isRequired,
  truncatable: PropTypes.bool,
}
