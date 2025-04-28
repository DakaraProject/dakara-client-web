import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { loadPlaylistEntries, reorderPlaylistEntry } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import QueuingEntry from 'components/playlist/queueing/Entry'
import { Status } from 'reducers/alterationsResponse'
import { queuingStatePropType } from 'reducers/playlist'
import { playlistEntriesDigestStatePropType } from 'reducers/playlistDigest'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'
import { getEntriesHash } from 'utils'

class Queueing extends Component {
  static propTypes = {
    clearAlteration: PropTypes.func.isRequired,
    loadPlaylistEntries: PropTypes.func.isRequired,
    playlistEntriesDigestState: playlistEntriesDigestStatePropType.isRequired,
    playlistQueuingState: queuingStatePropType.isRequired,
    reorderPlaylistEntry: PropTypes.func.isRequired,
    searchParams: PropTypes.object.isRequired,
    setSearchParams: PropTypes.func.isRequired,
  }

  state = {
    reorderEntryId: null,
  }

  componentDidMount() {
    this.refreshEntries()
  }

  componentDidUpdate(prevProps, prevState) {
    // reset reorder entry ID
    if (this.state.reorderEntryId !== prevState.reorderEntryId) {
      const { reorderEntryId } = this.state

      // when in reorder mode, if the entry to reorder has been removed, quit
      // reorder mode
      if (reorderEntryId !== null) {
        if (this.getEntryPosition(reorderEntryId) === -1) {
          this.setState({ reorderEntryId: null })
        }
      }
    }

    // refresh if moved to a different page
    if (this.props.searchParams !== prevProps.searchParams) {
      this.setState({ reorderEntryId: null })
      this.refreshEntries()
    }

    // refresh if the playlist changed
    if (
      this.props.playlistEntriesDigestState !==
        prevProps.playlistEntriesDigestState &&
      this.props.playlistQueuingState.status !== Status.pending
    ) {
      const queuingId =
        this.props.playlistEntriesDigestState.data.playlistEntries
          .filter((e) => !e.was_played)
          .map((e) => e.id)
      const prevQueuingId =
        prevProps.playlistEntriesDigestState.data.playlistEntries
          .filter((e) => !e.was_played)
          .map((e) => e.id)
      if (
        queuingId.length !== prevQueuingId.length ||
        !queuingId.every((e, i) => e === prevQueuingId[i])
      ) {
        this.refreshEntries()
      }
    }

    // if the page of entries could not be obtained, request the previous
    // page
    if (
      this.props.playlistQueuingState.status === Status.failed &&
      this.props.searchParams.get('page') > 1
    ) {
      const page = this.props.searchParams.get('page')
      this.props.searchParams.delete('page')
      this.props.searchParams.append('page', page - 1)
      this.props.setSearchParams(this.props.searchParams)
    }
  }

  /**
   * Get the position of an intry within the array of entries
   * @param entryId the ID of the entry to get the position of
   * @return the position of the entry, `null` if `entryId` is null, `-1` if
   * the entry was not found
   */
  getEntryPosition = (entryId) => {
    if (entryId === null) {
      return null
    }

    return this.props.playlistQueuingState.data.queuing.findIndex(
      (e) => e.id === entryId
    )
  }

  /**
   * Fetch queuing playlist entries from server
   */
  refreshEntries = () => {
    this.props.loadPlaylistEntries('queuing', {
      page: this.props.searchParams.get('page'),
    })
  }

  /**
   * Callback passed to entries for their reorder button
   * @param id ID of the entry which button was clicked
   */
  onReorderButtonClick = (id) => {
    const { reorderEntryId } = this.state
    const { reorderPlaylistEntry } = this.props

    if (reorderEntryId !== null) {
      // if in reorder mode, reorderEntryId will be reordered relative to id
      const reorderEntryPosition = this.getEntryPosition(reorderEntryId)
      const position = this.getEntryPosition(id)
      if (reorderEntryPosition > position) {
        reorderPlaylistEntry({
          playlistEntryId: reorderEntryId,
          beforeId: id,
        })
      } else if (reorderEntryPosition < position) {
        reorderPlaylistEntry({
          playlistEntryId: reorderEntryId,
          afterId: id,
        })
      }
      // otherwise, assume the user wants to cancel

      // after reordering or cancel, quit reorder mode
      this.setState({
        reorderEntryId: null,
      })
    } else {
      // if not in reorder mode, enter reorder mode for the given id
      this.setState({
        reorderEntryId: id,
      })
    }
  }

  render() {
    const { queuing, count, pagination } = this.props.playlistQueuingState.data
    const { status } = this.props.playlistQueuingState
    const { playlistEntries } = this.props.playlistEntriesDigestState.data
    const reorderEntryPosition = this.getEntryPosition(
      this.state.reorderEntryId
    )

    const firstId = playlistEntries.find((e) => e.will_play)?.id
    const lastId = playlistEntries.findLast((e) => e.will_play)?.id
    const isFirstPage =
      !this.props.searchParams.get('page') ||
      this.props.searchParams.get('page') == 1
    const isLastPage = this.props.searchParams.get('page') == pagination.last

    const queuingComponents = queuing.map((entry, position) => (
      <QueuingEntry
        key={entry.id}
        entry={entry}
        clearAlteration={this.props.clearAlteration}
        positions={{
          position,
          firstId,
          lastId,
          isFirstPage,
          isLastPage,
        }}
        onReorderButtonClick={this.onReorderButtonClick}
        reorderEntryPosition={reorderEntryPosition}
      />
    ))

    return (
      <div id="queuing">
        <ListingList
          fetchStatus={status}
          transitionObservable={getEntriesHash(
            playlistEntries.filter((e) => !e.was_played)
          )}
        >
          {queuingComponents}
        </ListingList>
        <Navigator
          count={count}
          pagination={pagination}
          names={{
            singular: 'entry',
            plural: 'entries',
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  playlistEntriesDigestState: state.playlist.digest.entries,
  playlistQueuingState: state.playlist.queuing,
})

Queueing = withSearchParams(
  connect(mapStateToProps, {
    clearAlteration,
    loadPlaylistEntries,
    reorderPlaylistEntry,
  })(Queueing)
)

export default Queueing
