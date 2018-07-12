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
import { TimeIntervalPlayer } from 'components/generics/Time'

class Player extends Component {
    static propTypes = {
        responseOfSendPlayerCommands: PropTypes.objectOf(alterationResponsePropType),
        sendPlayerCommand: PropTypes.func.isRequired,
    }

    render() {
        const { playerStatus, entryErrors, webSocketConnection } = this.props
        const isPlaying = !!playerStatus.currentEntry
        const controlDisabled = !isPlaying

        // const { player_status, player_manage, player_errors } = this.props.playlistDigest.data
        // const fetchError = this.props.playlistDigest.status === Status.failed
        // const isPlaying = !!player_status.playlist_entry
        // const controlDisabled = !isPlaying || fetchError

        /**
         * Create a safe version of the send player commands alteration status
         * with default values
         */

        const responseOfSendPlayerCommandsSafe = {
            playPause: {status: null},
            skip: {status: null},
            ...this.props.responseOfSendPlayerCommands,
        }

        /**
         * Display playlist entry if any song is currently playing
         */

        let progress
        let playlistEntry
        if (isPlaying) {
            const duration = playerStatus.currentEntry.song.duration

            // the progress is displayed only when the song has really started
            // and only if the song has a known duration
            if (playerStatus.timing > 0 && duration > 0) {
                progress = Math.min(playerStatus.timing * 100 / duration, 100)
            }

            playlistEntry = (
                <div className="playlist-entry">
                    <Song
                        song={playerStatus.currentEntry.song}
                        noDuration
                        noTag
                    />
                    <div className="extra">
                        <div className="timing">
                            <div className="current">
                                <TimeIntervalPlayer/>
                            </div>
                            <div className="duration">
                                {formatDuration(duration)}
                            </div>
                        </div>
                        <div className="owner">
                            <UserWidget
                                user={playerStatus.currentEntry.owner}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            progress = 0
            playlistEntry = (
                <div className="playlist-entry">
                    <div className="extra">
                        <div className="timing">
                            <div className="current">
                                {formatTime(0)}
                            </div>
                            <div className="duration">
                                {formatDuration(0)}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div id="player">
                <div className="first-line">
                    <div className="controls main">
                        <IsPlaylistManagerOrOwner
                            object={playerStatus.currentEntry}
                            disable
                        >
                            <ManageButton
                                responseOfManage={responseOfSendPlayerCommandsSafe.playPause}
                                onClick={() => {
                                    this.props.sendPlayerCommand(
                                        playerStatus.paused ? 'play' : 'pause',
                                        'playPause'
                                    )
                                }}
                                disabled={controlDisabled}
                                icon={
                                    isPlaying ?
                                    (playerStatus.paused ? 'play' : 'pause') :
                                    'stop'
                                }
                            />
                            <ManageButton
                                responseOfManage={responseOfSendPlayerCommandsSafe.skip}
                                onClick={() =>
                                        this.props.sendPlayerCommand('skip')
                                }
                                disabled={controlDisabled}
                                icon="step-forward"
                            />
                        </IsPlaylistManagerOrOwner>
                    </div>
                    <div className="display-area notifiable">
                        {playlistEntry}
                        <CSSTransitionLazy
                            in={webSocketConnection.status === Status.failed}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            <ServerLost/>
                        </CSSTransitionLazy>
                        <PlayerNotification
                            alterationsResponse={responseOfSendPlayerCommandsSafe}
                            playerErrors={entryErrors}
                        />
                    </div>
                </div>
                <progress
                    className="progressbar"
                    max="100"
                    value={progress}
                >
                    <div className="bar">
                        <div className="value" style={{width: `${progress}%`}}></div>
                    </div>
                </progress>
            </div>
        )
    }
}

const ServerLost = () => (
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
)

const mapStateToProps = (state) => ({
    playerStatus: state.playlist.playerStatus.data,
    entryErrors: state.playlist.entryErrors.data,
    webSocketConnection: state.playlist.webSocketConnection,
    responseOfSendPlayerCommands: state.alterationsResponse.multiple.sendPlayerCommands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        sendPlayerCommand,
    }
)(Player))

export default Player
