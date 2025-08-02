import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

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
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { playlistEntriesDigestStateDataPropType } from 'reducers/playlistDigest'
import { songPropType } from 'serverPropTypes/library'
import { userPropType } from 'serverPropTypes/users'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class SongEntry extends Component {
  static propTypes = {
    addSongToPlaylist: PropTypes.func.isRequired,
    clearAlteration: PropTypes.func.isRequired,
    karaokeRemainingSeconds: PropTypes.number,
    playlistEntriesDigest: playlistEntriesDigestStateDataPropType.isRequired,
    query: PropTypes.object,
    responseOfAddSong: alterationResponsePropType,
    song: songPropType.isRequired,
    user: userPropType.isRequired,
    addSongToPlaylistWithOptions: PropTypes.func.isRequired,
    responseOfAddSongWithOptions: alterationResponsePropType,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    this.props.clearAlteration('addSongToPlaylist', this.props.song.id)
    this.props.clearAlteration(
      'addSongToPlaylistWithOptions',
      this.props.song.id
    )
  }

  render() {
    const {
      karaokeRemainingSeconds,
      query,
      song,
      user,
      playlistEntriesDigest,
      searchParams,
    } = this.props
    const exceeding =
      karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration
    const canAdd = !exceeding || IsPlaylistManager.hasPermission(user)

    const expanded = parseInt(searchParams.get('expanded')) === song.id

    const extra = []
    const extraExpanded = []

    /**
     * Masked tags
     */

    if (song.tags.some((tag) => tag.disabled)) {
      extra.push(<MaskedByTag key="masked-by-tag" />)
      extraExpanded.push(<MaskedByTag key="masked-by-tag" expanded />)
    }

    /**
     * Song exceeds kara stop date
     */

    if (karaokeRemainingSeconds && karaokeRemainingSeconds < song.duration) {
      extra.push(<ExceedsKaraStopTime key="karaoke-remaining-seconds" />)
      extraExpanded.push(
        <ExceedsKaraStopTime key="karaoke-remaining-seconds" expanded />
      )
    }

    /**
     * Play queue info
     */

    const playedEntriesCurrentSong = playlistEntriesDigest.playedEntries.filter(
      (e) => e.song.id === song.id
    )
    const playingEntriesCurrentSong =
      playlistEntriesDigest.playingEntries.filter((e) => e.song.id === song.id)
    const queuingEntriesCurrentSong =
      playlistEntriesDigest.queuingEntries.filter((e) => e.song.id === song.id)
    if (
      playedEntriesCurrentSong.length > 0 ||
      playingEntriesCurrentSong.length > 0 ||
      queuingEntriesCurrentSong.length > 0
    ) {
      extra.push(
        <InPlaylist
          key="in-playlist"
          played={playedEntriesCurrentSong}
          playing={playingEntriesCurrentSong}
          queuing={queuingEntriesCurrentSong}
        />
      )
      extraExpanded.push(
        <InPlaylist
          key="in-playlist"
          played={playedEntriesCurrentSong}
          playing={playingEntriesCurrentSong}
          queuing={queuingEntriesCurrentSong}
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
              this.props.addSongToPlaylist(this.props.song.id)
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
                this.props.addSongToPlaylistWithOptions(
                  this.props.song.id,
                  /* instrumental = */ true
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
              this.props.addSongToPlaylist(this.props.song.id)
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
        alterationResponse={this.props.responseOfAddSong}
        pendingMessage="Adding…"
        successfulMessage="Successfuly added!"
        failedMessage="Error attempting to add song to playlist"
        noDisplayOnMount
        key="add-song"
      />,
      <Notification
        alterationResponse={this.props.responseOfAddSongWithOptions}
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
          <SongWidget
            song={song}
            query={query}
            noRelations
            noTags
            truncatable
          />
        ) : (
          <SongWidget song={song} query={query} truncatable />
        )}
      </ListingEntry>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  query: state.library.song.data.query,
  responseOfAddSong:
    state.alterationsResponse.multiple.addSongToPlaylist?.[ownProps.song.id],
  responseOfAddSongWithOptions:
    state.alterationsResponse.multiple.addSongToPlaylistWithOptions?.[
      ownProps.song.id
    ],
  playlistEntriesDigest: state.playlist.digest.entries.data,
  user: state.authenticatedUser,
})

SongEntry = withSearchParams(
  connect(mapStateToProps, {
    addSongToPlaylist,
    addSongToPlaylistWithOptions,
    clearAlteration,
  })(SongEntry)
)

export default SongEntry
