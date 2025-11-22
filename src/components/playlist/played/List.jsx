import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlaylistEntries } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import PlayedEntry from 'components/playlist/played/Entry'
import { Status } from 'reducers/alterationsResponse'
import { playedStatePropType } from 'reducers/playlist'
import { playlistEntriesDigestStatePropType } from 'reducers/playlistDigest'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class Played extends Component {
  static propTypes = {
    playlistEntriesDigestState: playlistEntriesDigestStatePropType.isRequired,
    playlistPlayedState: playedStatePropType.isRequired,
    loadPlaylistEntries: PropTypes.func.isRequired,
    searchParams: PropTypes.object.isRequired,
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
    const { playlistPlayedState, playlistEntriesDigestState } = this.props
    const { playlistEntriesDigestState: prevPlaylistEntriesDigestState } =
      prevProps
    if (
      playlistEntriesDigestState !== prevPlaylistEntriesDigestState &&
      playlistPlayedState.status !== Status.pending &&
      playlistEntriesDigestState.data.playedEntriesHash !==
        prevPlaylistEntriesDigestState.data.playedEntriesHash
    ) {
      this.refreshEntries()
    }
  }

  /**
   * Fetch played playlist entries from server
   */
  refreshEntries = () => {
    this.props.loadPlaylistEntries('played', {
      page: this.props.searchParams.get('page'),
    })
  }

  render() {
    const { played, count, pagination } = this.props.playlistPlayedState.data
    const { status } = this.props.playlistPlayedState
    const { playedEntriesHash } = this.props.playlistEntriesDigestState.data

    const playedComponent = played.map((entry) => (
      <PlayedEntry key={entry.id} entry={entry} />
    ))

    return (
      <div id="played">
        <ListingList
          fetchStatus={status}
          transitionObservable={playedEntriesHash}
        >
          {playedComponent}
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
  playlistPlayedState: state.playlist.played,
})

Played = withSearchParams(
  connect(mapStateToProps, {
    loadPlaylistEntries,
  })(Played)
)

export default Played
