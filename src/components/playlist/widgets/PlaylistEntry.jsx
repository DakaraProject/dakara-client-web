import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import SongWidget from 'components/library/widgets/Song'
import UserWidget from 'components/user/widgets/User'
import { formatDateRelative } from 'utils'

export default function PlaylistEntryWidget({
  entry,
  query,
  truncatable,
  noOwner,
  noInstrumental,
  noRelativeDate,
  songProps,
  userProps,
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
    (state) => state.playlist.digest.entries.data
  )
  if (!noRelativeDate) {
    const playlistEntry = getEntry(playlistEntriesDigest, entry.id)
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
      <SongWidget
        song={entry.song}
        query={query}
        noRelations
        noDuration
        noTags
        truncatable
        {...songProps}
      />
      {!noOwner && (
        <UserWidget
          user={entry.owner}
          query={query}
          truncatable
          {...userProps}
        />
      )}
      {instrumental}
      {relativeDate}
    </div>
  )
}

PlaylistEntryWidget.propTypes = {
  entry: PropTypes.object.isRequired,
  query: PropTypes.object,
  truncatable: PropTypes.bool,
  noOwner: PropTypes.bool,
  noInstrumental: PropTypes.bool,
  noRelativeDate: PropTypes.bool,
  songProps: PropTypes.object,
  userProps: PropTypes.object,
}

/**
 * Get a playlist entry digest for the given playlist entry ID.
 * @param digest Digest playlist entries.
 * @param id ID of the playlist entry of interest.
 * @returns Playlist entry digest with the same ID.
 */
function getEntry(digest, id) {
  let entry
  if ((entry = digest.queuingEntries.find((e) => e.id == id))) {
    return entry
  }

  if ((entry = digest.playedEntries.find((e) => e.id == id))) {
    return entry
  }

  if ((entry = digest.playingEntries.find((e) => e.id == id))) {
    return entry
  }

  return null
}
