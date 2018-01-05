import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import classNames from 'classnames'
import utils from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { loadPlayerStatus, sendPlayerCommands } from 'actions'
import Playlist from './playlist/List'

class Player extends Component {
    pollPlayerStatus = () => {
        if (!this.props.playerStatus.isFetching) {
            this.props.loadPlayerStatus()
        }
        this.timeout = setTimeout(this.pollPlayerStatus, utils.params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlayerStatus()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { status: playerStatus, manage: playerCommand } = this.props.playerStatus.data
        const { fetchError } = this.props.playerStatus
        let song
        let songSubtitle
        let songData
        let playlistEntryOwner
        let duration
        let progress
        const isPlaying = !!playerStatus.playlist_entry
        const playIconClassAray = ['fa']

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

        let progressStyle = { width: `${progress}%`}

        /**
         * Play/pause button
         */

        let playPausebtn
        let {
            pending: isPausing,
            error: pauseError,
            counter: pauseCounter
        } = this.props.commands.pause

        if (!isPausing) {
            playPausebtn = (
                <span className="managed icon" key={pauseCounter}>
                    <i className={classNames(playIconClassAray)}></i>
                </span>
            )
        }

        /**
         * Skip button
         */

        let skipBtn
        let { pending: isSkipping, error: skipError } = this.props.commands.skip

        if (!isSkipping) {
            skipBtn = (
                <span className="managed icon">
                    <i className="fa fa-step-forward"></i>
                </span>
            )
        }

        /**
         * Error notification
         */

        let notificationBanner
        let errorNotification = this.props.errorNotification

        if (errorNotification) {
            notificationBanner = (
                <div
                    key={errorNotification.id}
                    className="notified"
                >
                    <div className="notification danger">
                        <div className="message">
                            {errorNotification.message}
                        </div>
                    </div>
                </div>
            )
        } else if (fetchError) {
            notificationBanner = (
                <div
                    key="fetchError"
                    className="notified"
                >
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
        }

        const controlDisabled = !isPlaying || fetchError

        // classes
        const playPauseClass = classNames(
            'control',
            'primary',
            {
                'managed-error': pauseError
            }
        )

        const skipClass = classNames(
            'control',
            'primary',
            {
                'managed-error': skipError
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
                                    <ReactCSSTransitionGroup
                                        transitionName="managed"
                                        transitionEnterTimeout={150}
                                        transitionLeaveTimeout={150}
                                    >
                                        {playPausebtn}
                                    </ReactCSSTransitionGroup>
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
                                    <ReactCSSTransitionGroup
                                        transitionName="managed"
                                        transitionEnterTimeout={150}
                                        transitionLeaveTimeout={150}
                                    >
                                        {skipBtn}
                                    </ReactCSSTransitionGroup>
                                </button>
                            </IsPlaylistManagerOrOwner>
                        </div>
                        <div className="song-container notifiable">
                            {songData}
                            {playlistEntryOwner}
                            <div className="song-timing">
                                <div className="current">
                                    {utils.formatTime(playerStatus.timing)}
                                </div>
                                <div className="duration">
                                    {utils.formatDuration(duration)}
                                </div>
                            </div>
                            <ReactCSSTransitionGroup
                                transitionName="notified"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={150}
                            >
                                {notificationBanner}
                            </ReactCSSTransitionGroup>
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
    playerStatus: state.player.status,
    commands: state.player.commands,
    errorNotification: state.player.errorNotification
})

Player = connect(
    mapStateToProps,
    { loadPlayerStatus, sendPlayerCommands }
)(Player)

export default Player
