import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlayerErrors } from 'actions/playlist'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import PlayerErrorsEntry from 'components/playlist/playerErrors/Entry'
import { Status } from 'reducers/alterationsResponse'
import { playerErrorsStatePropType } from 'reducers/playlist'
import { playerErrorsDigestStatePropType } from 'reducers/playlistDigest'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class PlayerErrorsList extends Component {
  static propTypes = {
    playerErrorsDigestState: playerErrorsDigestStatePropType.isRequired,
    playerErrorsState: playerErrorsStatePropType.isRequired,
    loadPlayerErrors: PropTypes.func.isRequired,
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

    // refresh if the digest player errors changed
    const { playerErrorsState } = this.props
    const { playerErrorsDigestState } = this.props
    const { playerErrorsDigestState: prevPlayerErrorsDigestState } = prevProps
    if (
      playerErrorsDigestState !== prevPlayerErrorsDigestState &&
      playerErrorsState.status !== Status.pending
    ) {
      const errorIds = playerErrorsDigestState.data.map((e) => e.id)
      const prevErrorIds = prevPlayerErrorsDigestState.data.map((e) => e.id)
      if (errorIds.length !== prevErrorIds.length) {
        this.refreshEntries()
      }
    }
  }

  refreshEntries = () => {
    this.props.loadPlayerErrors({
      page: this.props.searchParams.get('page') || 1,
    })
  }

  render() {
    const { playerErrors, count, pagination } =
      this.props.playerErrorsState.data

    const playerErrorsList = playerErrors.map((playerError) => (
      <PlayerErrorsEntry key={playerError.id} playerError={playerError} />
    ))

    return (
      <div id="player-errors-list">
        <ListingFetchWrapper status={this.props.playerErrorsState.status}>
          <ul className="player-errors-list listing">{playerErrorsList}</ul>
        </ListingFetchWrapper>
        <Navigator
          count={count}
          pagination={pagination}
          names={{
            singular: 'error',
            plural: 'errors',
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  playerErrorsDigestState: state.playlist.digest.playerErrors,
  playerErrorsState: state.playlist.playerErrors,
})

PlayerErrorsList = withSearchParams(
  connect(mapStateToProps, { loadPlayerErrors })(PlayerErrorsList)
)

export default PlayerErrorsList
