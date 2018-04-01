import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { formatDuration, formatTime } from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { sendPlayerCommands } from 'actions/player'
import PlayerNotification from './Notification'
import { playerDigestPropType, playerCommandsPropType } from 'reducers/player'
import ManageButton from './ManageButton'

class Player extends Component {
    static propTypes = {
        playerDigest: playerDigestPropType.isRequired,
        playerCommands: playerCommandsPropType.isRequired,
        sendPlayerCommands: PropTypes.func.isRequired,
    }

    render() {
        const { player_status, player_manage, player_errors } = this.props.playerDigest.data
        const { fetchError } = this.props.playerDigest
        const isPlaying = !!player_status.playlist_entry
        const controlDisabled = !isPlaying || fetchError
        const commandPauseStatus = this.props.playerCommands.pause.status
        const commandSkipStatus = this.props.playerCommands.skip.status

        /**
         * Song display if any song is currently playing
         */

        let song
        let playlistEntryOwner
        let duration
        let progress
        if (isPlaying) {
            song = (
                    <Song
                        song={player_status.playlist_entry.song}
                        noDuration
                        noTag
                    />
                )

            playlistEntryOwner = (
                    <UserWidget
                        user={player_status.playlist_entry.owner}
                        className="playlist-entry-owner"
                    />
                )

            duration = player_status.playlist_entry.song.duration
            progress = Math.min(player_status.timing * 100 / duration, 100)
        } else {
            progress = 0
            duration = 0
        }

        /**
         * Progress bar
         */

        let progressStyle = {width: `${progress}%`}

        return (
            <div id="player">
                <div className="display-area">
                    <div className="controls">
                        <IsPlaylistManagerOrOwner
                            object={player_status.playlist_entry}
                            disable
                        >
                            <ManageButton
                                manageStatus={commandPauseStatus}
                                onClick={() => {
                                    this.props.sendPlayerCommands({pause: !player_manage.pause})
                                }}
                                disabled={controlDisabled}
                                icon={player_manage.pause ? 'play' : 'pause'}
                                iconDisabled="stop"
                            />
                        </IsPlaylistManagerOrOwner>
                        <IsPlaylistManagerOrOwner
                            object={player_status.playlist_entry}
                            disable
                        >
                            <ManageButton
                                manageStatus={commandSkipStatus}
                                onClick={() => this.props.sendPlayerCommands({skip: true})}
                                disabled={controlDisabled}
                                icon="step-forward"
                            />
                        </IsPlaylistManagerOrOwner>
                    </div>
                    <div className="song-container notifiable">
                        {song}
                        {playlistEntryOwner}
                        <div className="song-timing">
                            <div className="current">
                                {formatTime(player_status.timing)}
                            </div>
                            <div className="duration">
                                {formatDuration(duration)}
                            </div>
                        </div>
                        <CSSTransitionLazy
                            in={fetchError}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            <div className="notified">
                                <div className="notification danger">
                                    <div className="message">
                                        Unable to get status from server
                                    </div>
                                    <div className="animation pending">
                                        <span className="point">·</span>
                                        <span className="point">·</span>
                                        <span className="point">·</span>
                                    </div>
                                </div>
                            </div>
                        </CSSTransitionLazy>
                        <PlayerNotification
                            alterationStatuses={[
                                this.props.playerCommands.pause,
                                this.props.playerCommands.skip
                            ]}
                            playerErrors={player_errors}
                        />
                    </div>
                </div>
                <div className="progressbar">
                    <div className="progress" style={progressStyle}></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerDigest: state.player.digest,
    playerCommands: state.player.commands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        sendPlayerCommands,
    }
)(Player))

export default Player
