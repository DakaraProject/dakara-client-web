import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import utils from '../utils'
import SongPreviewDetails from './SongPreviewDetails'

export default class Player extends Component {
    // TODO : old code related to player notifications
/*    state = {notifications: []}

    clearNotification = () => {
        var newNotifications = this.state.notifications
        newNotifications.shift()
        this.setState({notifications: newNotifications})
        if (newNotifications.length > 0) {
            setTimeout(this.clearNotification, newNotifications[0].timeout)
        }
    }

    addNotification = (message, type, timeout) =>{
        var newNotifications = this.state.notifications.concat({
                id : Math.floor((Math.random() * 100000)),
                message: message,
                type: type,
                timeout: timeout
            })

        this.setState({
            notifications: newNotifications
        })
        if (newNotifications.length == 1) {
            setTimeout(this.clearNotification, timeout)
        }
    }

    handleReponse = (status, cmd) =>{
        var cmdString
        if (cmd.pause != null){
            if (cmd.pause){
                cmdString = "pause"; 
            } else {
                cmdString = "unpause"; 
            }
        } else if (cmd.skip != null){
            cmdString = "skip"
        }
        if (status) {
            if (cmd.skip){
                this.addNotification("Skipped!", "success", 2000)
            }
        } else {
            this.addNotification("Error attempting to " + cmdString, "danger", 5000)
        }
    }
*/
    state = {
        playPauseKey: 0
    }

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

    componentWillReceiveProps(nextProps) {
        const pendingNext = nextProps.commands.pause.pending
        const pendingCurrent = this.props.commands.pause.pending

        if (pendingNext && !pendingCurrent) {
            this.setState({playPauseKey: this.state.playPauseKey + 1})
        }
    }

    render() {
        const { status: playerStatus, manage: playerCommand } = this.props.playerStatus.data
        let song
        let songSubtitle
        let songData
        let playIcon = "fa fa-"
        let duration
        let progress

        /**
         * Song display if any song is currently playing
         */

        if (playerStatus.playlist_entry){
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
        let { pending: isPausing, error: pauseError } = this.props.commands.pause

        if (!isPausing) {
            playPausebtn = (
                <span className="managed" key={this.state.playPauseKey}>
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
            skipBtn = (<i className="fa fa-step-forward managed"></i>)
        }
/*
        var message
        if(this.state.notifications.length > 0){
            message = (<div key={this.state.notifications[0].id} className="notified"><div className={"notification " + this.state.notifications[0].type}>{this.state.notifications[0].message}</div></div>)
        }
*/
        return (
        <div id="player">
            <div className="display">
                <div className="controls">
                    <button
                        className={
                            "control primary"
                                + (playerStatus.playlist_entry ? "" : " disabled")
                                + (pauseError ? " managed_error" : "")
                        }
                        onClick={() => {
                                this.props.sendPlayerCommands({pause: !playerCommand.pause})
                            }
                        }
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
                                + (playerStatus.playlist_entry ? "" : " disabled")
                                + (skipError ? " managed_error" : "")
                        }
                        onClick={() => this.props.sendPlayerCommands({skip: true})}
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
                <div className="song">
                    {songData}
                    <div className="song-timing">
                        <div className="current">
                            {utils.formatTime(playerStatus.timing)}
                        </div>
                        <div className="duration">
                            {utils.formatDuration(duration)}
                        </div>
                    </div>
                    { /*
                    <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                        {message}
                    </ReactCSSTransitionGroup>
                    */}
                </div>
            </div>
            <div className="progressbar">
                <div className="progress" style={progressStyle}></div>
            </div>
        </div>
        )
    }
}
