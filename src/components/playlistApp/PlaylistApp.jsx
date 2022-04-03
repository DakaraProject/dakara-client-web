import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadPlaylistAppDigest } from 'actions/playlist'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import KaraStatusNotification from 'components/playlistApp/KaraStatusNotification'
import Player from 'components/playlistApp/player/Player'
import PlaylistInfoBar from 'components/playlistApp/PlaylistInfoBar'
import { Status } from 'reducers/alterationsResponse'
import { playlistDigestPropType } from 'reducers/playlist'
import { params } from 'utils'

class PlaylistApp extends Component {
    static propTypes = {
        loadPlaylistAppDigest: PropTypes.func.isRequired,
        playlistDigest: playlistDigestPropType.isRequired,
    }

    state = {
        playerWithControls: false
    }

    /**
     * Get evolution of the playlist periodically
     */
    pollPlaylistAppDigest = () => {
        if (this.props.playlistDigest.status !== Status.pending) {
            this.props.loadPlaylistAppDigest()
        }
        this.timeout = setTimeout(this.pollPlaylistAppDigest, params.pollInterval)
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
        this.pollPlaylistAppDigest()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { karaoke } = this.props.playlistDigest.data
        const { playerWithControls } = this.state

        if (!karaoke.ongoing === null) return null

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
                id="playlist-app"
                className={classNames(
                    "box",
                    {"player-with-controls": playerWithControls
                    }
                )}
            >
                <Player setWithControls={this.setPlayerWithControls}/>
                <PlaylistInfoBar/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigest: state.playlist.digest,
    user: state.authenticatedUser,
})

PlaylistApp = connect(
    mapStateToProps,
    {
        loadPlaylistAppDigest,
    }
)(PlaylistApp)

export default PlaylistApp
