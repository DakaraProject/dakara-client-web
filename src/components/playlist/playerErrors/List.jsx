import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlayerErrors } from 'actions/playlist'
import { withSearchParams } from 'components/adapted/ReactRouterDom'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import PlayerErrorsEntry from 'components/playlist/playerErrors/Entry'
import { playerErrorsStatePropType } from 'reducers/playlist'

class PlayerErrorsList extends Component {
    static propTypes = {
        playerErrorsState: playerErrorsStatePropType.isRequired,
        loadPlayerErrors: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        // refresh if moved to a different page
        if (this.props.searchParams !== prevProps.searchParams) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        this.props.loadPlayerErrors({
            page: this.props.searchParams.get('page') || 1
        })
    }

    render() {
        const {
            playerErrors,
            count,
            pagination,
        } = this.props.playerErrorsState.data

        const playerErrorsList = playerErrors.map((playerError) => (
            <PlayerErrorsEntry
                key={playerError.id}
                playerError={playerError}
            />
        ))

        return (
            <div id="player-errors-list">
                <ListingFetchWrapper
                    status={this.props.playerErrorsState.status}
                >
                    <ul className="player-errors-list listing">
                        {playerErrorsList}
                    </ul>
                </ListingFetchWrapper>
                <Navigator
                    count={count}
                    pagination={pagination}
                    names={{
                        singular: 'error',
                        plural: 'errors'
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerErrorsState: state.playlist.playerErrors,
})

PlayerErrorsList = withSearchParams(connect(
    mapStateToProps,
    { loadPlayerErrors }
)(PlayerErrorsList))

export default PlayerErrorsList
