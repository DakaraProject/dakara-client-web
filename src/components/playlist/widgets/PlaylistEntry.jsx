import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import UserWidget from 'components/generics/UserWidget'
import SongWidget from 'components/library/widgets/Song'
import { formatDateRelative } from 'utils'

export default function PlaylistEntryWidget({
  entry,
  truncatable,
  noOwner,
  noInstrumental,
  noRelativeDate,
}) {
  /**
   * Instrumental
   */

  let instrumental
  if (entry.use_instrumental && !noInstrumental) {
    instrumental = (
      <span className="instrumental">
        <span className="icon">
          <i className="las la-microphone-slash"></i>
        </span>
      </span>
    )
  }

  /**
   * Relative date of play
   */

  let relativeDate
  const playlistEntriesDigest = useSelector(
    (state) => state.playlist.digest.entries.data.playlistEntries
  )
  if (!noRelativeDate) {
    const playlistEntry = playlistEntriesDigest.find((e) => e.id === entry.id)
    relativeDate = (
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
    )
  }

  return (
    <div className={classNames('playlist-entry-widget', { truncatable })}>
      <SongWidget song={entry.song} noRelations noDuration noTags truncatable />
      {!noOwner && <UserWidget user={entry.owner} truncatable />}
      {instrumental}
      {relativeDate}
    </div>
  )
}

PlaylistEntryWidget.propTypes = {
  entry: PropTypes.object.isRequired,
  truncatable: PropTypes.bool,
  noOwner: PropTypes.bool,
  noInstrumental: PropTypes.bool,
  noRelativeDate: PropTypes.bool,
}
