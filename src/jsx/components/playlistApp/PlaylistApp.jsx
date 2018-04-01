import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Player from './player/Player'
import Playlist from './playlist/List'
import { KaraStatusIsStopped, KaraStatusIsNotStopped } from 'components/permissions/Playlist'
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
        return (
            <div>
                <KaraStatusIsNotStopped>
                    <div className="box">
                        <Player/>
                        <Playlist/>
                    </div>
                </KaraStatusIsNotStopped>
                <IsPlaylistManager>
                    <KaraStatusIsStopped>
                        <div className="box" id="player">
                            <div className="kara-status-notification">
                                <p className="message">
                                    The karaoke is stopped for now. You can activate
                                    it in the settings page.
                                </p>
                                <div className="controls">
                                    <Link
                                        className="control primary"
                                        to="/settings/kara-status"
                                    >
                                        Go to settings page
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </KaraStatusIsStopped>
                </IsPlaylistManager>
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
