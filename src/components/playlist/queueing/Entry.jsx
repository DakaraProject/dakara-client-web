import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import ConfirmationBar from 'components/generics/ConfirmationBar'
import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import Notification from 'components/generics/Notification'
import PlaylistEntryWidget from 'components/playlist/PlaylistEntryWidget'
import {
  IsPlaylistManager,
  IsPlaylistManagerOrOwner,
} from 'permissions/Playlist'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import {
  withNavigate,
  withSearchParams,
} from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'
import { formatDateLong } from 'utils'

class Entry extends Component {
  static propTypes = {
    clearAlteration: PropTypes.func.isRequired,
    entry: playlistEntryPropType.isRequired,
    navigate: PropTypes.func.isRequired,
    onReorderButtonClick: PropTypes.func.isRequired,
    playlistEntriesDigest: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    positions: PropTypes.shape({
      position: PropTypes.number.isRequired,
      firstId: PropTypes.number,
      lastId: PropTypes.number,
      isFirstPage: PropTypes.bool,
      isLastPage: PropTypes.bool,
    }).isRequired,
    removeEntry: PropTypes.func.isRequired,
    reorderEntryPosition: PropTypes.number,
    responseOfMultipleReorderPlaylistEntry: PropTypes.object,
    responseOfRemoveEntry: alterationResponsePropType,
    responseOfReorderPlaylistEntry: alterationResponsePropType,
  }

  state = {
    confirmDisplayed: false,
  }

  componentWillUnmount() {
    this.props.clearAlteration('removeEntryFromPlaylist', this.props.entry.id)
    this.props.clearAlteration('reorderPlaylistEntry', this.props.entry.id)
  }

  displayConfirm = () => {
    this.setState({ confirmDisplayed: true })
  }

  clearConfirm = () => {
    this.setState({ confirmDisplayed: false })
  }

  handleSearch = () => {
    const song = this.props.entry.song
    const query = `title:""${song.title}""`
    this.props.navigate({
      pathname: '/library/song',
      search: queryString.stringify({
        query,
        expanded: song.id,
      }),
    })
  }

  render() {
    const {
      entry,
      onReorderButtonClick,
      positions,
      reorderEntryPosition,
      playlistEntriesDigest,
      ...rest
    } = this.props

    /**
     * Reorder buttons
     */
    const createReorderButton = (id, iconName, extraClassName = '') => (
      <button
        className="control square primary"
        onClick={() => {
          onReorderButtonClick(id)
        }}
      >
        <span className="icon">
          <i className={`las la-${iconName} ${extraClassName}`}></i>
        </span>
      </button>
    )
    let reorderButton
    let reorderExtraButtons
    if (reorderEntryPosition !== null) {
      // if in reorder mode, display icon depending on the relative
      // position of the current entry and the entry to reorder
      if (reorderEntryPosition > positions.position) {
        reorderButton = createReorderButton(entry.id, 'arrow-up')
      } else if (reorderEntryPosition < positions.position) {
        reorderButton = createReorderButton(entry.id, 'arrow-down')
      } else {
        reorderButton = createReorderButton(entry.id, 'ban')
        reorderExtraButtons = (
          <>
            {createReorderButton(positions.firstId, 'arrow-up', 'overbar')}
            {createReorderButton(positions.lastId, 'arrow-down', 'underbar')}
          </>
        )
      }
    } else {
      // if not in reorder mode, display reorder icon
      reorderButton = createReorderButton(entry.id, 'arrows-alt-v')
    }

    const controlsExpanded = [
      <button
        key="search"
        className="control primary"
        onClick={this.handleSearch}
      >
        Search song
      </button>,
      <IsPlaylistManagerOrOwner key="remove" object={entry} disable>
        <button className="control warning" onClick={this.displayConfirm}>
          Remove from playlist
        </button>
      </IsPlaylistManagerOrOwner>,
    ]

    const controls = [
      <IsPlaylistManager key="reorder">
        <CSSTransitionLazy
          in={!!reorderExtraButtons}
          classNames="displayed"
          timeout={{
            enter: 3000,
            exit: 1500,
          }}
        >
          <div className="reorder">{reorderExtraButtons}</div>
        </CSSTransitionLazy>
        {reorderButton}
      </IsPlaylistManager>,
      <button
        key="search"
        className="control square primary"
        onClick={this.handleSearch}
      >
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>,
      <IsPlaylistManagerOrOwner key="remove" object={entry} disable>
        <button
          className="control square warning"
          onClick={this.displayConfirm}
        >
          <span className="icon">
            <i className="las la-trash"></i>
          </span>
        </button>
      </IsPlaylistManagerOrOwner>,
    ]

    const notifications = [
      <CSSTransitionLazy
        key="remove"
        in={this.state.confirmDisplayed}
        classNames="notified"
        timeout={{
          enter: 300,
          exit: 150,
        }}
      >
        <ConfirmationBar
          onConfirm={() => {
            this.props.removeEntry(entry.id)
          }}
          onCancel={this.clearConfirm}
        />
      </CSSTransitionLazy>,
      <Notification
        key="response-of-remove-entry"
        alterationResponse={this.props.responseOfRemoveEntry}
        pendingMessage="Removing…"
        successfulMessage="Successfuly removed!"
        successfulDuration={null}
        failedMessage="Error attempting to remove song from playlist"
      />,
      <Notification
        key="response-of-reorder-playlist-entry"
        alterationResponse={this.props.responseOfReorderPlaylistEntry}
        pendingMessage={false}
        successfulMessage={false}
        failedMessage="Error attempting to reorder playlist"
      />,
    ]

    const playlistEntryDigest = playlistEntriesDigest.find(
      (e) => e.id === entry.id
    )

    const entryExpanded = (
      <ListingEntryExpanded
        controls={controlsExpanded}
        notifications={notifications}
      >
        <Details>
          <DetailText icon="la-user" name="For">
            {entry.owner.username}
          </DetailText>
          {entry.use_instrumental && (
            <DetailText icon="la-microphone-slash" name="Instrumental">
              Yes
            </DetailText>
          )}
          <DetailText icon="la-clock" name="Requested at">
            {formatDateLong(entry.date_created)}
          </DetailText>
          {playlistEntryDigest && (
            <DetailText icon="la-clock" name="Should play at">
              {formatDateLong(playlistEntryDigest.date_play)}
            </DetailText>
          )}
        </Details>
      </ListingEntryExpanded>
    )

    return (
      <ListingEntry
        id={entry.id}
        controls={controls}
        notifications={notifications}
        entryExpanded={entryExpanded}
        {...rest}
      >
        <PlaylistEntryWidget entry={entry} truncatable />
      </ListingEntry>
    )
  }
}

const mapStateToProps = (state) => ({
  playlistEntriesDigest: state.playlist.digest.entries.data.playlistEntries,
})

Entry = withSearchParams(withNavigate(connect(mapStateToProps, {})(Entry)))

export default Entry
