import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { formatDuration, formatTime, params } from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { loadPlayerDigest, sendPlayerCommands } from 'actions/player'
import Playlist from './playlist/List'
import { Status } from 'reducers/alterationsStatus'
import PlayerNotification from './Notification'
import { playerDigestPropType, playerCommandsPropType } from 'reducers/player'

class Player extends Component {
    static propTypes = {
        playerDigest: playerDigestPropType.isRequired,
        commands: playerCommandsPropType.isRequired,
        loadPlayerDigest: PropTypes.func.isRequired,
        sendPlayerCommands: PropTypes.func.isRequired,
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
        const { status: playerStatus, manage: playerCommand, errors: playerErrors } = this.props.playerDigest.data
        const { fetchError } = this.props.playerDigest
        let song
        let songSubtitle
        let songData
        let playlistEntryOwner
        let duration
        let progress
        const isPlaying = !!playerStatus.playlist_entry
        let playIconClassAray = []

        /**
         * Song display if any song is currently playing
         */

        if (isPlaying){
            song = playerStatus.playlist_entry.song
            duration = playerStatus.playlist_entry.song.duration

            songData = (
                    <Song
                        song={song}
                        noDuration
                        noTag
                        />
                )

            playlistEntryOwner = (
                    <UserWidget
                        user={playerStatus.playlist_entry.owner}
                        className="playlist-entry-owner"
                    />
                )

            progress = playerStatus.timing * 100 / duration;

            // use playercmd pause status instead of player pause status
            playIconClassAray.push({
                'fa-play': playerCommand.pause,
                'fa-pause': !playerCommand.pause
            })
        } else {
            playIconClassAray.push('fa-stop')
            progress = 0
            duration = 0
        }

        let progressStyle = {width: `${progress}%`}

        /**
         * Play/pause button
         */

        let playPauseIcon
        const commandPauseStatus = this.props.commands.pause.status
        if (commandPauseStatus != Status.pending) {
            playPauseIcon = (
                <CSSTransition
                    classNames="managed"
                    timeout={150}
                >
                    <span
                        className="managed icon"
                        key={playerCommand.pause ? 'play' : 'pause'}
                    >
                        <i className={classNames('fa', playIconClassAray)}></i>
                    </span>
                </CSSTransition>
            )
        }

        /**
         * Skip button
         */

        let skipIcon
        const commandSkipStatus = this.props.commands.skip.status
        if (commandSkipStatus != Status.pending) {
            skipIcon = (
                <CSSTransition
                    classNames="managed"
                    timeout={150}
                >
                    <span
                        className="managed icon"
                    >
                        <i className="fa fa-step-forward"></i>
                    </span>
                </CSSTransition>
            )
        }

        /**
         * classes
         */

        const controlDisabled = !isPlaying || fetchError
        const playPauseClass = classNames(
            'control',
            'primary',
            {
                'managed-error': commandPauseStatus == Status.failed
            }
        )

        const skipClass = classNames(
            'control',
            'primary',
            {
                'managed-error': commandSkipStatus == Status.failed
            }
        )

        return (
            <div className="box">
                <div id="player">
                    <div className="display-area">
                        <div className="controls">
                            <IsPlaylistManagerOrOwner
                                object={playerStatus.playlist_entry}
                                disable
                            >
                                <button
                                    className={playPauseClass}
                                    onClick={() => {
                                        this.props.sendPlayerCommands({pause: !playerCommand.pause})
                                    }}
                                    disabled={controlDisabled}
                                >
                                    <TransitionGroup>
                                        {playPauseIcon}
                                    </TransitionGroup>
                                </button>
                            </IsPlaylistManagerOrOwner>
                            <IsPlaylistManagerOrOwner
                                object={playerStatus.playlist_entry}
                                disable
                            >
                                <button
                                    className={skipClass}
                                    onClick={() => this.props.sendPlayerCommands({skip: true})}
                                    disabled={controlDisabled}
                                >
                                    <TransitionGroup>
                                        {skipIcon}
                                    </TransitionGroup>
                                </button>
                            </IsPlaylistManagerOrOwner>
                        </div>
                        <div className="song-container notifiable">
                            {songData}
                            {playlistEntryOwner}
                            <div className="song-timing">
                                <div className="current">
                                    {formatTime(playerStatus.timing)}
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
                                    this.props.commands.pause,
                                    this.props.commands.skip
                                ]}
                                playerErrors={playerErrors}
                            />
                        </div>
                    </div>
                    <div className="progressbar">
                        <div className="progress" style={progressStyle}></div>
                    </div>
                </div>
                <Playlist/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerDigest: state.player.digest,
    commands: state.player.commands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        loadPlayerDigest,
        sendPlayerCommands,
    }
)(Player))

export default Player
