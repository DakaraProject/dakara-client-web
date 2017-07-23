import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import utils from '../utils'
import SongPreviewDetails from './SongPreviewDetails'

export default class Player extends Component {
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
        let songOwner
        let playIcon = "fa fa-"
        let duration
        let progress
        const isPlaying = !!playerStatus.playlist_entry

        /**
         * Song display if any song is currently playing
         */

        if (isPlaying){
            song = playerStatus.playlist_entry.song
            duration = playerStatus.playlist_entry.song.duration
            if (song.subtitle) {
                songSubtitle = (<span className="subtitle">
                        {song.subtitle}
                    </span>)
            }

            songData = (
                    <div className="song-preview">
                        <span className="header">
                            <span className="title">
                                {song.title}
                            </span>
                            {songSubtitle}
                        </span>
                        <SongPreviewDetails song={song} />
                    </div>
                    )

            songOwner = playerStatus.playlist_entry.owner.username

            progress = playerStatus.timing * 100 / duration;

            // use playercmd pause status instead of player pause status
            playIcon += playerCommand.pause ? "play" : "pause"
        } else {
            playIcon += "stop"
            progress = 0
            duration = 0
        }

        let progressStyle = { width: progress + "%"}

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
                    <i className={playIcon}></i>
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

        return (
            <div id="player">
                <div className="display">
                    <div className="controls">
                        <button
                            className={
                                "control primary"
                                    + (controlDisabled ? " disabled" : "")
                                    + (pauseError ? " managed_error" : "")
                            }
                            onClick={() => {
                                this.props.sendPlayerCommands({pause: !playerCommand.pause})
                            }
                            }
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
                        <button
                            className={
                                "control primary"
                                    + (controlDisabled ? " disabled" : "")
                                    + (skipError ? " managed_error" : "")
                            }
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
                </div>
                <div className="song notifiable">
                    {songData}
                    <div className="song-owner">
                        <span className="icon">
                            <i className="fa fa-user-o"></i>
                        </span>
                        {songOwner}
                    </div>
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
        )
    }
}
