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

  componentDidMount() {
    this.refreshEntries()
  }

  componentDidUpdate(prevProps) {
    // refresh if moved to a different page
    if (this.props.searchParams !== prevProps.searchParams) {
      this.refreshEntries()
    }

    // refresh if the playlist changed
    const { playlistQueuingState } = this.props
    const { playlistEntriesDigestState } = this.props
    const { playlistEntriesDigestState: prevPlaylistEntriesDigestState } =
      prevProps
    if (
      playlistEntriesDigestState !== prevPlaylistEntriesDigestState &&
      playlistQueuingState.status !== Status.pending &&
      playlistEntriesDigestState.data.queuingEntriesHash !==
        prevPlaylistEntriesDigestState.data.queuingEntriesHash
    ) {
      this.refreshEntries()
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
   * Fetch queuing playlist entries from server
   */
  refreshEntries = () => {
    this.props.loadPlaylistEntries('queuing', {
      page: this.props.searchParams.get('page'),
    })
  }

  render() {
    const { queuing, count, pagination } = this.props.playlistQueuingState.data
    const { status } = this.props.playlistQueuingState
    const { queuingEntries, queuingEntriesHash } =
      this.props.playlistEntriesDigestState.data

    const firstId = queuingEntries?.[0]?.id
    const lastId = queuingEntries.slice(-1)?.[0]?.id
    const page = parseInt(this.props.searchParams.get('page')) || 1
    const isFirstPage = page === 1
    const isLastPage = page === pagination.last

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
      />
    ))

    return (
      <div id="queuing">
        <ListingList
          fetchStatus={status}
          transitionObservable={queuingEntriesHash}
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
