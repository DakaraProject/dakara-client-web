import classNames from 'classnames'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { sendPlayerCommand } from 'actions/playlist'
import { withNavigate } from 'components/adapted/ReactRouterDom'
import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'
import UserWidget from 'components/generics/UserWidget'
import ManageButton from 'components/karaoke/player/ManageButton'
import PlayerNotification from 'components/karaoke/player/Notification'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import Song from 'components/song/Song'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'
import { playlistDigestPropType } from 'reducers/playlist'
import { formatDuration } from 'utils'

class Player extends Component {
    static propTypes = {
        playlistDigest: playlistDigestPropType.isRequired,
        responseOfSendPlayerCommands: PropTypes.objectOf(alterationResponsePropType),
        sendPlayerCommand: PropTypes.func.isRequired,
        setWithControls: PropTypes.func.isRequired,
    }

    state = {
        withControls: false
    }

    componentDidUpdate(prevProps, prevState) {
        const { user: prevUser } = prevProps
        const { user } = this.props
        const { player_status: playerStatus } = this.props.playlistDigest.data
        const { player_status: prevPlayerStatus } = prevProps.playlistDigest.data

        if (user === prevUser && playerStatus === prevPlayerStatus) {
            return
        }

        const { withControls: prevWithControls } = this.state
        const withControls = IsPlaylistManagerOrOwner.hasPermission(
            user,
            playerStatus.playlist_entry
        )

        if (withControls === prevWithControls) {
            return
        }

        this.setState({withControls})
        this.props.setWithControls(withControls)
    }

    handleSearch = (song) => {
        const query = `title:""${song.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const { withControls } = this.state
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
            resume: {status: null},
            restart: {status: null},
            skip: {status: null},
            rewind: {status: null},
            fast_forward: {status: null},
            ...this.props.responseOfSendPlayerCommands,
        }

        /**
         * Server lost widget
         */
        const serverLost = (
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
        )

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
                    <div className="entry-info">
                        <Song
                            song={player_status.playlist_entry.song}
                            noDuration
                            noTag
                            handleClick={() => {
                                this.handleSearch(player_status.playlist_entry.song)
                            }}
                        />
                        <div className="owner">
                            <UserWidget
                                user={player_status.playlist_entry.owner}
                            />
                        </div>
                    </div>
                    <div className="timing">
                        <div className="current">
                            {formatDuration(player_status.timing)}
                        </div>
                        <div className="duration">
                            {formatDuration(duration)}
                        </div>
                    </div>
                </div>
            )
        } else {
            progress = 0
            playlistEntry = (
                <div className="playlist-entry">
                    <div className="timing">
                        <div className="current">
                            {formatDuration(0)}
                        </div>
                        <div className="duration">
                            {formatDuration(0)}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div
                id="player"
                className={classNames({'with-controls': withControls})}
            >
                <div className="player-sticky">
                    <div className="notifiable">
                        {playlistEntry}
                        <PlayerNotification
                            alterationsResponse={responseOfSendPlayerCommandsSafe}
                            playerErrors={player_errors}
                        />
                        {serverLost}
                    </div>
                </div>
                <CSSTransitionLazy
                    in={withControls}
                    classNames="expand"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <div className="controls">
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.restart}
                            onClick={() =>
                                    this.props.sendPlayerCommand('restart')
                            }
                            disabled={controlDisabled}
                            icon="step-backward"
                        />
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.rewind}
                            onClick={() =>
                                    this.props.sendPlayerCommand('rewind')
                            }
                            disabled={controlDisabled}
                            icon="backward"
                        />
                        <ManageButton
                            responseOfManage={
                                player_status.paused ?
                                    responseOfSendPlayerCommandsSafe.resume :
                                    responseOfSendPlayerCommandsSafe.pause
                            }
                            onClick={() => {
                                if (!isPlaying) return

                                if (player_status.paused) {
                                    this.props.sendPlayerCommand('resume')
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
                            responseOfManage={
                                responseOfSendPlayerCommandsSafe.fast_forward
                            }
                            onClick={() =>
                                    this.props.sendPlayerCommand('fast_forward')
                            }
                            disabled={controlDisabled}
                            icon="forward"
                        />
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.skip}
                            onClick={() =>
                                    this.props.sendPlayerCommand('skip', true)
                            }
                            disabled={controlDisabled}
                            icon="step-forward"
                        />
                    </div>
                </CSSTransitionLazy>
                <progress
                    className="progressbar"
                    max="100"
                    value={progress}
                >
                    <div className="bar">
                        <div
                            className="value"
                            style={{width: `${progress}%`}}
                        >
                        </div>
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
    user: state.authenticatedUser,
    playlistDigest: state.playlist.digest,
    responseOfSendPlayerCommands: state.alterationsResponse.multiple.sendPlayerCommands,
})

Player = withNavigate(connect(
    mapStateToProps,
    {
        sendPlayerCommand,
    }
)(Player))

export default Player
