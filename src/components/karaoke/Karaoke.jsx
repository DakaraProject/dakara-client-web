import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlaylistDigest } from 'actions/playlistDigest'
import KaraStatusNotification from 'components/karaoke/KaraStatusNotification'
import Player from 'components/karaoke/player/Player'
import PlaylistInfoBar from 'components/karaoke/PlaylistInfoBar'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { karaokeStatePropType } from 'reducers/playlist'
import { params } from 'utils'

class Karaoke extends Component {
    static propTypes = {
        loadPlaylistDigest: PropTypes.func.isRequired,
        karaokeState: karaokeStatePropType.isRequired,
    }

    state = {
        playerWithControls: false
    }

    /**
     * Get evolution of the playlist periodically
     */
    pollPlaylistDigest = () => {
        if (this.props.karaokeState.status !== Status.pending) {
            this.props.loadPlaylistDigest()
        }
        this.timeout = setTimeout(this.pollPlaylistDigest, params.pollInterval)
    }

    /**
     * Allow to tell if the player has controls activated
     * This is used for the styles
     */
    setPlayerWithControls = (playerWithControls) => {
        this.setState({playerWithControls})
    }

    componentDidMount() {
        // start polling server
        this.pollPlaylistDigest()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { data: karaoke } = this.props.karaokeState
        const { playerWithControls } = this.state

        if (!karaoke.ongoing) {
            if (IsPlaylistManager.hasPermission(this.props.user)) {
                return (
                    <KaraStatusNotification/>
                )
            }

            return null
        }

        return (
            <div
                id="karaoke"
                className={classNames(
                    'box',
                    {'player-with-controls': playerWithControls}
                )}
            >
                <Player setWithControls={this.setPlayerWithControls}/>
                <PlaylistInfoBar/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    karaokeState: state.playlist.karaoke,
    user: state.authenticatedUser,
})

Karaoke = connect(
    mapStateToProps,
    {
        loadPlaylistDigest,
    }
)(Karaoke)

export default Karaoke
