import PropTypes from 'prop-types'
import { useEffect } from 'react'
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
import Notification from 'components/generics/Notification'
import ExceedsKaraStopTime from 'components/library/status/ExceedsKaraStopTime'
import InPlaylist from 'components/library/status/InPlaylist'
import MaskedByTag from 'components/library/status/MaskedByTag'
import SongWidget from 'components/library/widgets/Song'
import SongExpandedWidget from 'components/library/widgets/SongExpanded'
import {
  CanAddToPlaylist,
  IsPlaylistManager,
  IsPlaylistUser,
} from 'permissions/Playlist'
import { songPropType } from 'serverPropTypes/library'

export default function SongEntry({ song, karaokeRemainingSeconds }) {
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

  const [searchParams, _] = useSearchParams()

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      // clear alterations when component unmounts
      dispatch(clearAlteration('addSongToPlaylist', song.id))
      dispatch(clearAlteration('addSongToPlaylistWithOptions', song.id))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const exceeding =
    karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration
  const canAdd = !exceeding || IsPlaylistManager.hasPermission(user)

  const expanded = parseInt(searchParams.get('expanded')) === song.id

  const extra = []
  const extraExpanded = []

  // masked tags
  if (song.tags.some((tag) => tag.disabled)) {
    extra.push(<MaskedByTag key="masked-by-tag" />)
    extraExpanded.push(<MaskedByTag key="masked-by-tag" expanded />)
  }

  // song exceeds kara stop date
  if (karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration) {
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
    <CanAddToPlaylist>
      <IsPlaylistUser>
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
      </IsPlaylistUser>
    </CanAddToPlaylist>
  )

  const controlsExpanded = (
    <CanAddToPlaylist key="add-to-playlist">
      <IsPlaylistUser>
        {song.has_instrumental && (
          <button
            disabled={!canAdd}
            className="control square primary"
            onClick={() => {
              dispatch(
                addSongToPlaylistWithOptions(song.id, /* instrumental = */ true)
              )
            }}
          >
            <span className="icon with-sub-icon">
              <i className="las la-plus"></i>
              <span className="sub-icon top-right">
                <i className="las la-microphone-slash"></i>
              </span>
            </span>
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
      </IsPlaylistUser>
    </CanAddToPlaylist>
  )

  const notifications = [
    <Notification
      alterationResponse={responseOfAddSong}
      pendingMessage="Adding…"
      successfulMessage="Successfuly added!"
      failedMessage="Error attempting to add song to playlist"
      noDisplayOnMount
      key="add-song"
    />,
    <Notification
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
    >
      {expanded ? (
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
