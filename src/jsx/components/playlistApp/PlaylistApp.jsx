import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Player from './player/Player'
import PlaylistInfoBar from './PlaylistInfoBar'
import KaraStatusNotification from './KaraStatusNotification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { loadPlaylistAppDigest } from 'actions/playlist'
import { connectToPlaylistFront, disconnectFromPlaylistFront } from 'actions/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { params } from 'utils'
import { Status } from 'reducers/alterationsResponse'

class PlaylistApp extends Component {
    static propTypes = {
        loadPlaylistAppDigest: PropTypes.func.isRequired,
        connectToPlaylistFront: PropTypes.func.isRequired,
        disconnectFromPlaylistFront: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.props.loadPlaylistAppDigest()
        this.props.connectToPlaylistFront()
    }

    componentWillUnmount() {
        this.props.disconnectFromPlaylistFront()
    }

    render() {
        const { karaStatus } = this.props

        if (!karaStatus.status) return null

        if (karaStatus.status === 'stop') {
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
    karaStatus: state.playlist.karaStatus.data,
    user: state.authenticatedUser,
})

PlaylistApp = connect(
    mapStateToProps,
    {
        loadPlaylistAppDigest,
        connectToPlaylistFront,
        disconnectFromPlaylistFront,
    }
)(PlaylistApp)

export default PlaylistApp
