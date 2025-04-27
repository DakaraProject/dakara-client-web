import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlaylistEntries } from 'actions/playlist'
import ListingList from 'components/generics/listing/List'
import Navigator from 'components/generics/Navigator'
import PlayedEntry from 'components/playlist/played/Entry'
import { playedStatePropType } from 'reducers/playlist'
import { playlistEntriesStatePropType } from 'reducers/playlistDigest'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'
import { getEntriesHash } from 'utils'

class Played extends Component {
  static propTypes = {
    playlistEntriesState: playlistEntriesStatePropType.isRequired,
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
    if (this.props.playlistEntriesState !== prevProps.playlistEntriesState) {
      const played =
        this.props.playlistEntriesState.data.playlistEntries.filter(
          (e) => e.was_played
        )
      const prevPlayed =
        prevProps.playlistEntriesState.data.playlistEntries.filter(
          (e) => e.was_played
        )
      if (played.length !== prevPlayed.length) {
        this.refreshEntries()
      }
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
    const {
      played: playlistEntries,
      count,
      pagination,
    } = this.props.playlistPlayedState.data
    const { status } = this.props.playlistPlayedState

    const playlistEntriesComponent = playlistEntries.map((entry) => (
      <PlayedEntry key={entry.id} entry={entry} />
    ))

    // XXX observable to actual list from digest
    return (
      <div id="played">
        <ListingList
          fetchStatus={status}
          transitionObservable={getEntriesHash(playlistEntries)}
        >
          {playlistEntriesComponent}
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
  playlistEntriesState: state.playlist.digest.entries,
  playlistPlayedState: state.playlist.played,
})

Played = withSearchParams(
  connect(mapStateToProps, {
    loadPlaylistEntries,
  })(Played)
)

export default Played
