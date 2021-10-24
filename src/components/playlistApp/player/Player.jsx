import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { sendPlayerCommand } from 'actions/playlist'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import ManageButton from 'components/playlistApp/player/ManageButton'
import PlayerNotification from 'components/playlistApp/player/Notification'
import Song from 'components/song/Song'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'
import { playlistDigestPropType } from 'reducers/playlist'
import { formatDuration } from 'utils'

class Player extends Component {
    static propTypes = {
        playlistDigest: playlistDigestPropType.isRequired,
        responseOfSendPlayerCommands: PropTypes.objectOf(alterationResponsePropType),
        sendPlayerCommand: PropTypes.func.isRequired,
    }

    render() {
        const { player_status, player_errors } = this.props.playlistDigest.data
        const fetchError = this.props.playlistDigest.status === Status.failed
        const isPlaying = !!player_status.playlist_entry
        const controlDisabled = !isPlaying || fetchError

        /**
         * Create a safe version of the send player commands alteration status
         * with default values
         */

        const responseOfSendPlayerCommandsSafe = {
            pause: {status: null},
            play: {status: null},
            skip: {status: null},
            ...this.props.responseOfSendPlayerCommands,
        }

        /**
         * Display playlist entry if any song is currently playing
         */

        let progress
        let playlistEntry
        if (isPlaying) {
            const duration = player_status.playlist_entry.song.duration

            /**
             * Manage instrumental playlist entry
             */
            let useInstrumental
            if (player_status.playlist_entry.use_instrumental) {
                useInstrumental = (
                    <div className="use-instrumental">
                        <i className="fa fa-microphone-slash"></i>
                    </div>
                )
            }

            // the progress is displayed only when the song has really started
            // and only if the song has a known duration
            if (!player_status.in_transition && duration > 0) {
                progress = Math.min(player_status.timing * 100 / duration, 100)
            }

            playlistEntry = (
                <div className="playlist-entry">
                    {useInstrumental}
                    <Song
                        song={player_status.playlist_entry.song}
                        noDuration
                        noTag
                    />
                    <div className="extra">
                        <div className="timing">
                            <div className="current">
                                {formatDuration(player_status.timing)}
                            </div>
                            <div className="duration">
                                {formatDuration(duration)}
                            </div>
                        </div>
                        <div className="owner">
                            <UserWidget
                                user={player_status.playlist_entry.owner}
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
                                {formatDuration(0)}
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
                            object={player_status.playlist_entry}
                            disable
                        >
                            <ManageButton
                                responseOfManage={
                                    player_status.paused ?
                                        responseOfSendPlayerCommandsSafe.play :
                                        responseOfSendPlayerCommandsSafe.pause
                                }
                                onClick={() => {
                                    if (!isPlaying) return

                                    if (player_status.paused) {
                                        this.props.sendPlayerCommand('play')
                                    } else {
                                        this.props.sendPlayerCommand('pause')
                                    }
                                }}
                                disabled={controlDisabled}
                                icon={
                                    isPlaying ?
                                        (player_status.paused ? 'play' : 'pause') :
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
                    <div className="display-area notifiable">
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
                            alterationsResponse={responseOfSendPlayerCommandsSafe}
                            playerErrors={player_errors}
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
