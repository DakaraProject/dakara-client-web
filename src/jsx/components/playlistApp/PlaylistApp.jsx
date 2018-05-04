import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Player from './player/Player'
import Playlist from './playlist/List'
import KaraStatusNotification from './KaraStatusNotification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { loadPlaylistAppDigest } from 'actions/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { params } from 'utils'
import { Status } from 'reducers/alterations'

class PlaylistApp extends Component {
    static propTypes = {
        playlistDigest: playlistDigestPropType.isRequired,
        loadPlaylistAppDigest: PropTypes.func.isRequired,
    }

    pollPlaylistAppDigest = () => {
        if (this.props.playlistDigest.status !== Status.pending) {
            this.props.loadPlaylistAppDigest()
        }
        this.timeout = setTimeout(this.pollPlaylistAppDigest, params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlaylistAppDigest()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { kara_status } = this.props.playlistDigest.data

        if (!kara_status.status) return null

        if (kara_status.status === 'stop') {
            return (
                <IsPlaylistManager>
                    <KaraStatusNotification/>
                </IsPlaylistManager>
            )
        }

        return (
            <div className="box">
                <Player/>
                <Playlist/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigest: state.playlist.digest,
})

PlaylistApp = connect(
    mapStateToProps,
    {
        loadPlaylistAppDigest,
    }
)(PlaylistApp)

export default PlaylistApp
