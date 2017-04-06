import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../utils';
import SongPreviewDetails from './SongPreviewDetails';

export default class Player extends React.Component {
/*    state = {notifications: []}

    clearNotification = () => {
        var newNotifications = this.state.notifications;
        newNotifications.shift();
        this.setState({notifications: newNotifications});
        if (newNotifications.length > 0) {
            setTimeout(this.clearNotification, newNotifications[0].timeout);
        }
    }

    addNotification = (message, type, timeout) =>{
        var newNotifications = this.state.notifications.concat({
                id : Math.floor((Math.random() * 100000)),
                message: message,
                type: type,
                timeout: timeout
            });

        this.setState({
            notifications: newNotifications
        });
        if (newNotifications.length == 1) {
            setTimeout(this.clearNotification, timeout);
        }
    }

    handleReponse = (status, cmd) =>{
        var cmdString;
        if (cmd.pause != null){
            if (cmd.pause){
                cmdString = "pause"; 
            } else {
                cmdString = "unpause"; 
            }
        } else if (cmd.skip != null){
            cmdString = "skip";
        }
        if (status) {
            if (cmd.skip){
                this.addNotification("Skipped!", "success", 2000);
            }
        } else {
            this.addNotification("Error attempting to " + cmdString, "danger", 5000);
        }
    }

    handlePlayPause = (e) =>{
        if (this.props.playerStatus.playlist_entry){
            var pause = !this.props.userCmd.pause;
            this.props.sendPlayerCommand({"pause": pause}, this.handleReponse);
        }
    }

    handleSkip = (e) =>{
        if (this.props.playerStatus.playlist_entry){
            this.props.sendPlayerCommand({"skip": true}, this.handleReponse);
        }
    }
*/
    componentDidMount() {
        this.props.loadPlayerStatus();
        setInterval(this.props.loadPlayerStatus, 1000);
    }

    render() {
        const playerStatus = this.props.playerStatus;
        let song;
        let songData;
        let playIcon = "fa fa-";
        let duration;
        let progress;
        if (playerStatus.playlist_entry){
            song = playerStatus.playlist_entry.song;
            duration = playerStatus.playlist_entry.song.duration;
            songData = (
                    <div className="song-info">
                        <div className="title">
                            {song.title}
                        </div>
                        <SongPreviewDetails song={song} />
                    </div>
                    );

            progress = playerStatus.timing * 100 / duration; 

            // TODO user playercmd pause status instead of player pause status
            playIcon += playerStatus.pause ? "play" : "pause";
        } else {
            playIcon += "stop";
            progress = 0;
            duration = 0;
        }

        let progressStyle = { width: progress + "%"};

        let playPausebtn = (<i className={playIcon}></i>);

        let skipBtn = (<i className="fa fa-step-forward"></i>);
/*
        var message;
        if(this.state.notifications.length > 0){
            message = (<div key={this.state.notifications[0].id} className="notified"><div className={"notification " + this.state.notifications[0].type}>{this.state.notifications[0].message}</div></div>);
        }
*/
        return (
        <div id="player">
            <div className="display">
                <div className="controls">
                    <div className={"play-pause control primary" + (playerStatus.playlist_entry ? "" : " disabled")} onClick={this.handlePlayPause}>
                        {playPausebtn} 
                    </div>
                    <div className={"skip control primary" + (playerStatus.playlist_entry ? "" : " disabled")} onClick={this.handleSkip}>
                        {skipBtn}
                    </div>
                </div>
                <div className="song">
                    {songData}
                    <div className="status">
                        <div id="playlist-current-timing" className="current">{utils.formatTime(playerStatus.timing)}</div>
                        <div id="playlist-total-timing" className="duration">{utils.formatDuration(duration)}</div>
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
        );

    }
}