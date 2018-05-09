import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Player from './player/Player'
import PlaylistInfoBar from './PlaylistInfoBar'
import KaraStatusNotification from './KaraStatusNotification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { loadPlaylistAppDigest } from 'actions/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { params } from 'utils'
import { Status } from 'reducers/alterationsResponse'

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
        const stickedElements = document.getElementsByClassName('sticked')

        if (!kara_status.status) return null

        if (kara_status.status === 'stop') {
            Array.prototype.forEach.call(stickedElements, (element) => {
                element.classList.remove('with-player')
            })

            if (IsPlaylistManager.hasPermission(this.props.user)) {
                Array.prototype.forEach.call(stickedElements, (element) => {
                    element.classList.add('with-notification')
                })

                return (
                    <KaraStatusNotification/>
                )
            }

            return null
        }

        Array.prototype.forEach.call(stickedElements, (element) => {
            element.classList.remove('with-notification')
            element.classList.add('with-player')
        })

        return (
            <div className="box">
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
