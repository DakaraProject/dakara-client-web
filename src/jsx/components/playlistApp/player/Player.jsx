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
import { Reduceable } from 'components/generics/Box'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { sendPlayerCommand } from 'actions/playlist'
import { playlistDigestPropType, playerCommandsPropType } from 'reducers/playlist'
import { alterationStatusPropType, Status } from 'reducers/alterationsStatus'

class Player extends Component {
    static propTypes = {
        playlistDigest: playlistDigestPropType.isRequired,
        statusSendPlayerCommands: PropTypes.objectOf(alterationStatusPropType),
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

        const statusSendPlayerCommandsSafe = {
            pause: {status: null},
            skip: {status: null},
            ...this.props.statusSendPlayerCommands,
        }

        /**
         * Display playlist entry if any song is currently playing
         */

        let progress
        let playlistEntry
        if (isPlaying) {
            const duration = player_status.playlist_entry.song.duration
            progress = Math.min(player_status.timing * 100 / duration, 100)
            playlistEntry = (
                <div className="playlist-entry">
                    <Song
                        song={player_status.playlist_entry.song}
                        noDuration
                        noTag
                    />
                    <div className="extra">
                        <div className="timing">
                            <div className="current">
                                {formatTime(player_status.timing)}
                            </div>
                            <div className="duration">
                                {formatDuration(duration)}
                            </div>
                        </div>
                        <UserWidget
                            user={player_status.playlist_entry.owner}
                            className="owner"
                        />
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

        /**
         * Progress bar
         */

        let progressStyle = {width: `${progress}%`}

        return (
            <div id="player">
                <div className="display-area">
                    <div className="controls main">
                        <IsPlaylistManagerOrOwner
                            object={player_status.playlist_entry}
                            disable
                        >
                            <ManageButton
                                statusManage={statusSendPlayerCommandsSafe.pause}
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
                        </IsPlaylistManagerOrOwner>
                    </div>
                    <div className="notifiable">
                        {playlistEntry}
                        <CSSTransitionLazy
                            in={fetchError}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            <ServerLost/>
                        </CSSTransitionLazy>
                        <PlayerNotification
                            alterationStatuses={statusSendPlayerCommandsSafe}
                            playerErrors={player_errors}
                        />
                    </div>
                </div>
                <Reduceable>
                    <div className="controls other">
                        <ManageButton
                            statusManage={statusSendPlayerCommandsSafe.skip}
                            onClick={() =>
                                    this.props.sendPlayerCommand('skip', true)
                            }
                            disabled={controlDisabled}
                            icon="step-forward"
                        />
                    </div>
                </Reduceable>
                <div className="progressbar">
                    <div className="progress" style={progressStyle}></div>
                </div>
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
    playlistDigest: state.playlist.digest,
    statusSendPlayerCommands: state.alterationsStatus.sendPlayerCommands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        sendPlayerCommand,
    }
)(Player))

export default Player
