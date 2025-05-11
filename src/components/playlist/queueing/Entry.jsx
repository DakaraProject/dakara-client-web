import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import { removeEntryFromPlaylist, reorderPlaylistEntry } from 'actions/playlist'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import { Details, DetailText } from 'components/generics/Details'
import {
  ListingEntry,
  ListingEntryExpanded,
} from 'components/generics/listing/Entry'
import Notification from 'components/generics/Notification'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
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
    reorderPlaylistEntry: PropTypes.func.isRequired,
    playlistEntriesDigest: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    positions: PropTypes.shape({
      position: PropTypes.number.isRequired,
      firstId: PropTypes.number,
      lastId: PropTypes.number,
      isFirstPage: PropTypes.bool,
      isLastPage: PropTypes.bool,
    }).isRequired,
    removeEntryFromPlaylist: PropTypes.func.isRequired,
    responseOfRemoveEntry: alterationResponsePropType,
    responseOfReorderPlaylistEntry: alterationResponsePropType,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
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

  handleReorderUp = (reorderId) => {
    const currentId = this.props.entry.id

    // return early if missing data
    if (!reorderId) {
      return
    }

    // reorder up
    this.props.reorderPlaylistEntry({
      playlistEntryId: reorderId,
      beforeId: currentId,
    })

    // clean reorder mode
    this.cancelReorder()
  }

  handleReorderDown = (reorderId) => {
    const currentId = this.props.entry.id

    // return early if missing data
    if (!reorderId) {
      return
    }

    // reorder down
    this.props.reorderPlaylistEntry({
      playlistEntryId: reorderId,
      afterId: currentId,
    })

    // clean reorder mode
    this.cancelReorder()
  }

  handleReorderFirst = () => {
    // reorder on top of playlist
    this.props.reorderPlaylistEntry({
      playlistEntryId: this.props.entry.id,
      beforeId: this.props.positions.firstId,
    })

    // clean reorder mode
    this.cancelReorder()
  }

  handleReorderLast = () => {
    // reorder on bottom of playlist
    this.props.reorderPlaylistEntry({
      playlistEntryId: this.props.entry.id,
      afterId: this.props.positions.lastId,
    })

    // clean reorder mode
    this.cancelReorder()
  }

  handleReorderToggle = () => {
    // if called in reorder mode, clean reorder mode
    if (this.props.searchParams.has('reorder')) {
      this.cancelReorder()

      return
    }

    // otherwise, enter reorder mode
    this.props.searchParams.append('reorder', this.props.positions.position)
    this.props.setSearchParams(this.props.searchParams)
  }

  cancelReorder = () => {
    if (this.props.searchParams.has('reorder')) {
      this.props.searchParams.delete('reorder')
      this.props.setSearchParams(this.props.searchParams)
    }
  }

  handleExpanded = (expanded) => {
    // TODO use `searchParams` instead
    if (!expanded) {
      this.cancelReorder()
    }
  }

  render() {
    const { entry, positions, playlistEntriesDigest, searchParams } = this.props

    /**
     * Reorder buttons
     */
    const createReorderButton = (handleReorder, className, id) => (
      <button
        className="control square primary"
        onClick={() => {
          handleReorder(id)
        }}
      >
        <span className="icon">
          <i className={classNames('las', className)}></i>
        </span>
      </button>
    )

    const reorderId = parseInt(searchParams.get('expanded'))
    const reorderIndex = parseInt(searchParams.get('reorder'))

    const expanded = reorderId === entry.id
    const inReorder = !!reorderId && !!reorderIndex

    const controlsExpanded = [
      <IsPlaylistManager key="reorder">
        <CSSTransitionLazy
          in={inReorder}
          classNames="show-hide"
          timeout={{
            enter: 3000,
            exit: 1500,
          }}
        >
          <div className="reorder">
            {!positions.isFirstPage &&
              createReorderButton(
                this.handleReorderFirst,
                'la-arrow-up overbar'
              )}
            {!positions.isLastPage &&
              createReorderButton(
                this.handleReorderLast,
                'la-arrow-down underbar'
              )}
          </div>
        </CSSTransitionLazy>
        {createReorderButton(
          this.handleReorderToggle,
          inReorder ? 'la-ban' : 'la-arrows-alt-v'
        )}
      </IsPlaylistManager>,
      <button
        key="search"
        className="control square primary"
        onClick={() => {
          this.handleSearch()
        }}
      >
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>,
      <IsPlaylistManagerOrOwner key="remove" object={entry} disable>
        <button
          className="control square danger"
          onClick={() => {
            this.displayConfirm()
          }}
        >
          <span className="icon">
            <i className="las la-trash"></i>
          </span>
        </button>
      </IsPlaylistManagerOrOwner>,
    ]

    const controls = [
      <IsPlaylistManager key="reorder">
        <CSSTransitionLazy
          in={inReorder}
          classNames="show-hide"
          timeout={{
            enter: 300,
            exit: 150,
          }}
        >
          <div className="reorder">
            {reorderIndex > positions.position
              ? createReorderButton(
                  this.handleReorderUp,
                  inReorder ? 'la-arrow-up' : 'la-arrows-alt-v',
                  reorderId
                )
              : createReorderButton(
                  this.handleReorderDown,
                  inReorder ? 'la-arrow-down' : 'la-arrows-alt-v',
                  reorderId
                )}
          </div>
        </CSSTransitionLazy>
      </IsPlaylistManager>,
      <button
        key="search"
        className="control square primary"
        onClick={() => {
          this.handleSearch()
        }}
      >
        <span className="icon">
          <i className="las la-search"></i>
        </span>
      </button>,
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
            this.props.removeEntryFromPlaylist(entry.id)
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
              Uses the instrumental version
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
        onExpanded={this.handleExpanded}
      >
        {expanded ? (
          <PlaylistEntryWidget
            entry={entry}
            noOwner
            noInstrumental
            truncatable
          />
        ) : (
          <PlaylistEntryWidget entry={entry} truncatable />
        )}
      </ListingEntry>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  playlistEntriesDigest: state.playlist.digest.entries.data.playlistEntries,
  responseOfRemoveEntry:
    state.alterationsResponse.multiple.removeEntryFromPlaylist?.[
      ownProps.entry.id
    ],
  responseOfReorderPlaylistEntry:
    state.alterationsResponse.multiple.reorderPlaylistEntry?.[
      ownProps.entry.id
    ],
})

Entry = withSearchParams(
  withNavigate(
    connect(mapStateToProps, {
      removeEntryFromPlaylist,
      reorderPlaylistEntry,
    })(Entry)
  )
)

export default Entry
