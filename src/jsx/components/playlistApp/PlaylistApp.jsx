import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Player from './player/Player'
import Playlist from './playlist/List'
import KaraStatusNotification from './KaraStatusNotification'
import { IsPlaylistManager } from 'components/permissions/Playlist'
import { loadPlayerDigest } from 'actions/player'
import { playerDigestPropType } from 'reducers/player'
import { params } from 'utils'

class PlaylistApp extends Component {
    static propTypes = {
        playerDigest: playerDigestPropType.isRequired,
        loadPlayerDigest: PropTypes.func.isRequired,
    }

    pollPlayerDigest = () => {
        if (!this.props.playerDigest.isFetching) {
            this.props.loadPlayerDigest()
        }
        this.timeout = setTimeout(this.pollPlayerDigest, params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlayerDigest()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { kara_status } = this.props.playerDigest.data

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
    playerDigest: state.player.digest,
})

PlaylistApp = connect(
    mapStateToProps,
    {
        loadPlayerDigest,
    }
)(PlaylistApp)

export default PlaylistApp
