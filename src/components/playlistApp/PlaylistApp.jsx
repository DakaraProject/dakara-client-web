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

    pollPlaylistAppDigest = () => {
        if (this.props.playlistDigest.status !== Status.pending) {
            this.props.loadPlaylistAppDigest()
        }
        this.timeout = setTimeout(this.pollPlaylistAppDigest, params.pollInterval)
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
            <div className="box" id="playlist-app">
                <Player/>
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
