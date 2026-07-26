import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { clearAlteration } from 'actions/alterations'
import {
  addSongToPlaylist,
  addSongToPlaylistWithOptions,
} from 'actions/playlist'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import NotificationBar from 'components/generics/NotificationBar'
import ExceedsKaraStopTime from 'components/library/status/ExceedsKaraStopTime'
import InPlaylist from 'components/library/status/InPlaylist'
import MaskedByTag from 'components/library/status/MaskedByTag'
import SongWidget from 'components/library/widgets/Song'
import SongExpandedWidget from 'components/library/widgets/SongExpanded'
import { CanAddToPlaylist } from 'permissions/components/Playlist'
import { isPlaylistManager } from 'permissions/playlist'
import { songPropType } from 'serverPropTypes/library'

export default function SongEntry({ song, karaokeRemainingSeconds, ...rest }) {
  const query = useSelector((state) => state.library.song.data.query)
  const responseOfAddSong = useSelector(
    (state) => state.alterationsResponse.multiple.addSongToPlaylist?.[song.id]
  )
  const responseOfAddSongWithOptions = useSelector(
    (state) =>
      state.alterationsResponse.multiple.addSongToPlaylistWithOptions?.[song.id]
  )
  const playlistEntriesDigestData = useSelector(
    (state) => state.playlist.digest.entries.data
  )
  const user = useSelector((state) => state.authenticatedUser)
  const karaoke = useSelector((state) => state.playlist.karaoke.data)

  const [searchParams, _] = useSearchParams()

  const dispatch = useDispatch()

  const clearNotificationAlterations = useCallback(
    () => {
      dispatch(clearAlteration('addSongToPlaylist', song.id))
      dispatch(clearAlteration('addSongToPlaylistWithOptions', song.id))
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [song.id]
  )

  useEffect(
    () => () => {
      // clear alterations when component unmounts
      clearNotificationAlterations()
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    []
  )

  const isExceeding =
    karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration
  const canAdd = !isExceeding || isPlaylistManager(user)

  const isExpanded = parseInt(searchParams.get('expanded')) === song.id

  const extra = []
  const extraExpanded = []

  // masked tags
  if (song.tags.some((tag) => tag.disabled)) {
    extra.push(<MaskedByTag key="masked-by-tag" />)
    extraExpanded.push(<MaskedByTag key="masked-by-tag" expanded />)
  }

  // song exceeds kara stop date
  if (isExceeding) {
    extra.push(<ExceedsKaraStopTime key="karaoke-remaining-seconds" />)
    extraExpanded.push(
      <ExceedsKaraStopTime key="karaoke-remaining-seconds" expanded />
    )
  }

  // play queue info
  const playedEntriesThisSong = playlistEntriesDigestData.playedEntries.filter(
    (e) => e.song.id === song.id
  )
  const playingEntriesThisSong =
    playlistEntriesDigestData.playingEntries.filter(
      (e) => e.song.id === song.id
    )
  const queuingEntriesThisSong =
    playlistEntriesDigestData.queuingEntries.filter(
      (e) => e.song.id === song.id
    )
  if (
    playedEntriesThisSong.length > 0 ||
    playingEntriesThisSong.length > 0 ||
    queuingEntriesThisSong.length > 0
  ) {
    extra.push(
      <InPlaylist
        key="in-playlist"
        playedEntries={playedEntriesThisSong}
        playingEntries={playingEntriesThisSong}
        queuingEntries={queuingEntriesThisSong}
      />
    )
    extraExpanded.push(
      <InPlaylist
        key="in-playlist"
        playedEntries={playedEntriesThisSong}
        playingEntries={playingEntriesThisSong}
        queuingEntries={queuingEntriesThisSong}
        expanded
      />
    )
  }

  const controls = (
    <CanAddToPlaylist user={user} karaoke={karaoke} key="add-to-playlist">
      <button
        disabled={!canAdd}
        className="control square primary"
        onClick={() => {
          dispatch(addSongToPlaylist(song.id))
        }}
      >
        <span className="icon">
          <i className="las la-plus"></i>
        </span>
      </button>
    </CanAddToPlaylist>
  )

  const controlsExpanded = (
    <CanAddToPlaylist user={user} karaoke={karaoke} key="add-to-playlist">
      {song.has_instrumental && (
        <button
          disabled={!canAdd}
          className="control primary"
          onClick={() => {
            dispatch(
              addSongToPlaylistWithOptions(song.id, /* instrumental = */ true)
            )
          }}
        >
          <span className="icon ">
            <i className="las la-plus"></i>
          </span>
          <span className="text">Add instrumental</span>
        </button>
      )}
      <button
        disabled={!canAdd}
        className="control square primary"
        onClick={() => {
          dispatch(addSongToPlaylist(song.id))
        }}
      >
        <span className="icon">
          <i className="las la-plus"></i>
        </span>
      </button>
    </CanAddToPlaylist>
  )

  const notifications = [
    <NotificationBar
      alterationResponse={responseOfAddSong}
      pendingMessage="Adding…"
      successfulMessage="Successfuly added!"
      failedMessage="Error attempting to add song to playlist"
      noDisplayOnMount
      key="add-song"
    />,
    <NotificationBar
      alterationResponse={responseOfAddSongWithOptions}
      pendingMessage="Adding with options…"
      successfulMessage="Successfuly added with options!"
      failedMessage="Error attempting to add song to playlist with options"
      noDisplayOnMount
      key="add-song-with-options"
    />,
  ]

  const entryExpanded = (
    <ListingEntryExpanded
      extra={extraExpanded}
      controls={controlsExpanded}
      notifications={notifications}
    >
      <SongExpandedWidget song={song} query={query} />
    </ListingEntryExpanded>
  )

  return (
    <ListingEntry
      id={song.id}
      extra={extra}
      controls={controls}
      notifications={notifications}
      entryExpanded={entryExpanded}
      onToggle={clearNotificationAlterations}
      {...rest}
    >
      {isExpanded ? (
        <SongWidget song={song} query={query} noRelations noTags truncatable />
      ) : (
        <SongWidget song={song} query={query} truncatable />
      )}
    </ListingEntry>
  )
}

SongEntry.propTypes = {
  karaokeRemainingSeconds: PropTypes.number,
  song: songPropType.isRequired,
}
