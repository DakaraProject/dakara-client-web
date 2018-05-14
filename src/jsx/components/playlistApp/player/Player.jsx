import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { formatDuration, formatTime } from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import ManageButton from './ManageButton'
import PlayerNotification from './Notification'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { sendPlayerCommand } from 'actions/playlist'
import { playlistDigestPropType, playerCommandsPropType } from 'reducers/playlist'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'

class Player extends Component {
    static propTypes = {
        playlistDigest: playlistDigestPropType.isRequired,
        responseOfSendPlayerCommands: PropTypes.objectOf(alterationResponsePropType),
        sendPlayerCommand: PropTypes.func.isRequired,
    }

    render() {
        const { player_status, player_manage, player_errors } = this.props.playlistDigest.data
        const fetchError = this.props.playlistDigest.status === Status.failed
        const isPlaying = !!player_status.playlist_entry
        const controlDisabled = !isPlaying || fetchError

        /**
         * Create a safe version of the send player commands alteration status
         * with default values
         */

        const responseOfSendPlayerCommandsSafe = {
            pause: {status: null},
            skip: {status: null},
            ...this.props.responseOfSendPlayerCommands,
        }

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
                                responseOfManage={responseOfSendPlayerCommandsSafe.pause}
                                onClick={() => {
                                    this.props.sendPlayerCommand('pause', !player_manage.pause)
                                }}
                                disabled={controlDisabled}
                                icon={
                                    isPlaying ?
                                    (player_manage.pause ? 'play' : 'pause') :
                                    'stop'
                                }
                            />
                            <ManageButton
                                responseOfManage={responseOfSendPlayerCommandsSafe.skip}
                                onClick={() =>
                                        this.props.sendPlayerCommand('skip', true)
                                }
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
                            alterationsResponse={responseOfSendPlayerCommandsSafe}
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
    playlistDigest: state.playlist.digest,
 responseOfSendPlayerCommands: state.alterationsResponse.multiple.sendPlayerCommands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        sendPlayerCommand,
    }
)(Player))

export default Player
